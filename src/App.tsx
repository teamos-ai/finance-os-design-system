import * as React from 'react'
import { Shell } from '@/showcase/Shell'
import { SHOWCASE_NAV } from '@/lib/nav'

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
import { FormsSection } from '@/showcase/sections/FormsSection'
import { TablesSection } from '@/showcase/sections/TablesSection'
import { SectionFoldersSection } from '@/showcase/sections/SectionFoldersSection'
import { WidgetsSection } from '@/showcase/sections/WidgetsSection'
import { ChartsSection } from '@/showcase/sections/ChartsSection'
import { ImageLibrarySection } from '@/showcase/sections/ImageLibrarySection'
import { ContourMapSection } from '@/showcase/sections/ContourMapSection'
import { ScrollersSection } from '@/showcase/sections/ScrollersSection'
import { ScrollBlueSection } from '@/showcase/sections/ScrollBlueSection'
import { HeroesSection } from '@/showcase/sections/HeroesSection'
import { BentoSection } from '@/showcase/sections/BentoSection'
import { FeaturedSection } from '@/showcase/sections/FeaturedSection'
import { PricingSection } from '@/showcase/sections/PricingSection'
import { TestimonialsSection } from '@/showcase/sections/TestimonialsSection'
import { LandscapeTableSection } from '@/showcase/sections/LandscapeTableSection'
import { TransformationTableSection } from '@/showcase/sections/TransformationTableSection'
import { ThisVsThatSection } from '@/showcase/sections/ThisVsThatSection'
import { DashboardsSection } from '@/showcase/sections/DashboardsSection'
import { MarketEvidenceSection } from '@/showcase/sections/MarketEvidenceSection'
import { BannersSection } from '@/showcase/sections/BannersSection'
import { BlogsSection } from '@/showcase/sections/BlogsSection'
import { SocialSection } from '@/showcase/sections/SocialSection'
import { LeadMagnetsSection } from '@/showcase/sections/LeadMagnetsSection'
import { QuizzesSection } from '@/showcase/sections/QuizzesSection'
import { FunnelsSection } from '@/showcase/sections/FunnelsSection'
import { EmailsSection } from '@/showcase/sections/EmailsSection'
import { SignatureSection } from '@/showcase/sections/SignatureSection'
import { DemosSection } from '@/showcase/sections/DemosSection'
import { CalculatorsSection } from '@/showcase/sections/CalculatorsSection'
import { WebsiteAuditFormsSection } from '@/showcase/sections/WebsiteAuditFormsSection'

/** id → Section component. App renders these in SHOWCASE_NAV order, so the page always
 *  matches the sidebar. Add a nav entry + a component here and it slots in automatically. */
const SECTIONS: Record<string, React.ComponentType> = {
  hero: HeroSection,
  video: VideoSection,
  overview: OverviewSection,
  tokens: TokensSection,
  color: ColorSection,
  typography: TypographySection,
  spacing: SpacingSection,
  elevation: ElevationSection,
  motion: MotionSection,
  logo: LogoSection,
  icons: IconsSection,
  components: ComponentsSection,
  cards: CardsSection,
  forms: FormsSection,
  tables: TablesSection,
  'section-folders': SectionFoldersSection,
  widgets: WidgetsSection,
  charts: ChartsSection,
  imagery: ImageLibrarySection,
  'contour-map': ContourMapSection,
  scrollers: ScrollersSection,
  'scroll-blue-band': ScrollBlueSection,
  heroes: HeroesSection,
  bento: BentoSection,
  featured: FeaturedSection,
  pricing: PricingSection,
  testimonials: TestimonialsSection,
  'landscape-table': LandscapeTableSection,
  'from-and-to': TransformationTableSection,
  'this-vs-that': ThisVsThatSection,
  dashboards: DashboardsSection,
  'market-evidence': MarketEvidenceSection,
  banners: BannersSection,
  blogs: BlogsSection,
  social: SocialSection,
  leadmagnets: LeadMagnetsSection,
  quizzes: QuizzesSection,
  funnels: FunnelsSection,
  'client-emails': EmailsSection,
  'email-signature': SignatureSection,
  demos: DemosSection,
  calculators: CalculatorsSection,
  'audit-forms': WebsiteAuditFormsSection,
}

/** Top-level group divider on the page — mirrors a sidebar group header (FOUNDATIONS, LIBRARY…). */
function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="scroll-mt-8 border-b border-border px-6 py-9 md:px-12 md:py-11">
      <div className="mx-auto flex max-w-5xl items-center gap-4">
        <span aria-hidden className="h-px flex-1 bg-border" />
        <span className="font-mono text-mono-xs font-bold uppercase tracking-[0.22em] text-accent-text">{children}</span>
        <span aria-hidden className="h-px flex-1 bg-border" />
      </div>
    </div>
  )
}

/** Library category divider — mirrors a sidebar category header (Website Sections…). */
function CategoryHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-border/70 px-6 py-6 text-center md:px-12">
      <span className="font-mono text-mono-2xs font-bold uppercase tracking-[0.18em] text-fg-muted">{children}</span>
    </div>
  )
}

/** Comparisons-style sub-cluster label inside a category. */
function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-6 pb-2 pt-10 text-center md:px-12">
      <span className="font-mono text-mono-2xs uppercase tracking-[0.14em] text-fg-subtle">{children}</span>
    </div>
  )
}

export default function App() {
  const nodes: React.ReactNode[] = []
  let group: string | undefined
  let category: string | undefined
  let subcategory: string | undefined

  for (const item of SHOWCASE_NAV) {
    if (item.group !== group) {
      if (group !== undefined) nodes.push(<GroupHeading key={`g:${item.group}`}>{item.group}</GroupHeading>)
      group = item.group
      category = undefined
      subcategory = undefined
    }
    if (item.category !== category) {
      if (item.category) nodes.push(<CategoryHeading key={`c:${item.group}:${item.category}`}>{item.category}</CategoryHeading>)
      category = item.category
      subcategory = undefined
    }
    if (item.subcategory !== subcategory) {
      if (item.subcategory) nodes.push(<SubHeading key={`s:${item.category}:${item.subcategory}`}>{item.subcategory}</SubHeading>)
      subcategory = item.subcategory
    }
    const Cmp = SECTIONS[item.id]
    if (Cmp) nodes.push(<Cmp key={item.id} />)
  }

  return (
    <Shell>
      {nodes}
    </Shell>
  )
}
