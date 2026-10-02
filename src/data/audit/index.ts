/**
 * The audit, assembled.
 *
 * Three parts. Discovery is the first call and is about the business as it is. Diagnosis
 * is the second and measures the machine against the built configuration in
 * `build-spec.ts`. Handoff is filled at the end and between calls, and produces the
 * checklist for the separate hands-on pass through the client's own software.
 *
 * Modules live one concern per file under `modules/`. Adding one is two edits: write the
 * file, add it to the part below.
 */
import { Compass, Stethoscope, PackageCheck } from 'lucide-react'
import type { Part } from '@/audit/types'

import { MODULE_BUSINESS, MODULE_NUMBERS } from './modules/discovery-business'
import { MODULE_DEMAND, MODULE_JOURNEY } from './modules/discovery-demand'
import { MODULE_STACK, MODULE_PEOPLE, MODULE_AMBITION } from './modules/discovery-capacity'
import { MODULE_DATA, MODULE_PIPELINE } from './modules/diagnosis-core'
import { MODULE_CAPTURE, MODULE_FOLLOWUP, MODULE_CONVERSATION } from './modules/diagnosis-engine'
import { MODULE_BOOKING, MODULE_RETENTION, MODULE_MARKET } from './modules/diagnosis-lifecycle'
import { MODULE_COMPLIANCE, MODULE_VISIBILITY } from './modules/diagnosis-posture'
import { MODULE_SCOPE, MODULE_INPUTS, MODULE_ACCESS, MODULE_RECORD } from './modules/handoff'

export const DISCOVERY: Part = {
  id: 'discovery',
  kicker: 'Part one',
  title: 'Discovery',
  summary:
    'The business as it stands — who holds the licence, what the numbers actually are, where the work comes from, and what a client experiences end to end.',
  excludes: 'No solution talk. Nothing about what we would build. This call is theirs.',
  Icon: Compass,
  modules: [
    MODULE_BUSINESS,
    MODULE_NUMBERS,
    MODULE_DEMAND,
    MODULE_JOURNEY,
    MODULE_STACK,
    MODULE_PEOPLE,
    MODULE_AMBITION,
  ],
}

export const DIAGNOSIS: Part = {
  id: 'diagnosis',
  kicker: 'Part two',
  title: 'Diagnosis',
  summary:
    'The machine, measured against the built configuration — database, pipelines, capture, follow-up, conversation, lifecycle, compliance posture and what they can see.',
  excludes:
    'Still not a pitch. Findings are stated as findings; nothing here promises a fix or a figure.',
  Icon: Stethoscope,
  modules: [
    MODULE_DATA,
    MODULE_PIPELINE,
    MODULE_CAPTURE,
    MODULE_FOLLOWUP,
    MODULE_CONVERSATION,
    MODULE_BOOKING,
    MODULE_RETENTION,
    MODULE_MARKET,
    MODULE_COMPLIANCE,
    MODULE_VISIBILITY,
  ],
}

export const HANDOFF: Part = {
  id: 'handoff',
  kicker: 'Part three',
  title: 'Handoff',
  summary:
    'Scope, the four things onboarding cannot start without, the access pack for the hands-on pass, and the record of what was and was not agreed.',
  Icon: PackageCheck,
  modules: [MODULE_SCOPE, MODULE_INPUTS, MODULE_ACCESS, MODULE_RECORD],
}

export const AUDIT_PARTS: Part[] = [DISCOVERY, DIAGNOSIS, HANDOFF]
