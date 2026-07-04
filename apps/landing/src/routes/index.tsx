import { createFileRoute } from '@tanstack/react-router'
import { HomeCatalog, HomeHero, HomePrinciples, HomeQuickStart } from '../components/home'

function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeQuickStart />
      <HomePrinciples />
      <HomeCatalog />
    </>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
