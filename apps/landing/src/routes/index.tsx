import { createFileRoute } from '@tanstack/react-router'
import {
  HomeCatalog,
  HomeFooter,
  HomeHeader,
  HomeHero,
  HomeIntelligence,
  HomePipeline,
  HomePrinciples,
  HomePositioning,
  HomeQuickStart,
  HomeTicker,
  HomeUseCases,
} from '../components/home'
import { m } from '../paraglide/messages.js'

function HomePage() {
  return (
    <main className='app-page min-h-dvh' id='main'>
      <a
        className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2'
        href='#content'
      >
        {m.nav_skip()}
      </a>
      <HomeHeader />
      <HomeHero />
      <HomeUseCases />
      <HomePositioning />
      <HomeCatalog />
      <HomePipeline />
      <HomePrinciples />
      <HomeIntelligence />
      <HomeTicker />
      <HomeQuickStart />
      <HomeFooter />
    </main>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
