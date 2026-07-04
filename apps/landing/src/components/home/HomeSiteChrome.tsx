import { Button, Toggle, ToggleGroup } from '@polyms/core-ui'
import { Moon, Sun } from '@solar-icons/react-perf/Bold'
import { useAppStore } from '../../stores/useAppStore'
import { useT } from '../../lib/i18n'

/** Locale + theme — kept out of demo header clone */
export function HomeSiteChrome() {
  const locale = useAppStore(s => s.locale)
  const setLocale = useAppStore(s => s.setLocale)
  const theme = useAppStore(s => s.theme)
  const toggleTheme = useAppStore(s => s.toggleTheme)
  const t = useT()

  return (
    <fieldset
      className='fixed inset-e-5 bottom-5 z-30 m-0 flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-body/90 p-1 shadow-md backdrop-blur-sm'
      aria-label={t('nav.locale')}
    >
      <ToggleGroup
        className='toggle-group'
        value={[locale]}
        onValueChange={values => {
          const next = values[0]
          if (next === 'vi' || next === 'en') setLocale(next)
        }}
      >
        <Toggle className='toggle min-h-7 min-w-7 font-bold text-[11px] uppercase' value='vi'>
          vi
        </Toggle>
        <Toggle className='toggle min-h-7 min-w-7 font-bold text-[11px] uppercase' value='en'>
          en
        </Toggle>
      </ToggleGroup>
      <Button
        type='button'
        size='sm'
        outlined
        icon
        onClick={toggleTheme}
        aria-label={t('nav.theme')}
        className='shrink-0'
      >
        {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
      </Button>
    </fieldset>
  )
}
