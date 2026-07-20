import { createFileRoute, Link } from '@tanstack/react-router'
import { AgentPanel } from '../../components/AgentPanel'
import { SkillDetailSection } from '../../components/SkillDetailSection'
import { SkillInvokeText } from '../../components/SkillInvokeText'
import { TerminalPromptBlock } from '../../components/TerminalPromptBlock'
import { GITHUB_REPO } from '../../content/overlay'
import { PipelineDisplay } from '../../lib/pipeline-display'
import { domainLabel, getSkillBySlug } from '../../lib/skills'
import { mergeSkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'
import { useAppStore } from '../../stores/useAppStore'

export const Route = createFileRoute('/skills/$slug')({
  component: SkillDetailPage,
})

function SkillDetailPage() {
  const { slug } = Route.useParams()
  const locale = useAppStore(s => s.locale)
  const skill = getSkillBySlug(slug, locale)

  if (!skill) {
    return (
      <div className='flex min-h-full flex-col items-center justify-center px-8 py-16 text-center'>
        <p className='text-lg'>{m.catalog_notFound()}</p>
        <Link
          className='mt-4 inline-block font-invoke text-primary-700 hover:underline'
          search={mergeSkillsSearch}
          to='/skills'
        >
          {m.catalog_back()}
        </Link>
      </div>
    )
  }

  const label = domainLabel(skill.domain)
  const summary = skill.summary ?? skill.description
  const showPrompt = Boolean(skill.samplePrompt)

  return (
    <div className='px-8 py-10 md:px-10 md:py-12'>
      <div className='mx-auto max-w-3xl'>
        <div className='flex border-line border-b'>
          <div className='border-primary-700 border-b-2 px-4 py-2 font-bold font-invoke text-lg text-primary-700'>
            {skill.invoke}
          </div>
        </div>

        <div className='mt-6 flex flex-wrap items-center gap-2'>
          <span className='rounded-md border border-line px-2 py-0.5 text-muted text-xs'>{label}</span>
          <span className='rounded-md border border-line px-2 py-0.5 text-muted text-xs'>
            {skill.invocation === 'user' ? m.catalog_filterUser() : m.catalog_filterModel()}
          </span>
        </div>

        <p className='mt-4 text-base text-fg leading-relaxed'>
          <SkillInvokeText text={summary} />
        </p>

        {skill.whenToUse && (
          <SkillDetailSection label={m.skillDetail_whenToUse()}>
            <p>
              <SkillInvokeText text={skill.whenToUse} />
            </p>
          </SkillDetailSection>
        )}

        {skill.pipeline && (
          <SkillDetailSection label={m.skillDetail_pipeline()}>
            <PipelineDisplay
              downstreamLabel={m.skillDetail_downstream()}
              pipeline={skill.pipeline}
              upstreamLabel={m.skillDetail_upstream()}
            />
          </SkillDetailSection>
        )}

        {skill.boundaries && (
          <SkillDetailSection label={m.skillDetail_boundaries()}>
            <p>
              <SkillInvokeText text={skill.boundaries} />
            </p>
          </SkillDetailSection>
        )}

        {skill.footnote && (
          <p className='mt-4 text-muted text-sm'>
            <SkillInvokeText text={skill.footnote} />
          </p>
        )}

        {showPrompt && (
          <div className='mt-8'>
            <p className='label-mono mb-3'>{m.catalog_samplePrompt()}</p>
            <TerminalPromptBlock label='prompt' skill={skill.slug} text={skill.samplePrompt!} />
          </div>
        )}

        {!showPrompt && skill.slug === 'arch' && skill.footnote && (
          <div className='mt-8 border border-line bg-surface p-4 text-muted text-sm'>
            <SkillInvokeText text={skill.footnote} />
          </div>
        )}

        {skill.agentPanel && <AgentPanel panel={skill.agentPanel} relatedAgents={skill.relatedAgents} />}

        <div className='mt-8 flex flex-wrap gap-4 font-invoke text-sm'>
          <a
            className='text-primary-700 hover:underline'
            href={`${GITHUB_REPO}/tree/main/${skill.githubPath}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            {m.catalog_viewSource()} ↗
          </a>
          {skill.relatedAgents &&
            !skill.agentPanel &&
            skill.relatedAgents.map(agent => (
              <a
                className='text-muted hover:text-fg'
                href={`${GITHUB_REPO}/blob/main/agents/${agent}.md`}
                key={agent}
                rel='noopener noreferrer'
                target='_blank'
              >
                {agent} ↗
              </a>
            ))}
        </div>

        <Link
          className='mt-10 inline-block text-muted text-sm hover:text-fg'
          search={mergeSkillsSearch}
          to='/skills'
        >
          ← {m.catalog_back()}
        </Link>
      </div>
    </div>
  )
}
