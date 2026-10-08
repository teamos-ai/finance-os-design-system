import type { LucideIcon } from 'lucide-react'
import {
  Sparkles, PlayCircle, Compass,
  Palette, Type, Ruler, Layers, Wand2, Shapes,
  Component, CreditCard, LayoutGrid,
  LayoutTemplate, Gauge, Table, Tags, TextCursorInput, Quote, Images,
  Megaphone, FileText, Calculator, Image, NotebookPen, Share2, MonitorPlay, MailPlus,
  ClipboardList,
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
  { id: 'hero', label: 'Hero', Icon: Sparkles, accent: 'blue', group: 'Start' },
  { id: 'video', label: 'Promo Video', Icon: PlayCircle, accent: 'blue', group: 'Start' },
  { id: 'overview', label: 'Overview', Icon: Compass, accent: 'blue', group: 'Start' },

  { id: 'color', label: 'Color', Icon: Palette, accent: 'blue', group: 'Foundations' },
  { id: 'typography', label: 'Typography', Icon: Type, accent: 'blue', group: 'Foundations' },
  { id: 'spacing', label: 'Spacing & Layout', Icon: Ruler, accent: 'blue', group: 'Foundations' },
  { id: 'elevation', label: 'Radius & Elevation', Icon: Layers, accent: 'blue', group: 'Foundations' },
  { id: 'motion', label: 'Motion', Icon: Wand2, accent: 'blue', group: 'Foundations' },
  { id: 'logo', label: 'Logo', Icon: Shapes, accent: 'blue', group: 'Foundations' },

  { id: 'components', label: 'Components', Icon: Component, accent: 'blue', group: 'Library' },
  { id: 'cards', label: 'Cards', Icon: CreditCard, accent: 'blue', group: 'Library' },
  { id: 'bento', label: 'Bento Box', Icon: LayoutGrid, accent: 'blue', group: 'Library' },

  { id: 'featured', label: 'Featured', Icon: LayoutTemplate, accent: 'blue', group: 'Patterns' },
  { id: 'widgets', label: 'Dashboard Widgets', Icon: Gauge, accent: 'blue', group: 'Patterns' },
  { id: 'tables', label: 'Tables', Icon: Table, accent: 'blue', group: 'Patterns' },
  { id: 'pricing', label: 'Pricing', Icon: Tags, accent: 'blue', group: 'Patterns' },
  { id: 'forms', label: 'Forms', Icon: TextCursorInput, accent: 'blue', group: 'Patterns' },
  { id: 'testimonials', label: 'Testimonials', Icon: Quote, accent: 'blue', group: 'Patterns' },
  { id: 'scrollers', label: 'Scroller Images', Icon: Images, accent: 'blue', group: 'Patterns' },

  { id: 'banners', label: 'Banners', Icon: Megaphone, accent: 'blue', group: 'Applied' },
  { id: 'blogs', label: 'Blogs', Icon: FileText, accent: 'blue', group: 'Applied' },
  { id: 'warmup', label: 'Domain Warm-up', Icon: MailPlus, accent: 'blue', group: 'Applied' },
  { id: 'leadmagnets', label: 'Lead Magnets', Icon: Calculator, accent: 'blue', group: 'Applied' },
  { id: 'imagery', label: 'Image Library', Icon: Image, accent: 'blue', group: 'Applied' },
  { id: 'notion', label: 'Notion', Icon: NotebookPen, accent: 'blue', group: 'Applied' },
  { id: 'social', label: 'Social Media', Icon: Share2, accent: 'blue', group: 'Applied' },
  { id: 'demos', label: 'Live Demo Pages', Icon: MonitorPlay, accent: 'blue', group: 'Applied' },
  { id: 'audit', label: 'Client Audit', Icon: ClipboardList, accent: 'blue', group: 'Applied' },
]
