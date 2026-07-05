import { createFileRoute } from '@tanstack/react-router'
import {
  HomeCatalog,
  HomeHero,
  HomePipeline,
  HomePrinciples,
  HomeQuickStart,
  HomeTicker,
} from '../components/home'

function HomePage() {
  return (
    <>
      <HomeHero />
      <HomePrinciples />
      <HomePipeline />
      <HomeCatalog />
      <HomeTicker />
      <HomeQuickStart />
    </>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
