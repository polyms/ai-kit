import { m } from '../../paraglide/messages.js'

export function HomeTicker() {
  const words = [
    m.ticker_specBeforeCode(),
    m.ticker_citeFile(),
    m.ticker_noVibeCoding(),
    m.ticker_cursorFirst(),
    m.ticker_toolAgnostic(),
    m.ticker_mitLicensed(),
    m.ticker_reviewDiff(),
    m.ticker_shipGreen(),
  ]
  return (
    <div aria-hidden className='app-ticker overflow-hidden py-4'>
      <div className='app-ticker__track flex w-max gap-7'>
        {/* the marquee loop needs two copies of every word, so keys carry the copy number */}
        {[0, 1].flatMap(copy =>
          words.map(word => (
            <span
              className='app-ticker__word inline-flex items-center gap-7 whitespace-nowrap font-mono text-[12.5px] tracking-wide'
              key={`${copy}-${word}`}
            >
              {word}
              <span className='app-ticker__dot'>◆</span>
            </span>
          ))
        )}
      </div>
    </div>
  )
}
