import { Shell } from '@/showcase/Shell'
import { Ticker } from '@/components/ui/banner'
import { TICKER_ITEMS } from '@/data/system'
import { HeroSection } from '@/showcase/sections/HeroSection'
import { VideoSection } from '@/showcase/sections/VideoSection'
import { OverviewSection } from '@/showcase/sections/OverviewSection'
import { ColorSection } from '@/showcase/sections/ColorSection'
import { TokensSection } from '@/showcase/sections/TokensSection'
import { TypographySection } from '@/showcase/sections/TypographySection'
import { SpacingSection } from '@/showcase/sections/SpacingSection'
import { ElevationSection } from '@/showcase/sections/ElevationSection'
import { MotionSection } from '@/showcase/sections/MotionSection'
import { LogoSection } from '@/showcase/sections/LogoSection'
import { IconsSection } from '@/showcase/sections/IconsSection'
import { ComponentsSection } from '@/showcase/sections/ComponentsSection'
import { CardsSection } from '@/showcase/sections/CardsSection'
import { BentoSection } from '@/showcase/sections/BentoSection'
import { FeaturedSection } from '@/showcase/sections/FeaturedSection'
import { WidgetsSection } from '@/showcase/sections/WidgetsSection'
import { DashboardsSection } from '@/showcase/sections/DashboardsSection'
import { CalculatorsSection } from '@/showcase/sections/CalculatorsSection'
import { TablesSection } from '@/showcase/sections/TablesSection'
import { PricingSection } from '@/showcase/sections/PricingSection'
import { FormsSection } from '@/showcase/sections/FormsSection'
import { TestimonialsSection } from '@/showcase/sections/TestimonialsSection'
import { ScrollersSection } from '@/showcase/sections/ScrollersSection'
import { BannersSection } from '@/showcase/sections/BannersSection'
import { BlogsSection } from '@/showcase/sections/BlogsSection'
import { WarmupSection } from '@/showcase/sections/WarmupSection'
import { EmailsSection } from '@/showcase/sections/EmailsSection'
import { SignatureSection } from '@/showcase/sections/SignatureSection'
import { LeadMagnetsSection } from '@/showcase/sections/LeadMagnetsSection'
import { ImageLibrarySection } from '@/showcase/sections/ImageLibrarySection'
import { NotionSection } from '@/showcase/sections/NotionSection'
import { SocialSection } from '@/showcase/sections/SocialSection'
import { DemosSection } from '@/showcase/sections/DemosSection'
import { PositioningHeroSection } from '@/showcase/sections/PositioningHeroSection'
import { SectionFoldersSection } from '@/showcase/sections/SectionFoldersSection'
import { MarketEvidenceSection } from '@/showcase/sections/MarketEvidenceSection'
import { LandscapeTableSection } from '@/showcase/sections/LandscapeTableSection'
import { TransformationTableSection } from '@/showcase/sections/TransformationTableSection'
import { ThisVsThatSection } from '@/showcase/sections/ThisVsThatSection'
import { ScrollBlueSection } from '@/showcase/sections/ScrollBlueSection'
import { AuditSection } from '@/showcase/sections/AuditSection'

function TopBanner() {
  // Blue-gradient ticker (the single Light · Clarity theme).
  return <Ticker items={TICKER_ITEMS} variant="gradient" />
}

export default function App() {
  return (
    <Shell>
      <TopBanner />
      <HeroSection />
      <VideoSection />
      <OverviewSection />
      <ColorSection />
      <TokensSection />
      <TypographySection />
      <SpacingSection />
      <ElevationSection />
      <MotionSection />
      <LogoSection />
      <IconsSection />
      <ComponentsSection />
      <CardsSection />
      <BentoSection />
      <FeaturedSection />
      <WidgetsSection />
      <DashboardsSection />
      <CalculatorsSection />
      <TablesSection />
      <PricingSection />
      <FormsSection />
      <TestimonialsSection />
      <ScrollersSection />
      <BannersSection />
      <BlogsSection />
      <WarmupSection />
      <EmailsSection />
      <SignatureSection />
      <LeadMagnetsSection />
      <ImageLibrarySection />
      <NotionSection />
      <SocialSection />
      <DemosSection />
      <PositioningHeroSection />
      <SectionFoldersSection />
      <MarketEvidenceSection />
      <LandscapeTableSection />
      <TransformationTableSection />
      <ThisVsThatSection />
      <ScrollBlueSection />
      <AuditSection />
    </Shell>
  )
}
