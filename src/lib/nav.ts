import type { LucideIcon } from 'lucide-react'
import {
  Sparkles, PlayCircle, Compass,
  Palette, Boxes, Type, Ruler, Layers, Wand2, Shapes, Sticker,
  Component, CreditCard,
  LayoutGrid, LayoutTemplate, Gauge, LayoutDashboard, Calculator, Table, Tags, TextCursorInput, Quote, Images,
  Megaphone, FileText, MailPlus, Mail, PenLine, Magnet, Image, NotebookPen, Share2, MonitorPlay,
  Telescope, FolderOpen, BarChart3, Columns2, Columns3, ArrowRightLeft, MoveVertical,
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
  { id: 'tokens', label: 'Tokens', Icon: Boxes, accent: 'blue', group: 'Foundations' },
  { id: 'typography', label: 'Typography', Icon: Type, accent: 'blue', group: 'Foundations' },
  { id: 'spacing', label: 'Spacing & Layout', Icon: Ruler, accent: 'blue', group: 'Foundations' },
  { id: 'elevation', label: 'Radius & Elevation', Icon: Layers, accent: 'blue', group: 'Foundations' },
  { id: 'motion', label: 'Motion', Icon: Wand2, accent: 'blue', group: 'Foundations' },
  { id: 'logo', label: 'Logo', Icon: Shapes, accent: 'blue', group: 'Foundations' },
  { id: 'icons', label: 'Icons', Icon: Sticker, accent: 'blue', group: 'Foundations' },

  { id: 'components', label: 'Components', Icon: Component, accent: 'blue', group: 'Components' },
  { id: 'cards', label: 'Cards', Icon: CreditCard, accent: 'blue', group: 'Components' },

  { id: 'bento', label: 'Bento Box', Icon: LayoutGrid, accent: 'blue', group: 'Patterns' },

  { id: 'featured', label: 'Featured', Icon: LayoutTemplate, accent: 'blue', group: 'Patterns' },
  { id: 'widgets', label: 'Dashboard Widgets', Icon: Gauge, accent: 'blue', group: 'Patterns' },
  { id: 'dashboards', label: 'Dashboards', Icon: LayoutDashboard, accent: 'blue', group: 'Patterns' },
  { id: 'calculators', label: 'Calculators', Icon: Calculator, accent: 'blue', group: 'Patterns' },
  { id: 'tables', label: 'Tables', Icon: Table, accent: 'blue', group: 'Patterns' },
  { id: 'pricing', label: 'Pricing', Icon: Tags, accent: 'blue', group: 'Patterns' },
  { id: 'forms', label: 'Forms', Icon: TextCursorInput, accent: 'blue', group: 'Patterns' },
  { id: 'testimonials', label: 'Testimonials', Icon: Quote, accent: 'blue', group: 'Patterns' },
  { id: 'scrollers', label: 'Scroller Images', Icon: Images, accent: 'blue', group: 'Patterns' },

  { id: 'banners', label: 'Banners', Icon: Megaphone, accent: 'blue', group: 'Templates' },
  { id: 'blogs', label: 'Blogs', Icon: FileText, accent: 'blue', group: 'Templates' },
  { id: 'warmup', label: 'Domain Warm-up', Icon: MailPlus, accent: 'blue', group: 'Templates' },
  { id: 'client-emails', label: 'Client Emails', Icon: Mail, accent: 'blue', group: 'Templates' },
  { id: 'email-signature', label: 'Email Signature', Icon: PenLine, accent: 'blue', group: 'Templates' },
  { id: 'leadmagnets', label: 'Lead Magnets', Icon: Magnet, accent: 'blue', group: 'Templates' },
  { id: 'imagery', label: 'Image Library', Icon: Image, accent: 'blue', group: 'Templates' },
  { id: 'notion', label: 'Notion', Icon: NotebookPen, accent: 'blue', group: 'Templates' },
  { id: 'social', label: 'Social Media', Icon: Share2, accent: 'blue', group: 'Templates' },
  { id: 'demos', label: 'Live Demo Pages', Icon: MonitorPlay, accent: 'blue', group: 'Templates' },

  { id: 'positioning-hero', label: 'Positioning Hero', Icon: Telescope, accent: 'blue', group: 'Positioning' },
  { id: 'section-folders', label: 'Section Folders', Icon: FolderOpen, accent: 'blue', group: 'Positioning' },
  { id: 'market-evidence', label: 'Market Evidence', Icon: BarChart3, accent: 'blue', group: 'Positioning' },
  { id: 'landscape-table', label: 'Landscape Table', Icon: Columns3, accent: 'blue', group: 'Positioning' },
  { id: 'from-and-to', label: 'From and To', Icon: ArrowRightLeft, accent: 'blue', group: 'Positioning' },
  { id: 'this-vs-that', label: 'This vs That', Icon: Columns2, accent: 'blue', group: 'Positioning' },
  { id: 'scroll-blue-band', label: 'Scroll Blue Band', Icon: MoveVertical, accent: 'blue', group: 'Positioning' },

  { id: 'audit', label: 'Client Audit', Icon: ClipboardList, accent: 'blue', group: 'Tools' },
]
