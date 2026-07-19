import { CheckCircle } from '@solar-icons/react-perf/Bold'
import {
  BookBookmark,
  ChecklistMinimalistic,
  CodeSquare,
  DangerTriangle,
  PaletteRound,
  Tuning2,
} from '@solar-icons/react-perf/BoldDuotone'
import { Copy, Magnifier } from '@solar-icons/react-perf/Linear'
import type { ComponentProps } from 'react'

type IconProps = ComponentProps<typeof Magnifier>

const base: IconProps = {
  size: 20,
  color: 'currentColor',
}

function withDefaults(props: IconProps) {
  return { ...base, ...props }
}

export function IconMagnifier(props: IconProps) {
  return <Magnifier {...withDefaults(props)} />
}

export function IconCopy(props: IconProps) {
  return <Copy {...withDefaults(props)} />
}

export function IconBookBookmark(props: IconProps) {
  return <BookBookmark {...withDefaults(props)} />
}

export function IconDangerTriangle(props: IconProps) {
  return <DangerTriangle {...withDefaults(props)} />
}

export function IconPaletteRound(props: IconProps) {
  return <PaletteRound {...withDefaults(props)} />
}

export function IconCodeSquare(props: IconProps) {
  return <CodeSquare {...withDefaults(props)} />
}

export function IconCheckCircle(props: IconProps) {
  return <CheckCircle {...withDefaults(props)} />
}

export function IconChecklistMinimalistic(props: IconProps) {
  return <ChecklistMinimalistic {...withDefaults(props)} />
}

export function IconTuning2(props: IconProps) {
  return <Tuning2 {...withDefaults(props)} />
}
