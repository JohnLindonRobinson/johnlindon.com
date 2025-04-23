import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { FeaturedWork } from '@/components/sections/FeaturedWork'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <FeaturedWork />
    </main>
  )
}
