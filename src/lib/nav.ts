import type { LucideIcon } from 'lucide-react'
import {
  Rocket, PlayCircle, Compass,
  Blocks, Palette, Type, Ruler, Layers2, Wand2, Gem, Shapes,
  ToggleLeft, CreditCard, TextCursorInput, Table, FolderOpen, Gauge, LineChart,
  Image, Map, Images, MoveVertical,
  Crown, LayoutGrid, LayoutTemplate, Tags, Quote, Table2, ArrowRightLeft, SquareSplitHorizontal,
  LayoutDashboard, BarChart3,
  Megaphone, FileText, Smartphone, Magnet, ListChecks, Filter, Mail, PenLine,
  MonitorPlay,
  Calculator, ClipboardCheck,
} from 'lucide-react'
import type { Accent } from './accents'

export interface NavItem {
  id: string
  label: string
  Icon: LucideIcon
  accent: Accent
  /** Top-level sidebar group: Start · Foundations · Components · Library. */
  group: string
  /** Library sub-group (the browsable category), e.g. 'Website Sections'. */
  category?: string
  /** A deeper cluster inside a category, e.g. 'Comparisons'. */
  subcategory?: string
}

/**
 * The single source of truth for the showcase. App renders one Section per id, IN THIS ORDER,
 * and the Shell renders this same tree as the sidebar — so the page and the sidebar always match.
 * The section number is the item's index here, so it never gaps when items move.
 *
 * Four top-level groups. COMPONENTS holds individual parts; LIBRARY holds browsable visual assets
 * and assembled designs, organised into categories (and, under Website Sections, a Comparisons
 * cluster). The former Positioning / Patterns / Templates / Tools groups are dissolved into these.
 */
export const SHOWCASE_NAV: NavItem[] = [
  /* ── START ─────────────────────────────────────────────────────────────── */
  { id: 'hero', label: 'Hero', Icon: Rocket, accent: 'blue', group: 'Start' },
  { id: 'video', label: 'Promo Video', Icon: PlayCircle, accent: 'blue', group: 'Start' },
  { id: 'overview', label: 'Overview', Icon: Compass, accent: 'blue', group: 'Start' },

  /* ── FOUNDATIONS ───────────────────────────────────────────────────────── */
  { id: 'tokens', label: 'Tokens', Icon: Blocks, accent: 'blue', group: 'Foundations' },
  { id: 'color', label: 'Colour', Icon: Palette, accent: 'blue', group: 'Foundations' },
  { id: 'typography', label: 'Typography', Icon: Type, accent: 'blue', group: 'Foundations' },
  { id: 'spacing', label: 'Spacing & Layout', Icon: Ruler, accent: 'blue', group: 'Foundations' },
  { id: 'elevation', label: 'Radius & Elevation', Icon: Layers2, accent: 'blue', group: 'Foundations' },
  { id: 'motion', label: 'Motion', Icon: Wand2, accent: 'blue', group: 'Foundations' },
  { id: 'logo', label: 'Logo', Icon: Gem, accent: 'blue', group: 'Foundations' },
  { id: 'icons', label: 'Icons', Icon: Shapes, accent: 'blue', group: 'Foundations' },

  /* ── COMPONENTS (individual parts) ─────────────────────────────────────── */
  { id: 'components', label: 'Buttons & Controls', Icon: ToggleLeft, accent: 'blue', group: 'Components' },
  { id: 'cards', label: 'Cards', Icon: CreditCard, accent: 'blue', group: 'Components' },
  { id: 'forms', label: 'Forms & Inputs', Icon: TextCursorInput, accent: 'blue', group: 'Components' },
  { id: 'tables', label: 'Tables', Icon: Table, accent: 'blue', group: 'Components' },
  { id: 'section-folders', label: 'Section Folders', Icon: FolderOpen, accent: 'blue', group: 'Components' },
  { id: 'widgets', label: 'Dashboard Widgets', Icon: Gauge, accent: 'blue', group: 'Components' },
  { id: 'charts', label: 'Charts', Icon: LineChart, accent: 'blue', group: 'Components' },

  /* ── LIBRARY › Images & Backgrounds ────────────────────────────────────── */
  { id: 'imagery', label: 'Image Library', Icon: Image, accent: 'blue', group: 'Library', category: 'Images & Backgrounds' },
  { id: 'contour-map', label: 'Contour Map', Icon: Map, accent: 'blue', group: 'Library', category: 'Images & Backgrounds' },
  { id: 'scrollers', label: 'Scroller Images', Icon: Images, accent: 'blue', group: 'Library', category: 'Images & Backgrounds' },
  { id: 'scroll-blue-band', label: 'Scroll Blue Band', Icon: MoveVertical, accent: 'blue', group: 'Library', category: 'Images & Backgrounds' },

  /* ── LIBRARY › Website Sections ────────────────────────────────────────── */
  { id: 'heroes', label: 'Heroes', Icon: Crown, accent: 'blue', group: 'Library', category: 'Website Sections' },
  { id: 'bento', label: 'Bento Box', Icon: LayoutGrid, accent: 'blue', group: 'Library', category: 'Website Sections' },
  { id: 'featured', label: 'Featured Sections', Icon: LayoutTemplate, accent: 'blue', group: 'Library', category: 'Website Sections' },
  { id: 'pricing', label: 'Pricing', Icon: Tags, accent: 'blue', group: 'Library', category: 'Website Sections' },
  { id: 'testimonials', label: 'Testimonials', Icon: Quote, accent: 'blue', group: 'Library', category: 'Website Sections' },
  { id: 'landscape-table', label: 'Landscape Table', Icon: Table2, accent: 'blue', group: 'Library', category: 'Website Sections', subcategory: 'Comparisons' },
  { id: 'from-and-to', label: 'From and To', Icon: ArrowRightLeft, accent: 'blue', group: 'Library', category: 'Website Sections', subcategory: 'Comparisons' },
  { id: 'this-vs-that', label: 'This vs That', Icon: SquareSplitHorizontal, accent: 'blue', group: 'Library', category: 'Website Sections', subcategory: 'Comparisons' },

  /* ── LIBRARY › Dashboards & Data Displays ──────────────────────────────── */
  { id: 'dashboards', label: 'Dashboard Layouts', Icon: LayoutDashboard, accent: 'blue', group: 'Library', category: 'Dashboards & Data Displays' },
  { id: 'market-evidence', label: 'Evidence Layouts', Icon: BarChart3, accent: 'blue', group: 'Library', category: 'Dashboards & Data Displays' },

  /* ── LIBRARY › Marketing & Content ─────────────────────────────────────── */
  { id: 'banners', label: 'Banners', Icon: Megaphone, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'blogs', label: 'Blogs', Icon: FileText, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'social', label: 'Social Media', Icon: Smartphone, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'leadmagnets', label: 'Lead Magnets', Icon: Magnet, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'quizzes', label: 'Quizzes', Icon: ListChecks, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'funnels', label: 'Funnels', Icon: Filter, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'client-emails', label: 'Client Emails', Icon: Mail, accent: 'blue', group: 'Library', category: 'Marketing & Content' },
  { id: 'email-signature', label: 'Email Signatures', Icon: PenLine, accent: 'blue', group: 'Library', category: 'Marketing & Content' },

  /* ── LIBRARY › Demos & Templates ───────────────────────────────────────── */
  { id: 'demos', label: 'Live Demo Pages', Icon: MonitorPlay, accent: 'blue', group: 'Library', category: 'Demos & Templates' },

  /* ── LIBRARY › Calculators & Assessments ───────────────────────────────── */
  { id: 'calculators', label: 'Finance Calculators', Icon: Calculator, accent: 'blue', group: 'Library', category: 'Calculators & Assessments' },
  { id: 'audit-forms', label: 'Website Audit Forms', Icon: ClipboardCheck, accent: 'blue', group: 'Library', category: 'Calculators & Assessments' },
]
