import { createFileRoute, Link } from '@tanstack/react-router'
import { AgentPanel } from '../../components/AgentPanel'
import { SkillDetailSection } from '../../components/SkillDetailSection'
import { SkillInvokeText } from '../../components/SkillInvokeText'
import { TerminalPromptBlock } from '../../components/TerminalPromptBlock'
import { AGENT_SKILL_SLUG } from '../../content/overlay'
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

        {skill.prerequisites && skill.prerequisites.length > 0 && (
          <SkillDetailSection label={m.skillDetail_prerequisites()}>
            <ul className='list-disc space-y-1.5 ps-5'>
              {skill.prerequisites.map(item => (
                <li key={item}>
                  <SkillInvokeText text={item} />
                </li>
              ))}
            </ul>
          </SkillDetailSection>
        )}

        {skill.howTo && skill.howTo.length > 0 && (
          <SkillDetailSection label={m.skillDetail_howTo()}>
            <ol className='list-decimal space-y-1.5 ps-5'>
              {skill.howTo.map(item => (
                <li key={item}>
                  <SkillInvokeText text={item} />
                </li>
              ))}
            </ol>
          </SkillDetailSection>
        )}

        {skill.doneWhen && (
          <SkillDetailSection label={m.skillDetail_doneWhen()}>
            <p>
              <SkillInvokeText text={skill.doneWhen} />
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

        {skill.tips && skill.tips.length > 0 && (
          <SkillDetailSection label={m.skillDetail_tips()}>
            <ul className='list-disc space-y-1.5 ps-5'>
              {skill.tips.map(item => (
                <li key={item}>
                  <SkillInvokeText text={item} />
                </li>
              ))}
            </ul>
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

        {skill.relatedAgents && !skill.agentPanel && (
          <div className='mt-8 flex flex-wrap gap-4 font-invoke text-sm'>
            {skill.relatedAgents.map(agent => {
              const agentSlug = AGENT_SKILL_SLUG[agent]
              if (!agentSlug) {
                return (
                  <span className='text-muted' key={agent}>
                    {agent}
                  </span>
                )
              }
              return (
                <Link
                  className='text-primary-700 hover:underline'
                  key={agent}
                  params={{ slug: agentSlug }}
                  search={mergeSkillsSearch}
                  to='/skills/$slug'
                >
                  {agent}
                </Link>
              )
            })}
          </div>
        )}

        <div className='mt-10 border-line border-t pt-6'>
          <Link
            className='inline-block font-medium text-primary-700 text-sm no-underline hover:underline'
            search={mergeSkillsSearch}
            to='/skills'
          >
            ← {m.footer_link_catalog()}
          </Link>
        </div>
      </div>
    </div>
  )
}
