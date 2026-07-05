import { createFileRoute, Link as RouterLink } from '@tanstack/react-router'
import {
  GuideBreadcrumb,
  GuideChecklist,
  GuideLocalNav,
  SeamSectionBlock,
  SiblingLink,
} from '../../components/guides'
import { AxisTagRow } from '../../components/runbooks'
import { defaultGuidesSearch, getGuideFn } from '../../lib/guides/guide.fns'
import { m } from '../../paraglide/messages.js'

function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const Route = createFileRoute('/guides/$id')({
  loader: async ({ params: { id } }) => {
    try {
      return { guide: await getGuideFn({ data: { id } }) }
    } catch {
      throw new Error('NOT_FOUND')
    }
  },
  component: GuideDetailPage,
  errorComponent: GuideNotFound,
})

function GuideNotFound() {
  return (
    <div className='page-x section-y mx-auto max-w-4xl'>
      <p className='text-muted'>{m.guides_notFound()}</p>
      <RouterLink className='link link-primary mt-4 inline-block' search={defaultGuidesSearch} to='/guides'>
        {m.guides_backToIndex()}
      </RouterLink>
    </div>
  )
}

function GuideDetailPage() {
  const { guide } = Route.useLoaderData()

  const localSections = [
    { id: 'design-checklist', label: m.guides_designChecklist() },
    ...guide.seamSections.map(section => ({
      id: slugifyHeading(section.title),
      label: section.title,
    })),
  ]

  return (
    <div className='guide-page page-x section-y mx-auto max-w-4xl'>
        <GuideBreadcrumb items={[{ label: m.guides_title(), href: '/guides' }, { label: guide.id }]} />

        <GuideLocalNav sections={localSections} />

        <p className='label-mono'>{guide.id}</p>
        <h1 className='h1 mt-2'>
          {guide.id}: {guide.title}
        </h1>
        <p className='mt-2 text-muted'>
          {m.guides_audience()}: {guide.audience}
        </p>
        <div className='mt-4'>
          <AxisTagRow tags={guide.axisTags} />
        </div>

        {guide.relatedRunbook ? (
          <SiblingLink id={guide.relatedRunbook.id} kind='runbook' title={guide.relatedRunbook.title} />
        ) : null}

        <section className='guide-section mt-12' id='design-checklist'>
          <h2 className='h2'>{m.guides_designChecklist()}</h2>
          <GuideChecklist items={guide.designChecklist} />
        </section>

        {guide.seamSections.map(section => (
          <SeamSectionBlock key={section.title} section={section} />
        ))}

        {guide.relatedRunbook ? (
          <section className='guide-section' id='related-runbook'>
            <h2 className='h2'>{m.guides_relatedRunbook()}</h2>
            <SiblingLink id={guide.relatedRunbook.id} kind='runbook' title={guide.relatedRunbook.title} />
          </section>
        ) : null}
      </div>
  )
}
