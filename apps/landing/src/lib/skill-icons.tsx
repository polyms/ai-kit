import {
  ChatRoundDots,
  ChecklistMinimalistic,
  ClipboardList,
  CodeSquare,
  DocumentText,
  LinkRound,
  MagicStick3,
  PaletteRound,
  ServerSquare,
  ShieldCheck,
  SortByTime,
  Structure,
} from '@solar-icons/react-perf/BoldDuotone'
import type { ComponentProps, ReactElement } from 'react'
import type { SkillPackName } from './skill-pack/skill-pack'

type IconComponent = (props: ComponentProps<typeof LinkRound>) => ReactElement

const iconProps = { size: 22, className: 'text-primary-600' } as const

export const skillIconBySlug = {
  research: p => <DocumentText {...iconProps} {...p} />,
  business: p => <Structure {...iconProps} {...p} />,
  task: p => <ChecklistMinimalistic {...iconProps} {...p} />,
  bug: p => <ShieldCheck {...iconProps} {...p} />,
  track: p => <SortByTime {...iconProps} {...p} />,
  plan: p => <ClipboardList {...iconProps} {...p} />,
  qa: p => <ChecklistMinimalistic {...iconProps} {...p} />,
  comms: p => <ChatRoundDots {...iconProps} {...p} />,
  review: p => <ShieldCheck {...iconProps} {...p} />,
  release: p => <ServerSquare {...iconProps} {...p} />,
  setup: p => <LinkRound {...iconProps} {...p} />,
  align: p => <ChatRoundDots {...iconProps} {...p} />,
  'align-loop': p => <ChatRoundDots {...iconProps} {...p} />,
  'domain-modeling': p => <Structure {...iconProps} {...p} />,
  collab: p => <LinkRound {...iconProps} {...p} />,
  'build-feature-map': p => <Structure {...iconProps} {...p} />,
  reqs: p => <ClipboardList {...iconProps} {...p} />,
  design: p => <PaletteRound {...iconProps} {...p} />,
  dev: p => <CodeSquare {...iconProps} {...p} />,
  'code-review': p => <ShieldCheck {...iconProps} {...p} />,
  craft: p => <MagicStick3 {...iconProps} {...p} />,
  'arch-refactor': p => <Structure {...iconProps} {...p} />,
  arch: p => <Structure {...iconProps} {...p} />,
  devops: p => <ServerSquare {...iconProps} {...p} />,
  docs: p => <DocumentText {...iconProps} {...p} />,
  e2e: p => <ChecklistMinimalistic {...iconProps} {...p} />,
} satisfies Record<SkillPackName, IconComponent>

export function SkillIcon({ slug }: { slug: string }) {
  const Icon = Object.hasOwn(skillIconBySlug, slug) ? skillIconBySlug[slug as SkillPackName] : undefined
  if (!Icon) return <CodeSquare {...iconProps} />
  return <Icon />
}
