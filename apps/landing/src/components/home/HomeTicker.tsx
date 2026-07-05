const WORDS = [
  'spec before code',
  'cite the file',
  'no vibe coding',
  'cursor-first',
  'tool-agnostic',
  'MIT licensed',
  'review the diff',
  'ship green builds',
] as const

export function HomeTicker() {
  const track = [...WORDS, ...WORDS]

  return (
    <div aria-hidden className='app-ticker overflow-hidden py-4'>
      <div className='app-ticker__track flex w-max gap-7'>
        {track.map(word => (
          <span
            className='app-ticker__word inline-flex items-center gap-7 whitespace-nowrap font-mono text-[12.5px] tracking-wide'
            key={`${word}`}
          >
            {word}
            <span className='app-ticker__dot'>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
