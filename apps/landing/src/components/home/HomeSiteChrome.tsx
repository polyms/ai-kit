import { Button, Toggle, ToggleGroup } from '@polyms/core-ui'
import { Moon, Sun } from '@solar-icons/react-perf/Bold'
import { m } from '../../paraglide/messages.js'
import { useAppStore } from '../../stores/useAppStore'

/** Locale + theme — kept out of app header clone */
export function HomeSiteChrome() {
  const locale = useAppStore(s => s.locale)
  const setLocale = useAppStore(s => s.setLocale)
  const theme = useAppStore(s => s.theme)
  const toggleTheme = useAppStore(s => s.toggleTheme)

  return (
    <fieldset
      aria-label={m.nav_locale()}
      className='fixed inset-e-5 bottom-5 z-30 m-0 flex min-w-0 items-center gap-1.5 rounded-full border border-line bg-body/90 p-1 shadow-md backdrop-blur-sm'
    >
      <ToggleGroup
        className='toggle-group'
        onValueChange={values => {
          const next = values[0]
          if (next === 'vi' || next === 'en') void setLocale(next)
        }}
        value={[locale]}
      >
        <Toggle className='toggle min-h-7 min-w-7 font-bold text-[11px] uppercase' value='vi'>
          vi
        </Toggle>
        <Toggle className='toggle min-h-7 min-w-7 font-bold text-[11px] uppercase' value='en'>
          en
        </Toggle>
      </ToggleGroup>
      <Button
        aria-label={m.nav_theme()}
        className='shrink-0'
        icon
        onClick={toggleTheme}
        outlined
        size='sm'
        type='button'
      >
        {theme === 'dark' ? <Sun aria-hidden size={16} /> : <Moon aria-hidden size={16} />}
      </Button>
    </fieldset>
  )
}
