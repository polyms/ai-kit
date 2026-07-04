import type { ComponentProps, ReactElement } from 'react'
import {
  ChatRoundDots,
  ChecklistMinimalistic,
  ClipboardList,
  CodeSquare,
  DocumentText,
  LinkRound,
  MagicStick3,
  PaletteRound,
  ShieldCheck,
  SortByTime,
  Structure,
} from '@solar-icons/react-perf/BoldDuotone'

type IconComponent = (props: ComponentProps<typeof LinkRound>) => ReactElement

const iconProps = { size: 22, color: 'var(--brand-accent)' } as const

export const skillIconBySlug: Record<string, IconComponent> = {
  setup: p => <LinkRound {...iconProps} {...p} />,
  align: p => <ChatRoundDots {...iconProps} {...p} />,
  pm: p => <ClipboardList {...iconProps} {...p} />,
  'to-prd': p => <DocumentText {...iconProps} {...p} />,
  'to-issues': p => <ChecklistMinimalistic {...iconProps} {...p} />,
  triage: p => <SortByTime {...iconProps} {...p} />,
  design: p => <PaletteRound {...iconProps} {...p} />,
  dev: p => <CodeSquare {...iconProps} {...p} />,
  'code-review': p => <ShieldCheck {...iconProps} {...p} />,
  craft: p => <MagicStick3 {...iconProps} {...p} />,
  'arch-refactor': p => <Structure {...iconProps} {...p} />,
  ux: p => <PaletteRound {...iconProps} {...p} />,
}

export function SkillIcon({ slug }: { slug: string }) {
  const Icon = skillIconBySlug[slug]
  if (!Icon) return <CodeSquare {...iconProps} />
  return <Icon />
}
