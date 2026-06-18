import { Shell } from '@/showcase/Shell'
import { HeroSection } from '@/showcase/sections/HeroSection'
import { VideoSection } from '@/showcase/sections/VideoSection'
import { QuickStartSection } from '@/showcase/sections/QuickStartSection'
import { OverviewSection } from '@/showcase/sections/OverviewSection'
import { ColorSection } from '@/showcase/sections/ColorSection'
import { TypographySection } from '@/showcase/sections/TypographySection'
import { SpacingSection } from '@/showcase/sections/SpacingSection'
import { ElevationSection } from '@/showcase/sections/ElevationSection'
import { MotionSection } from '@/showcase/sections/MotionSection'
import { IconsSection } from '@/showcase/sections/IconsSection'
import { ComponentsSection } from '@/showcase/sections/ComponentsSection'
import { CardsSection } from '@/showcase/sections/CardsSection'
import { BentoSection } from '@/showcase/sections/BentoSection'
import { BannersSection } from '@/showcase/sections/BannersSection'
import { BlogsSection } from '@/showcase/sections/BlogsSection'
import { LeadMagnetsSection } from '@/showcase/sections/LeadMagnetsSection'
import { ImageLibrarySection } from '@/showcase/sections/ImageLibrarySection'
import { NotionSection } from '@/showcase/sections/NotionSection'
import { SocialSection } from '@/showcase/sections/SocialSection'
import { DemosSection } from '@/showcase/sections/DemosSection'

export default function App() {
  return (
    <Shell>
      <HeroSection />
      <VideoSection />
      <QuickStartSection />
      <OverviewSection />
      <ColorSection />
      <TypographySection />
      <SpacingSection />
      <ElevationSection />
      <MotionSection />
      <IconsSection />
      <ComponentsSection />
      <CardsSection />
      <BentoSection />
      <BannersSection />
      <BlogsSection />
      <LeadMagnetsSection />
      <ImageLibrarySection />
      <NotionSection />
      <SocialSection />
      <DemosSection />
    </Shell>
  )
}
