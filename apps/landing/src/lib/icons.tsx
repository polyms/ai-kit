import type { ComponentProps } from 'react'
import {
  ArrowRight,
  Command,
  Copy,
  Magnifier,
  Moon,
  SquareArrowRight,
  Sun,
} from '@solar-icons/react-perf/Linear'

type IconProps = ComponentProps<typeof Sun>

const base: IconProps = {
  size: 20,
  color: 'currentColor',
}

function withDefaults(props: IconProps) {
  return { ...base, ...props }
}

export function IconSun(props: IconProps) {
  return <Sun {...withDefaults(props)} />
}

export function IconMoon(props: IconProps) {
  return <Moon {...withDefaults(props)} />
}

export function IconMagnifier(props: IconProps) {
  return <Magnifier {...withDefaults(props)} />
}

export function IconCopy(props: IconProps) {
  return <Copy {...withDefaults(props)} />
}

export function IconArrowRight(props: IconProps) {
  return <ArrowRight {...withDefaults(props)} />
}

export function IconSquareArrowRight(props: IconProps) {
  return <SquareArrowRight {...withDefaults(props)} />
}

export function IconCommand(props: IconProps) {
  return <Command {...withDefaults(props)} />
}
