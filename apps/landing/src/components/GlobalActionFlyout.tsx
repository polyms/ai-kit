import { MoveTopIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon as Icon } from '@hugeicons/react'
import { Button, Toggle, ToggleGroup, Toolbar, Tooltip } from '@polyms/ui-kit'
import { Moon, Sun, Widget } from '@solar-icons/react-perf/BoldDuotone'
import clsx from 'clsx'
import { useEffect, useId, useState } from 'react'
import { m } from '../paraglide/messages.js'
import { useAppStore } from '../stores/useAppStore'

const SCROLL_TOP_THRESHOLD = 240

export function GlobalActionFlyout() {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const locale = useAppStore(s => s.locale)
  const setLocale = useAppStore(s => s.setLocale)
  const theme = useAppStore(s => s.theme)
  const toggleTheme = useAppStore(s => s.toggleTheme)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > SCROLL_TOP_THRESHOLD)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Tooltip.Provider>
      <div className='fixed inset-e-5 bottom-5 z-30 flex flex-col items-end gap-2'>
        {showScrollTop ? (
          <Button
            aria-label={m.nav_to_top()}
            icon
            onClick={scrollToTop}
            outlined
            rounded
            size='lg'
            tooltip={m.nav_to_top()}
            variant='light'
          >
            <Icon className='btn-icon-content' icon={MoveTopIcon} />
          </Button>
        ) : null}

        <div className='flex items-center justify-end gap-2'>
          <div
            aria-hidden={!open}
            className={clsx(
              'overflow-hidden transition-[max-width,opacity] duration-300 ease-out motion-reduce:transition-none',
              open
                ? 'pointer-events-auto max-w-[calc(100vw-4.5rem)] opacity-100'
                : 'pointer-events-none max-w-0 opacity-0'
            )}
            id={panelId}
            inert={open ? undefined : true}
          >
            <div
              className={clsx(
                'transition-transform duration-300 ease-out motion-reduce:transition-none',
                open ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              <Toolbar aria-label={m.nav_actions()} className='backdrop-blur-xs' rounded>
                <Toolbar.Group aria-label={m.nav_theme()}>
                  <Toolbar.Button
                    render={
                      <Button
                        aria-label={m.nav_theme()}
                        icon
                        onClick={toggleTheme}
                        rounded
                        size='lg'
                        tooltip={m.nav_theme()}
                        type='button'
                      />
                    }
                  >
                    {theme === 'dark' ? (
                      <Sun className='btn-icon-content' />
                    ) : (
                      <Moon className='btn-icon-content' />
                    )}
                  </Toolbar.Button>
                </Toolbar.Group>

                <Toolbar.Separator orientation='vertical' />

                <Toolbar.Group aria-label={m.nav_locale()}>
                  <ToggleGroup
                    aria-label={m.nav_locale()}
                    className='toolbar-group'
                    onValueChange={values => {
                      const next = values[0]
                      if (next === 'vi' || next === 'en') void setLocale(next)
                    }}
                    value={[locale]}
                  >
                    <Toolbar.Button render={<Toggle className='toggle rounded-full' />} value='vi'>
                      VI
                    </Toolbar.Button>
                    <Toolbar.Button render={<Toggle className='toggle rounded-full' />} value='en'>
                      EN
                    </Toolbar.Button>
                  </ToggleGroup>
                </Toolbar.Group>
              </Toolbar>
            </div>
          </div>

          <Button
            aria-controls={panelId}
            aria-expanded={open}
            aria-label={m.nav_actions()}
            icon
            onClick={() => setOpen(current => !current)}
            rounded
            size='lg'
            tooltip={m.nav_actions()}
            type='button'
            variant='primary'
          >
            <Widget aria-hidden size={20} />
          </Button>
        </div>
      </div>
    </Tooltip.Provider>
  )
}
