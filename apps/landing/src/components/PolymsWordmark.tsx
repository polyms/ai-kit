import clsx from 'clsx'
import { FaviconFit } from './FaviconFit'

const WORDMARK = {
  footer: {
    icon: 'h-20 w-auto',
    text: 'font-semibold text-2xl',
  },
  header: {
    icon: 'h-10 w-auto',
    text: 'mb-1.5 font-semibold tracking-tight',
  },
} as const

/** Icon + "olyms" — matches https://ui.polyms.dev/ header/footer wordmark. */
export function PolymsWordmark({
  className,
  iconClassName,
  size = 'header',
  textClassName,
}: PolymsWordmarkProps) {
  const styles = WORDMARK[size]

  return (
    <div className={className ? `flex items-center ${className}` : 'flex items-center'}>
      <FaviconFit className={clsx(styles.icon, iconClassName)} />
      <span className={`ms-1 ${styles.text} ${textClassName ?? ''}`}>olyms</span>
    </div>
  )
}

type PolymsWordmarkProps = {
  className?: string
  iconClassName?: string
  size?: keyof typeof WORDMARK
  textClassName?: string
}
