// @ts-nocheck
// Inlang loads this file as JavaScript (data: URL). No top-level imports — only node: inside async hooks.
// Import/export delegates to @inlang/plugin-message-format (plural, markup, variants, escape, unflatten).
// Syntax matches https://inlang.com/schema/inlang-message-format — complex messages use a one-element array;
// quote declarations that contain colons, e.g. - "local countPlural = count: plural"

const PLUGIN_KEY = 'plugin.inlang.yaml'
const MESSAGE_FORMAT_KEY = 'plugin.inlang.messageFormat'
const YAML_SCHEMA_URL = 'https://inlang.com/schema/inlang-message-format'

/** @returns {typeof import('yaml')} */
async function loadYaml() {
	const { createRequire } = await import('node:module')
	const { join } = await import('node:path')
	return createRequire(join(process.cwd(), 'package.json'))('yaml')
}

/** @returns {import('@inlang/plugin-message-format').default} */
async function loadMessageFormatPlugin() {
	const { createRequire } = await import('node:module')
	const { join } = await import('node:path') 
	const mod = createRequire(join(process.cwd(), 'package.json'))('@inlang/plugin-message-format')
	return mod.default ?? mod
}

/** @returns {string[]} */
function resolvePathPatterns(settings) {
	const configured = settings[PLUGIN_KEY]?.pathPattern
	const patterns = configured ?? './project.inlang/{locale}.yaml'
	return Array.isArray(patterns) ? patterns : [patterns]
}

/** @param {string} pattern @param {{ locale: string; namespace?: string }} tokens */
function fillPattern(pattern, { locale, namespace }) {
	let filled = pattern
	if (namespace !== undefined) {
		filled = filled.replaceAll('{namespace}', namespace)
	}
	return filled
		.replaceAll('{locale}', locale)
		.replaceAll('{languageTag}', locale)
		.replaceAll('{language}', locale)
}

/** @param {string} pattern */
function patternHasNamespace(pattern) {
	return pattern.includes('{namespace}')
}

/** @param {import('@inlang/sdk').ProjectSettings} settings */
function resolveNamespaceSeparator(settings) {
	return settings[PLUGIN_KEY]?.namespaceSeparator ?? '_'
}

/** @param {import('@inlang/sdk').ProjectSettings} settings */
function resolveDefaultNamespace(settings) {
	return settings[PLUGIN_KEY]?.defaultNamespace ?? 'common'
}

/** @param {string} value */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** @param {string} pattern */
function stripLeadingDotSlash(pattern) {
	return pattern.replace(/^\.\//, '')
}

/**
 * Build a regex that matches a relative path produced by `pattern`, capturing
 * `{namespace}` and `{locale}` tokens in source order.
 * @param {string} pattern @param {readonly string[]} locales
 * @returns {{ regex: RegExp; groups: Array<'locale' | 'namespace'> }}
 */
function buildPathMatcher(pattern, locales) {
	const normalized = stripLeadingDotSlash(pattern)
	const localeAlternation = locales.map(escapeRegExp).join('|')
	const tokenRe = /\{(locale|languageTag|language|namespace)\}/g
	/** @type {Array<'locale' | 'namespace'>} */
	const groups = []
	let regexStr = '^'
	let lastIndex = 0
	let match
	while ((match = tokenRe.exec(normalized)) !== null) {
		regexStr += escapeRegExp(normalized.slice(lastIndex, match.index))
		if (match[1] === 'namespace') {
			regexStr += '([^/]+)'
			groups.push('namespace')
		} else {
			regexStr += `(${localeAlternation})`
			groups.push('locale')
		}
		lastIndex = match.index + match[0].length
	}
	regexStr += `${escapeRegExp(normalized.slice(lastIndex))}$`
	return { regex: new RegExp(regexStr), groups }
}

/** Longest leading directory of `pattern` that contains no token. @param {string} pattern */
function staticBaseDir(pattern) {
	const normalized = stripLeadingDotSlash(pattern)
	const braceIndex = normalized.indexOf('{')
	const head = braceIndex === -1 ? normalized : normalized.slice(0, braceIndex)
	const slashIndex = head.lastIndexOf('/')
	return slashIndex === -1 ? '.' : head.slice(0, slashIndex)
}

/**
 * Scan the filesystem for files matching a namespaced `pattern`.
 * @param {string} pattern @param {readonly string[]} locales
 * @returns {Promise<Array<{ path: string; locale: string; namespace: string }>>}
 */
async function listNamespaceFiles(pattern, locales) {
	const fs = await import('node:fs/promises')
	const path = await import('node:path')
	const cwd = process.cwd()
	const { regex, groups } = buildPathMatcher(pattern, locales)
	const baseAbs = path.resolve(cwd, staticBaseDir(pattern))
	const localeSet = new Set(locales)
	/** @type {Array<{ path: string; locale: string; namespace: string }>} */
	const found = []

	/** @param {string} dirAbs */
	async function walk(dirAbs) {
		let entries
		try {
			entries = await fs.readdir(dirAbs, { withFileTypes: true })
		} catch {
			return
		}
		for (const entry of entries) {
			const fullPath = path.join(dirAbs, entry.name)
			if (entry.isDirectory()) {
				await walk(fullPath)
				continue
			}
			const relPath = path.relative(cwd, fullPath).split(path.sep).join('/')
			const execResult = regex.exec(relPath)
			if (!execResult) {
				continue
			}
			/** @type {string | undefined} */
			let locale
			let namespace = ''
			groups.forEach((group, index) => {
				const value = execResult[index + 1]
				if (group === 'locale') {
					locale = value
				} else {
					namespace = value
				}
			})
			if (!locale || !localeSet.has(locale)) {
				continue
			}
			found.push({ path: `./${relPath}`, locale, namespace })
		}
	}

	await walk(baseAbs)
	return found
}

/** @param {string} bundleId @param {string} separator @param {string} defaultNamespace */
function namespaceOf(bundleId, separator, defaultNamespace) {
	const index = bundleId.indexOf(separator)
	if (index <= 0) {
		return defaultNamespace
	}
	return bundleId.slice(0, index)
}

/**
 * YAML treats `local x = count: plural` as a map — restore message-format declaration strings.
 * @param {unknown} entry
 */
function normalizeDeclarationEntry(entry) {
	if (typeof entry === 'string') {
		return entry
	}
	if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
		return Object.entries(/** @type {Record<string, unknown>} */ (entry))
			.map(([key, value]) => {
				if (typeof value === 'string') {
					return `${key}: ${value}`
				}
				return key
			})
			.join(', ')
	}
	return String(entry)
}

/** @param {unknown} obj */
function isComplexMessageObject(obj) {
	return (
		obj !== null && typeof obj === 'object' && !Array.isArray(obj) && 'match' in /** @type {object} */ (obj)
	)
}

/** @param {unknown} obj */
function normalizeComplexMessageObject(obj) {
	const record = /** @type {Record<string, unknown>} */ (obj)
	const match = /** @type {Record<string, unknown>} */ (record.match ?? {})
	return {
		...record,
		declarations: Array.isArray(record.declarations)
			? record.declarations.map(normalizeDeclarationEntry)
			: record.declarations,
		selectors: Array.isArray(record.selectors)
			? record.selectors.map(item => String(item))
			: record.selectors,
		match: Object.fromEntries(Object.entries(match).map(([key, value]) => [key, String(value)])),
	}
}

/** @param {unknown} value */
function normalizeForMessageFormat(value) {
	if (typeof value === 'string' || value === null || value === undefined) {
		return value
	}
	if (Array.isArray(value)) {
		if (value.length > 0 && isComplexMessageObject(value[0])) {
			return value.map(item => normalizeComplexMessageObject(item))
		}
		return value.map(item => normalizeForMessageFormat(item))
	}
	if (typeof value === 'object') {
		/** @type {Record<string, unknown>} */
		const normalized = {}
		for (const [key, nested] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
			if (key === '$schema') {
				continue
			}
			normalized[key] = normalizeForMessageFormat(nested)
		}
		return normalized
	}
	return value
}

/** @param {unknown} parsed */
function yamlRootToJsonObject(parsed) {
	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		return {}
	}
	const root = { .../** @type {Record<string, unknown>} */ (parsed) }
	delete root.$schema
	return /** @type {Record<string, unknown>} */ (normalizeForMessageFormat(root))
}

/** @param {Record<string, unknown>} json @param {import('@inlang/sdk').ProjectSettings} settings @param {(value: unknown, options?: { lineWidth?: number }) => string} yamlStringify */
function formatGroupedYaml(json, settings, yamlStringify) {
	const separator = resolveNamespaceSeparator(settings)
	const sort = settings[PLUGIN_KEY]?.sort
	/** @type {Map<string, string[]>} */
	const groups = new Map()

	for (const key of Object.keys(json)) {
		const namespace = namespaceOf(key, separator, resolveDefaultNamespace(settings))
		const keys = groups.get(namespace) ?? []
		keys.push(key)
		groups.set(namespace, keys)
	}

	const parts = [`# ${YAML_SCHEMA_URL}`]

	for (const namespace of [...groups.keys()].sort((a, b) => a.localeCompare(b))) {
		let keys = groups.get(namespace) ?? []
		if (sort === 'asc' || sort === true) {
			keys = [...keys].sort((a, b) => a.localeCompare(b))
		} else if (sort === 'desc') {
			keys = [...keys].sort((a, b) => b.localeCompare(a))
		}

		/** @type {Record<string, unknown>} */
		const section = {}
		for (const key of keys) {
			section[key] = json[key]
		}

		parts.push('')
		parts.push(`# --- ${namespace} ---`)
		parts.push(yamlStringify(section, { lineWidth: 0 }).trimEnd())
	}

	return `${parts.join('\n')}\n`
}

/** @param {import('@inlang/sdk').ProjectSettings} settings */
function settingsForMessageFormat(settings) {
	const yamlPlugin = settings[PLUGIN_KEY] ?? {}
	return {
		...settings,
		[MESSAGE_FORMAT_KEY]: {
			...(settings[MESSAGE_FORMAT_KEY] ?? {}),
			...(yamlPlugin.sort ? { sort: yamlPlugin.sort } : {}),
		},
	}
}

/** @type {import('@inlang/sdk').InlangPlugin} */
const plugin = {
	key: PLUGIN_KEY,

	meta: {
		'app.inlang.ide-extension': {
			documentPaths: ['project.inlang/**/*.yaml', 'project.inlang/**/*.yml'],
		},
	},

	toBeImportedFiles: async ({ settings }) => {
		const patterns = resolvePathPatterns(settings)
		/** @type {Array<{ path: string; locale: string; metadata?: Record<string, unknown> }>} */
		const files = []
		for (const pattern of patterns) {
			if (patternHasNamespace(pattern)) {
				const namespaceFiles = await listNamespaceFiles(pattern, settings.locales)
				for (const file of namespaceFiles) {
					files.push({
						path: file.path,
						locale: file.locale,
						metadata: { namespace: file.namespace },
					})
				}
				continue
			}
			for (const locale of settings.locales) {
				files.push({
					path: fillPattern(pattern, { locale }),
					locale,
				})
			}
		}
		return files
	},

	importFiles: async ({ files, settings }) => {
		const { parse } = await loadYaml()
		const messageFormat = await loadMessageFormatPlugin()

		/** @type {import('@inlang/sdk').ImportFile[]} */
		const jsonFiles = files.map(file => {
			const parsed = parse(new TextDecoder().decode(file.content))
			const root = yamlRootToJsonObject(parsed)
			return {
				locale: file.locale,
				content: new TextEncoder().encode(JSON.stringify(root)),
				toBeImportedFilesMetadata: file.toBeImportedFilesMetadata,
			}
		})

		return messageFormat.importFiles({
			files: jsonFiles,
			settings: settingsForMessageFormat(settings),
		})
	},

	exportFiles: async ({ bundles, messages, variants, settings }) => {
		const { stringify: yamlStringify } = await loadYaml()
		const messageFormat = await loadMessageFormatPlugin()
		const [primaryPattern] = resolvePathPatterns(settings)

		const jsonExports = await messageFormat.exportFiles({
			bundles,
			messages,
			variants,
			settings: settingsForMessageFormat(settings),
		})

		const header = `# ${YAML_SCHEMA_URL}\n`
		/** @param {string} locale @param {string} name @param {Record<string, unknown>} json */
		const toYamlFile = (locale, name, json) => ({
			locale,
			name,
			content: new TextEncoder().encode(
				!patternHasNamespace(primaryPattern)
					? formatGroupedYaml(json, settings, yamlStringify)
					: `${header}${yamlStringify(json, { lineWidth: 0 }).trimEnd()}\n`,
			),
		})

		if (!patternHasNamespace(primaryPattern)) {
			return jsonExports.map(file => {
				const json = JSON.parse(new TextDecoder().decode(file.content))
				delete json.$schema
				return toYamlFile(file.locale, fillPattern(primaryPattern, { locale: file.locale }), json)
			})
		}

		const separator = resolveNamespaceSeparator(settings)
		const defaultNamespace = resolveDefaultNamespace(settings)
		/** @type {import('@inlang/sdk').ExportFile[]} */
		const result = []
		for (const file of jsonExports) {
			const json = JSON.parse(new TextDecoder().decode(file.content))
			delete json.$schema
			/** @type {Record<string, Record<string, unknown>>} */
			const byNamespace = {}
			for (const [key, value] of Object.entries(json)) {
				const namespace = namespaceOf(key, separator, defaultNamespace)
				;(byNamespace[namespace] ??= {})[key] = value
			}
			for (const [namespace, group] of Object.entries(byNamespace)) {
				result.push(
					toYamlFile(file.locale, fillPattern(primaryPattern, { locale: file.locale, namespace }), group),
				)
			}
		}
		return result
	},
}

export default plugin
