# Component reference

> **Generated** by `npm run docs:components` from `src/components/**` (subdirectories
> auto-discovered). Do not hand-edit — re-run the generator after adding or changing a component
> (see CONTRIBUTING.md). The living API — props, variants, states, tokens and copy-paste code — is
> the **showcase** at `/`, where every demo carries an inspector (Explain · Tokens · Code ·
> Download). This file is the index that keeps the kit discoverable.

## UI kit `src/components/ui`

The reusable primitives. Compose only from `--c-*` tokens.

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `AuroraBackground` | — |  | `ui/aurora-background.tsx` |
| `Badge` | small mono tag. | ✓ | `ui/badge.tsx` |
| `Banner` `Ticker` | alert / announcement strips for websites, funnels, countdowns and timers. | ✓ | `ui/banner.tsx` |
| `Button` | Accent is Atlas Blue (#33488F) — solid fill for primary, outline for secondary. | ✓ | `ui/button.tsx` |
| `CardMedia` `Card` `CardHeader` `CardTitle` `CardDescription` `CardContent` `CardFooter` | hairline surface with a calm resting lift (layered shadow-sm). | ✓ | `ui/card.tsx` |
| `CelebrationButton` | A gradient button (theme-accent signature fill) that throws a small shower of thin coloured streamers on click — they fly up from the button's top-centre, then arc back d |  | `ui/celebration-button.tsx` |
| `CommandBar` | the command-palette search input that anchors the hero. | ✓ | `ui/command-bar.tsx` |
| `CommandChip` | the `/command` pill. |  | `ui/command-chip.tsx` |
| `Counter` `StatTrend` `SeatsRemaining` `TicketsSold` `MembersCount` `Countdown` | a composed family of count up / down figures for the outcome and scarcity moments (seats, memberships, tickets sold, a live countdown). |  | `ui/counters.tsx` |
| `Disclosure` | a calm accordion. |  | `ui/disclosure.tsx` |
| `FeatureCard` | icon well + title + body. |  | `ui/feature-card.tsx` |
| `IconButton` | Square, icon-only. | ✓ | `ui/icon-button.tsx` |
| `ImageWash` | a draft image placeholder. |  | `ui/image-wash.tsx` |
| `Input` | flat hairline field. |  | `ui/input.tsx` |
| `Inspectable` | wraps any showcase item and floats a small, quiet "inspect" affordance at its top-right. |  | `ui/inspectable.tsx` |
| `MonoLabel` | the uppercase Anonymous Pro overline used across the system. |  | `ui/mono-label.tsx` |
| `Pagination` | Filled inverse current page, muted siblings, outline prev/next IconButtons with lucide chevrons (for consistency with the rest of the system). |  | `ui/pagination.tsx` |
| `PdfModal` | a pop-up that opens a PDF in a scrollable embedded viewer with a Download action. |  | `ui/pdf-modal.tsx` |
| `PlanCard` | a 3D-tilt card (mouse-driven rotateX/Y springs) with an on-brand gradient + accent wash and an icon well. |  | `ui/plan-card.tsx` |
| `SaveButton` | A blue accent CTA (`variant="primary"`) that, on click, sends up a few small green check chips that rise and fade — the calm "saved" confirmation. |  | `ui/save-button.tsx` |
| `SegmentedControl` | Daily \| Weekly \| Monthly. |  | `ui/segmented.tsx` |
| `Stat` | a big outcome figure with a calm label. |  | `ui/stat.tsx` |
| `Swatch` `GradientSwatch` | a click-to-copy colour chip. |  | `ui/swatch.tsx` |
| `ToolCard` | a single "thing Finance OS replaces" card for the horizontal carousel (app-card craft). |  | `ui/tool-card.tsx` |
| `VideoPlayer` | a flat hairline video frame, ported from the Health OS v2 design system and reskinned to Finance OS tokens. |  | `ui/video-player.tsx` |

## Brand `src/components/brand`

Logo marks — the provided assets only (see CLAUDE.md).

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `LogoMark` `Logo` | the real Finance OS brand marks (PNG assets in /public). |  | `brand/Logo.tsx` |

## Lead magnets `src/components/lead-magnets`

Opt-in templates and their primitives.

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `LeadMagnetFrame` `PaperPage` `TemplateKicker` | the consistent shell every lead-magnet template renders inside. |  | `lead-magnets/Frame.tsx` |
| `AnimatedCheck` `Flipbook` `SwipeDeck` `Checklist` | magnet motion primitives — the reusable interaction vocabulary for building lead magnets from Finance OS tokens. |  | `lead-magnets/primitives.tsx` |
| `NewsletterTemplate` `EmailCourseTemplate` `WebinarTemplate` `ToolkitTemplate` `ResourceListTemplate` `PlannerTemplate` `CouponTemplate` | opt-in & utility lead magnets: Newsletter, Email Course, Webinar, Toolkit, Resource List, Planner, Coupon. |  | `lead-magnets/templates/conversion.tsx` |
| `CheatSheetTemplate` `GuideTemplate` `WorkbookTemplate` `CaseStudyTemplate` `ReportTemplate` | designed, downloadable lead magnets: Cheat Sheet, Guide, Workbook (fillable), Case Study, Whitepaper / Report. |  | `lead-magnets/templates/documents.tsx` |
| `EbookTemplate` `MagazineTemplate` | lead magnets that turn pages (Flipbook primitive): Ebook + Magazine. |  | `lead-magnets/templates/flip.tsx` |
| `SwipeFileTemplate` `ChecklistTemplate` `QuizTemplate` `CalculatorTemplate` `ScorecardTemplate` | lead magnets with real state + motion: Swipe File (SwipeDeck), Checklist (tick), Quiz (tick + score), Calculator + Scorecard (count-up). |  | `lead-magnets/templates/interactive.tsx` |

## Calculators `src/components/calculators`

Broker calculators — repayments, borrowing power, stamp duty.

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `AnimatedCurrency` | the calculators' headline figure. |  | `calculators/AnimatedCurrency.tsx` |
| `BorrowingPowerCalculator` | an indicative serviceability estimate. |  | `calculators/BorrowingPowerCalculator.tsx` |
| `RepaymentCalculator` | home-loan repayments from property value, deposit, rate, term and frequency. |  | `calculators/RepaymentCalculator.tsx` |
| `StampDutyCalculator` | indicative AU transfer (stamp) duty for NSW / VIC / QLD. |  | `calculators/StampDutyCalculator.tsx` |

## Dashboards `src/components/dashboards`

Tokenised inline-SVG charts for broker dashboards.

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `BarChart` `LineChart` `DonutChart` `RingStat` `FillBar` `RankedBarChart` `SplitTrack` | tokenised inline-SVG primitives for the broker dashboards. |  | `dashboards/charts.tsx` |

## Email signature `src/components/signature`

Broker email-signature block + preview.

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `SignaturePreview` | the live Finance OS email-signature block, the on-brand twin of the email-safe HTML in signature.ts. |  | `signature/SignaturePreview.tsx` |

## platform-dashboard `src/components/platform-dashboard`

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `FlipCard` | a reduced-motion-safe 3D flip between a front and a back face. |  | `platform-dashboard/FlipCard.tsx` |
| `PlatformAppShell` `PlatformOverview` | the "platform in motion" app-shell mock (FRONT) and a plain-language overview (BACK) for the flip card. |  | `platform-dashboard/PlatformDashboard.tsx` |

## positioning-hero `src/components/positioning-hero`

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `ContourField` | the React host for the vendored topographic survey map (./contour-map). |  | `positioning-hero/ContourField.tsx` |
| `PositioningSearch` | the hero's fuzzy command search over the positioning. |  | `positioning-hero/PositioningSearch.tsx` |

## scroll-blue `src/components/scroll-blue`

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `BlueStatTile` `BlueAreaChart` | surface viz primitives for the Scroll Blue Band — the on-blue twins of the broker dashboard charts. |  | `scroll-blue/blue-viz.tsx` |

## section-folders `src/components/section-folders`

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `SectionFolder` | one positioning section, filed as a folder. |  | `section-folders/SectionFolder.tsx` |

## this-vs-that `src/components/this-vs-that`

| Component(s) | Purpose | Variants | Source |
|---|---|:---:|---|
| `ComparePair` | the green/red comparison primitive. |  | `this-vs-that/ThisVsThat.tsx` |

_Regenerate with `npm run docs:components`._
