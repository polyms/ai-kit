import { Link, createFileRoute } from '@tanstack/react-router'
import { defaultSkillsSearch } from '../../lib/skills-search'
import { getSkillBySlug } from '../../lib/skills'
import { TerminalPromptBlock } from '../../components/TerminalPromptBlock'
import { useT } from '../../lib/i18n'
import { GITHUB_REPO } from '../../content/overlay'

export const Route = createFileRoute('/skills/$slug')({
  component: SkillDetailPage,
})

function SkillDetailPage() {
  const { slug } = Route.useParams()
  const skill = getSkillBySlug(slug)
  const t = useT()

  if (!skill) {
    return (
      <div className='page-x py-16 text-center'>
        <p className='text-lg'>{t('catalog.notFound')}</p>
        <Link
          to='/skills'
          search={defaultSkillsSearch}
          className='mt-4 inline-block font-invoke text-primary-700 hover:underline'
        >
          {t('catalog.back')}
        </Link>
      </div>
    )
  }

  const domainLabel = t(`domain.${skill.domain}` as 'domain.alignment')

  return (
    <div className='page-x py-10 md:py-12'>
      <div className='mx-auto max-w-3xl'>
        <div className='flex border-line border-b'>
          <div className='border-primary-700 border-b-2 px-4 py-2 font-bold font-invoke text-lg text-primary-700'>
            {skill.invoke}
          </div>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-2'>
          <span className='rounded-md border border-line px-2 py-0.5 text-muted text-xs'>{domainLabel}</span>
          <span className='rounded-md bg-success-500/10 px-2 py-0.5 text-success-600 text-xs'>
            {t('catalog.status.available')}
          </span>
          <span className='rounded-md border border-line px-2 py-0.5 text-muted text-xs'>
            {skill.invocation === 'user' ? t('catalog.filterUser') : t('catalog.filterModel')}
          </span>
        </div>

        <p className='mt-4 text-muted'>{skill.description}</p>
        {skill.footnote && <p className='mt-2 text-muted text-sm'>{skill.footnote}</p>}

        {skill.samplePrompt && (
          <div className='mt-8'>
            <p className='label-mono mb-3'>{t('catalog.samplePrompt')}</p>
            <TerminalPromptBlock label='prompt' text={skill.samplePrompt} skill={skill.slug} />
          </div>
        )}

        {skill.agentHint && (
          <div className='mt-6 border-line border-s-4 border-dashed bg-surface-2/30 p-4'>
            <p className='label-mono'>{t('catalog.agentHint')}</p>
            <pre className='mt-2 font-invoke text-sm'>{skill.agentHint}</pre>
          </div>
        )}

        {!skill.samplePrompt && skill.slug === 'arch' && (
          <div className='mt-8 border border-line bg-surface p-4 text-muted text-sm'>
            Model-invoked — agent reaches via description when placing seams or deepening modules.
          </div>
        )}

        <div className='mt-8 flex flex-wrap gap-4 font-invoke text-sm'>
          <a
            href={`${GITHUB_REPO}/tree/main/${skill.githubPath}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary-700 hover:underline'
          >
            {t('catalog.viewSource')} ↗
          </a>
          {skill.relatedAgents?.map(agent => (
            <a
              key={agent}
              href={`${GITHUB_REPO}/blob/main/agents/${agent}.md`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted hover:text-fg'
            >
              {agent} ↗
            </a>
          ))}
        </div>

        <Link
          to='/skills'
          search={defaultSkillsSearch}
          className='mt-10 inline-block text-muted text-sm hover:text-fg'
        >
          ← {t('catalog.back')}
        </Link>
      </div>
    </div>
  )
}
