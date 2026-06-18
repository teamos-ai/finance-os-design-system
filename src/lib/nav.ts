import type { LucideIcon } from 'lucide-react'
import {
  Sparkles, PlayCircle, Rocket, Compass,
  Palette, Type, Ruler, Layers, Wand2, Shapes,
  Component, CreditCard, LayoutGrid,
  Megaphone, FileText, Calculator, Image, NotebookPen, Share2, MonitorPlay,
} from 'lucide-react'
import type { Accent } from './accents'

export interface NavItem {
  id: string
  label: string
  Icon: LucideIcon
  accent: Accent
  group: string
}

/** The single source of truth for the showcase. App renders one Section per id, in order. */
export const SHOWCASE_NAV: NavItem[] = [
  { id: 'hero', label: 'Hero', Icon: Sparkles, accent: 'gold', group: 'Start' },
  { id: 'video', label: 'Promo Video', Icon: PlayCircle, accent: 'amber', group: 'Start' },
  { id: 'quickstart', label: 'Quick Start', Icon: Rocket, accent: 'blue', group: 'Start' },
  { id: 'overview', label: 'Overview', Icon: Compass, accent: 'gold', group: 'Start' },

  { id: 'color', label: 'Color', Icon: Palette, accent: 'gold', group: 'Foundations' },
  { id: 'typography', label: 'Typography', Icon: Type, accent: 'amber', group: 'Foundations' },
  { id: 'spacing', label: 'Spacing & Layout', Icon: Ruler, accent: 'blue', group: 'Foundations' },
  { id: 'elevation', label: 'Radius & Elevation', Icon: Layers, accent: 'gold', group: 'Foundations' },
  { id: 'motion', label: 'Motion', Icon: Wand2, accent: 'amber', group: 'Foundations' },
  { id: 'icons', label: 'Icons & Logo', Icon: Shapes, accent: 'blue', group: 'Foundations' },

  { id: 'components', label: 'Components', Icon: Component, accent: 'gold', group: 'Library' },
  { id: 'cards', label: 'Cards', Icon: CreditCard, accent: 'amber', group: 'Library' },
  { id: 'bento', label: 'Bento Box', Icon: LayoutGrid, accent: 'blue', group: 'Library' },

  { id: 'banners', label: 'Banners', Icon: Megaphone, accent: 'gold', group: 'Applied' },
  { id: 'blogs', label: 'Blogs', Icon: FileText, accent: 'amber', group: 'Applied' },
  { id: 'leadmagnets', label: 'Lead Magnets', Icon: Calculator, accent: 'blue', group: 'Applied' },
  { id: 'imagery', label: 'Image Library', Icon: Image, accent: 'gold', group: 'Applied' },
  { id: 'notion', label: 'Notion', Icon: NotebookPen, accent: 'amber', group: 'Applied' },
  { id: 'social', label: 'Social Media', Icon: Share2, accent: 'blue', group: 'Applied' },
  { id: 'demos', label: 'Live Demo Pages', Icon: MonitorPlay, accent: 'gold', group: 'Applied' },
]
