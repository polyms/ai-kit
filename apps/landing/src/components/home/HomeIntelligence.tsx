import { Link } from '@tanstack/react-router'
import { CodeSquare, LinkRound, Structure } from '@solar-icons/react-perf/BoldDuotone'
import { listSkillPacks } from '../../lib/skill-pack/skill-pack'
import { WORKFLOW_RECIPES } from '../../lib/skill-pack/skill-composition'
import { defaultSkillsSearch } from '../../lib/skills-search'
import { m } from '../../paraglide/messages.js'
import { HomeSectionChip } from './HomeSectionChip'

const FEATURES = [
  { icon: Structure, title: m.intelligence_discovery_title, body: m.intelligence_discovery_body },
  { icon: CodeSquare, title: m.intelligence_loading_title, body: m.intelligence_loading_body },
  { icon: LinkRound, title: m.intelligence_composition_title, body: m.intelligence_composition_body },
] as const

const RECIPE_COPY: Record<string, { title: () => string; body: () => string }> = {
  'product-development': { title: m.recipe_product, body: m.recipe_product_body },
  'bug-lifecycle': { title: m.recipe_bug, body: m.recipe_bug_body },
  'business-decision': { title: m.recipe_business, body: m.recipe_business_body },
  'sprint-planning': { title: m.recipe_sprint, body: m.recipe_sprint_body },
  'release-readiness': { title: m.recipe_release, body: m.recipe_release_body },
}

export function HomeIntelligence() {
  const packs = listSkillPacks()
  const example = packs.find(pack => pack.name === 'design')!

  return (
    <section className='app-home-section app-shell mx-auto max-w-[1080px]' id='intelligence'>
      <HomeSectionChip label={m.chip_intelligence()} n='03' />
      <h2 className='app-pipeline__title m-0 mb-3 font-bold font-sans text-fg'>
        {m.intelligence_title()}
      </h2>
      <p className='mb-9 max-w-[720px] text-muted'>{m.intelligence_intro()}</p>
      <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div className='rounded-[24px] border border-line bg-body p-6' key={title()}>
            <span className='app-catalog-card__icon mb-5 flex size-11 items-center justify-center rounded-full'>
              <Icon aria-hidden className='text-primary-600' size={22} />
            </span>
            <h3 className='m-0 mb-2 font-bold font-sans text-[18px] text-fg'>{title()}</h3>
            <p className='m-0 text-[14.5px] text-muted leading-relaxed'>{body()}</p>
          </div>
        ))}
      </div>

      <div className='mt-10 grid gap-5 md:grid-cols-2'>
        <div className='min-w-0 rounded-[24px] border border-line bg-body p-6'>
          <h3 className='m-0 mb-2 font-bold text-[18px] text-fg'>{m.intelligence_loading_example()}</h3>
          <p className='mb-4 text-sm text-muted'>{m.intelligence_loading_explain()}</p>
          <div className='app-terminal overflow-hidden rounded-2xl'>
            <div className='app-terminal__bar px-4 py-2 font-mono text-[11px]'>
              <span className='app-terminal__title'>MCP · selective retrieval</span>
            </div>
            <div className='space-y-3 px-4 py-4 font-mono text-[12.5px] leading-relaxed'>
              <div className='app-terminal__prompt'>list_skill_packs()</div>
              <div className='app-terminal__text break-all'>
                get_skill_pack({JSON.stringify({name: example.name, paths: example.starterPaths})})
              </div>
              <div className='app-terminal__dim'>{m.intelligence_loading_note()}</div>
            </div>
          </div>
        </div>
        <div className='app-catalog-card--featured rounded-[24px] border p-6'>
          <h3 className='m-0 mb-2 font-bold text-[18px] text-fg'>{m.intelligence_eval_title()}</h3>
          <p className='mb-4 text-sm text-muted'>{m.intelligence_eval_body()}</p>
          <div className='grid grid-cols-2 gap-4'>
            <div><div className='font-bold font-mono text-3xl text-primary-600'>{packs.length}</div><div className='text-sm text-muted'>{m.intelligence_packs()}</div></div>
            <div><div className='font-bold font-mono text-3xl text-primary-600'>{WORKFLOW_RECIPES.length}</div><div className='text-sm text-muted'>{m.intelligence_recipes()}</div></div>
          </div>
          <p className='mt-5 mb-3 text-[13.5px] text-muted'>{m.intelligence_eval_note()}</p>
          <p className='mb-0 text-[13.5px] text-muted'>{m.intelligence_eval_method()}</p>
        </div>
      </div>

      <div className='mt-12 mb-5 flex items-baseline gap-3.5'>
        <h3 className='m-0 font-bold font-sans text-[21px] text-fg tracking-tight'>{m.intelligence_workflows_title()}</h3>
        <span aria-hidden className='h-px flex-1 bg-line' />
      </div>
      <p className='mb-5 text-muted'>{m.intelligence_workflows_intro()}</p>
      <div className='grid gap-4'>
        {WORKFLOW_RECIPES.map(recipe => (
          <div className='rounded-[24px] border border-line bg-body p-5 sm:p-6' key={recipe.id}>
            <h4 className='m-0 font-bold text-fg'>{RECIPE_COPY[recipe.id]?.title() ?? recipe.title}</h4>
            <p className='mt-1 mb-0 text-sm text-muted'>{RECIPE_COPY[recipe.id]?.body() ?? recipe.description}</p>
            <div className='mt-3 flex flex-wrap items-center gap-2'>
              {recipe.skills.map((name, i) => (
                <div className='flex items-center gap-2' key={name}>
                  {i > 0 && <span aria-hidden className='font-mono text-muted'>→</span>}
                  <Link
                    className='rounded-xl border border-line bg-surface px-3 py-2 font-bold font-mono text-[13px] text-primary-600 no-underline hover:underline'
                    params={{slug: name}}
                    search={defaultSkillsSearch}
                    to='/skills/$slug'
                  >
                    /{name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className='mt-4 text-[13.5px] text-muted'>{m.intelligence_workflows_note()}</p>
    </section>
  )
}
