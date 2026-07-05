type HomeSectionChipProps = {
  n: string
  label: string
}

export function HomeSectionChip({ n, label }: HomeSectionChipProps) {
  return (
    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-line px-4 py-1.5 font-bold font-mono text-[12.5px] text-primary-600'>
      <span aria-hidden className='size-[7px] shrink-0 rounded-full bg-primary-600' />
      {n} · {label}
    </div>
  )
}
