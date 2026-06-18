/**
 * Finance OS content data — the brand copy the showcase + demo surfaces compose from.
 * Sourced from the brand book (Broker Ben, the Features, the Savings). Voice: calm,
 * clear, grounded, authoritative — never hyped.
 */
import type { LucideIcon } from 'lucide-react'
import {
  Inbox, MessageSquare, Workflow, Bot, Filter, CalendarCheck,
  MessagesSquare, BarChart3, Layers, Repeat,
} from 'lucide-react'
import type { Accent } from '@/lib/accents'

export const BRAND = {
  name: 'Finance OS',
  promise: 'A broker-specific operating system that captures, follows up, and nurtures every enquiry — automatically.',
  oneLiner: 'Predictable pipeline. More settlements. Less admin.',
  voice: ['Calm', 'Clear', 'Grounded', 'Authoritative'],
}

export interface Feature {
  title: string
  tagline: string
  description: string
  Icon: LucideIcon
  accent: Accent
}

export const FEATURES: Feature[] = [
  { title: 'Unified CRM', tagline: 'All leads in one place.', description: 'Track enquiries, borrowers, and deal progress in a single pipeline — first enquiry to settlement.', Icon: Inbox, accent: 'gold' },
  { title: 'Lead Follow-Up', tagline: 'Automated. Never miss a lead.', description: 'Instant SMS + email follow-ups on every enquiry, tracked inside the pipeline.', Icon: MessageSquare, accent: 'amber' },
  { title: 'Automated Nurture', tagline: 'Stay top of mind.', description: 'Timely campaigns keep prospects warm through longer decision cycles.', Icon: Repeat, accent: 'blue' },
  { title: 'AI Conversations', tagline: 'Respond 24/7.', description: 'AI chat answers, qualifies, and books — even outside business hours.', Icon: Bot, accent: 'gold' },
  { title: 'Workflow Automation', tagline: 'Remove the manual admin.', description: 'Follow-ups, routing, reminders and pipeline updates trigger at the right time.', Icon: Workflow, accent: 'amber' },
  { title: 'Smart Funnels', tagline: 'Capture more leads.', description: 'High-converting, pre-built landing pages that route enquiries into the pipeline.', Icon: Filter, accent: 'blue' },
  { title: 'Online Booking', tagline: 'Clients book instantly.', description: 'Integrated calendar booking with automated reminders — no email back-and-forth.', Icon: CalendarCheck, accent: 'gold' },
  { title: 'Client Messaging', tagline: 'One unified inbox.', description: 'SMS, email and social in one place — every conversation, one client.', Icon: MessagesSquare, accent: 'amber' },
  { title: 'Business Insights', tagline: 'Track what matters.', description: 'Real-time dashboards on lead sources, conversion and pipeline performance.', Icon: BarChart3, accent: 'blue' },
  { title: 'Tech Stack Merge', tagline: 'Replace many tools.', description: 'CRM, marketing, messaging, funnels, analytics and scheduling — one platform.', Icon: Layers, accent: 'gold' },
]

export interface Stat {
  value: number
  display?: string
  prefix?: string
  suffix?: string
  label: string
}

export const STATS: Stat[] = [
  { value: 200, suffix: '+', label: 'Hours saved monthly' },
  { value: 1315, prefix: '$', label: 'Saved per month vs. stack' },
  { value: 8, label: 'Tools consolidated into one' },
  { value: 24, suffix: '/7', label: 'AI follow-up coverage' },
]

export const TOOLS_REPLACED = [
  'CRM', 'Email marketing', 'SMS platform', 'Funnel builder',
  'Website builder', 'Booking software', 'Automation', 'Review management',
]

export const PRICING = { stack: 1612, financeOs: 297 }

export interface Pillar {
  name: string
  weight: string
  blurb: string
  accent: Accent
}

export const PILLARS: Pillar[] = [
  { name: 'The Ruler', weight: '70%', blurb: 'Structure, order, authority and stability. It replaces scattered tools and reactive workflows with a system brokers can rely on.', accent: 'gold' },
  { name: 'The Sage', weight: '30%', blurb: 'Clarity, insight and calm explanation. It turns complexity into understanding so brokers act with confidence, not hesitation.', accent: 'blue' },
]

export const TESTIMONIAL = {
  quote: 'I saved 100s of hours and 1,000s of dollars per month. It has been the best business decision ever — hands down.',
  author: 'Mortgage broker, Finance OS',
}
