/**
 * build-icons.mjs — regenerates the Finance OS icon system.
 *
 * Source: Phosphor Icons "Fill" weight (MIT, © 2023 Phosphor Icons) — a solid,
 * geometric icon family used here as the visual basis for the Finance OS set.
 * We render each glyph with `fill="currentColor"`, so the brand token layer
 * drives the colour (Momentum Amber on dark/paper, Atlas Blue on light, white
 * on accent fills). Filled / solid only — matching the ReUI "solid" reference.
 *
 * What it does:
 *   1. Reads the curated MANIFEST below.
 *   2. Pulls each Phosphor "<name>-fill.svg", extracts its inner markup + viewBox.
 *   3. Vendors a standalone SVG per icon into  icons-src/svg/  (self-contained repo).
 *   4. Writes  src/data/icons.ts  (the ICONS array the app consumes).
 *   5. Packs  public/finance-os-icons.zip  (raw SVGs + LICENSE) via the `zip` CLI.
 *
 * Run:  PHOSPHOR_DIR=~/dev/phosphor-core/assets/fill node scripts/build-icons.mjs
 * (defaults to that path). Commit the regenerated icons.ts, icons-src/, and zip together.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const PHOSPHOR_DIR =
  process.env.PHOSPHOR_DIR?.replace(/^~/, homedir()) ??
  join(homedir(), 'dev/phosphor-core/assets/fill')
const VENDOR_DIR = join(ROOT, 'icons-src/svg')
const OUT_TS = join(ROOT, 'src/data/icons.ts')
const OUT_ZIP = join(ROOT, 'public/finance-os-icons.zip')

/** Category order = display order in the Icons section. */
const CATEGORIES = [
  'Finance & money',
  'Business',
  'Users & people',
  'Software & SaaS',
  'Project management',
  'Learning & education',
  'Devices',
  'Technology & data',
  'Security',
  'Social media',
  'Notifications & communication',
  'Settings & interface',
  'Text & formatting',
  'Brands & logos',
]

// [phosphorName, category, keywords, financeName?]  — financeName defaults to phosphorName.
const MANIFEST = [
  // ── Finance & money ────────────────────────────────────────────────────────
  ['currency-dollar', 'Finance & money', 'money dollar cash price'],
  ['coins', 'Finance & money', 'money savings stack currency'],
  ['coin', 'Finance & money', 'money token currency'],
  ['money', 'Finance & money', 'cash bill banknote payment'],
  ['wallet', 'Finance & money', 'money cards purse balance'],
  ['credit-card', 'Finance & money', 'payment debit visa card'],
  ['bank', 'Finance & money', 'institution finance building'],
  ['piggy-bank', 'Finance & money', 'savings deposit fund'],
  ['vault', 'Finance & money', 'safe secure deposit'],
  ['receipt', 'Finance & money', 'invoice bill tax payment'],
  ['invoice', 'Finance & money', 'bill statement receipt'],
  ['calculator', 'Finance & money', 'maths accounting sum numbers'],
  ['chart-line-up', 'Finance & money', 'growth increase trend revenue'],
  ['chart-bar', 'Finance & money', 'analytics stats report'],
  ['chart-pie-slice', 'Finance & money', 'analytics share split allocation'],
  ['chart-line-down', 'Finance & money', 'loss decline drop chart down'],
  ['trend-up', 'Finance & money', 'growth arrow increase', 'trending-up'],
  ['trend-down', 'Finance & money', 'loss arrow decrease', 'trending-down'],
  ['percent', 'Finance & money', 'discount rate interest'],
  ['hand-coins', 'Finance & money', 'pay salary payout lend'],
  ['scales', 'Finance & money', 'balance compare law tax'],
  ['currency-circle-dollar', 'Finance & money', 'money account dollar'],
  ['seal-percent', 'Finance & money', 'discount offer sale'],

  // ── Business ───────────────────────────────────────────────────────────────
  ['briefcase', 'Business', 'work job portfolio business'],
  ['buildings', 'Business', 'office company corporate hq'],
  ['handshake', 'Business', 'deal agreement partner trust'],
  ['presentation-chart', 'Business', 'pitch report meeting slides'],
  ['target', 'Business', 'goal aim focus objective'],
  ['trophy', 'Business', 'award win achievement winner'],
  ['medal', 'Business', 'award prize recognition'],
  ['rocket-launch', 'Business', 'launch startup scale growth', 'rocket'],
  ['lightbulb', 'Business', 'idea innovation insight'],
  ['strategy', 'Business', 'plan tactics chess play'],
  ['briefcase-metal', 'Business', 'work case portfolio'],
  ['suitcase', 'Business', 'travel trip business'],
  ['certificate', 'Business', 'award qualified diploma'],
  ['stamp', 'Business', 'approve seal official'],
  ['gavel', 'Business', 'law legal compliance judge'],
  ['storefront', 'Business', 'shop retail store commerce'],
  ['crown', 'Business', 'premium vip winner leader royal'],
  ['shopping-cart', 'Business', 'ecommerce buy checkout basket'],
  ['shopping-bag', 'Business', 'ecommerce purchase buy retail'],

  // ── Users & people ───────────────────────────────────────────────────────
  ['user', 'Users & people', 'person account profile'],
  ['users', 'Users & people', 'people team group'],
  ['users-three', 'Users & people', 'team group community'],
  ['user-circle', 'Users & people', 'account avatar profile'],
  ['user-plus', 'Users & people', 'add invite signup member'],
  ['user-gear', 'Users & people', 'account settings profile config'],
  ['user-check', 'Users & people', 'verified approved member', 'user-check'],
  ['identification-badge', 'Users & people', 'id employee pass profile'],
  ['identification-card', 'Users & people', 'id card contact profile'],
  ['address-book', 'Users & people', 'contacts directory people'],
  ['user-focus', 'Users & people', 'target audience person'],
  ['head-circuit', 'Users & people', 'ai brain mind assistant'],

  // ── Software & SaaS ──────────────────────────────────────────────────────
  ['code', 'Software & SaaS', 'development programming source'],
  ['brackets-curly', 'Software & SaaS', 'code json object dev'],
  ['terminal-window', 'Software & SaaS', 'console cli command shell'],
  ['git-branch', 'Software & SaaS', 'version control repo branch'],
  ['git-merge', 'Software & SaaS', 'version control merge pr'],
  ['bug', 'Software & SaaS', 'error defect issue debug'],
  ['stack', 'Software & SaaS', 'layers tech stack build'],
  ['puzzle-piece', 'Software & SaaS', 'plugin integration module'],
  ['plugs-connected', 'Software & SaaS', 'integration api connect'],
  ['webhooks-logo', 'Software & SaaS', 'webhook api event', 'webhook'],
  ['app-window', 'Software & SaaS', 'application software window'],
  ['squares-four', 'Software & SaaS', 'dashboard apps grid modules'],
  ['toggle-right', 'Software & SaaS', 'feature flag switch on'],
  ['flask', 'Software & SaaS', 'experiment beta test lab'],
  ['function', 'Software & SaaS', 'formula method compute'],
  ['file-code', 'Software & SaaS', 'source file script dev'],

  // ── Project management ───────────────────────────────────────────────────
  ['kanban', 'Project management', 'board columns workflow tasks'],
  ['list-checks', 'Project management', 'todo tasks checklist done'],
  ['check-circle', 'Project management', 'done complete approved'],
  ['check-square', 'Project management', 'task done checkbox complete'],
  ['calendar-check', 'Project management', 'schedule deadline event done'],
  ['calendar-dots', 'Project management', 'schedule planner dates'],
  ['clipboard-text', 'Project management', 'notes brief tasks doc'],
  ['flag', 'Project management', 'milestone priority goal'],
  ['flag-checkered', 'Project management', 'finish goal milestone launch'],
  ['timer', 'Project management', 'deadline countdown sprint'],
  ['tree-structure', 'Project management', 'hierarchy dependencies org'],
  ['funnel', 'Project management', 'pipeline filter stages'],
  ['note-pencil', 'Project management', 'edit note task write'],
  ['push-pin', 'Project management', 'pin priority important'],
  ['hourglass', 'Project management', 'time pending waiting'],
  ['graph', 'Project management', 'network nodes dependencies'],

  // ── Learning & education ─────────────────────────────────────────────────
  ['graduation-cap', 'Learning & education', 'course degree learn student'],
  ['book-open', 'Learning & education', 'read docs guide manual'],
  ['books', 'Learning & education', 'library knowledge courses'],
  ['student', 'Learning & education', 'learner course pupil'],
  ['chalkboard-teacher', 'Learning & education', 'teach lesson class train'],
  ['certificate', 'Learning & education', 'diploma award completion', 'diploma'],
  ['exam', 'Learning & education', 'test quiz assessment'],
  ['notebook', 'Learning & education', 'notes journal study'],
  ['brain', 'Learning & education', 'knowledge memory smart'],
  ['lightbulb-filament', 'Learning & education', 'idea insight learn'],
  ['bookmark-simple', 'Learning & education', 'save read later mark'],
  ['video-camera', 'Learning & education', 'lesson course tutorial record'],

  // ── Devices ──────────────────────────────────────────────────────────────
  ['device-mobile', 'Devices', 'phone smartphone mobile'],
  ['device-tablet', 'Devices', 'tablet ipad device'],
  ['laptop', 'Devices', 'computer notebook macbook'],
  ['desktop', 'Devices', 'computer monitor screen'],
  ['monitor', 'Devices', 'screen display desktop'],
  ['watch', 'Devices', 'wearable smartwatch time'],
  ['keyboard', 'Devices', 'input typing device'],
  ['mouse', 'Devices', 'input pointer device'],
  ['headphones', 'Devices', 'audio sound music support'],
  ['printer', 'Devices', 'print output paper'],
  ['camera', 'Devices', 'photo capture lens'],
  ['hard-drives', 'Devices', 'storage disk server'],
  ['sim-card', 'Devices', 'mobile network chip'],
  ['usb', 'Devices', 'port connector drive'],
  ['bluetooth', 'Devices', 'wireless connect pair signal'],

  // ── Technology & data ────────────────────────────────────────────────────
  ['cpu', 'Technology & data', 'processor chip compute'],
  ['database', 'Technology & data', 'data storage sql records'],
  ['cloud', 'Technology & data', 'saas hosting online sync'],
  ['cloud-arrow-up', 'Technology & data', 'upload backup sync cloud'],
  ['computer-tower', 'Technology & data', 'hosting backend infra server'],
  ['wifi-high', 'Technology & data', 'network wireless signal'],
  ['broadcast', 'Technology & data', 'live signal stream network'],
  ['lightning', 'Technology & data', 'fast power energy speed'],
  ['globe', 'Technology & data', 'internet web world network'],
  ['robot', 'Technology & data', 'ai automation bot'],
  ['sparkle', 'Technology & data', 'ai magic smart generate'],
  ['circuitry', 'Technology & data', 'chip electronics ai tech'],
  ['graphics-card', 'Technology & data', 'gpu compute hardware'],
  ['gauge', 'Technology & data', 'speed performance metrics dashboard'],
  ['funnel-simple', 'Technology & data', 'data filter pipeline'],
  ['binary', 'Technology & data', 'code data bits'],
  ['image', 'Technology & data', 'photo picture media asset'],
  ['image-square', 'Technology & data', 'photo picture media gallery'],
  ['screencast', 'Technology & data', 'cast stream present share screen'],
  ['cube', 'Technology & data', '3d model object package block'],

  // ── Security ─────────────────────────────────────────────────────────────
  ['lock-simple', 'Security', 'secure private locked'],
  ['lock-key', 'Security', 'secure access password'],
  ['lock-open', 'Security', 'unlocked access open'],
  ['shield', 'Security', 'protection secure defense'],
  ['shield-check', 'Security', 'protected verified secure'],
  ['shield-warning', 'Security', 'risk alert threat security'],
  ['key', 'Security', 'access login password credentials'],
  ['fingerprint', 'Security', 'biometric identity auth'],
  ['scan', 'Security', 'verify scan biometric'],
  ['eye', 'Security', 'view visibility watch'],
  ['eye-slash', 'Security', 'hidden private hide password'],
  ['password', 'Security', 'credentials secure login'],
  ['seal-check', 'Security', 'verified trusted authentic'],
  ['warning', 'Security', 'alert caution risk'],
  ['wall', 'Security', 'firewall barrier protection block'],

  // ── Social media ─────────────────────────────────────────────────────────
  ['heart', 'Social media', 'like love favorite'],
  ['thumbs-up', 'Social media', 'like approve upvote'],
  ['chat-circle', 'Social media', 'comment message reply'],
  ['chats-circle', 'Social media', 'conversation comments dm'],
  ['share-network', 'Social media', 'share repost distribute'],
  ['share-fat', 'Social media', 'share send forward'],
  ['at', 'Social media', 'mention username handle'],
  ['hash', 'Social media', 'hashtag topic tag'],
  ['star', 'Social media', 'favorite rate save'],
  ['bookmarks', 'Social media', 'save collection later'],
  ['users-four', 'Social media', 'community audience followers'],
  ['thumbs-down', 'Social media', 'dislike downvote'],
  ['paper-plane-tilt', 'Social media', 'send message dm share'],
  ['smiley', 'Social media', 'emoji reaction happy'],

  // ── Notifications & communication ────────────────────────────────────────
  ['bell', 'Notifications & communication', 'alert notification reminder'],
  ['bell-ringing', 'Notifications & communication', 'alert active notification'],
  ['bell-slash', 'Notifications & communication', 'mute silence off'],
  ['envelope', 'Notifications & communication', 'email mail message'],
  ['envelope-open', 'Notifications & communication', 'email read open'],
  ['chat-teardrop-text', 'Notifications & communication', 'message chat support'],
  ['megaphone', 'Notifications & communication', 'announce broadcast marketing'],
  ['phone', 'Notifications & communication', 'call contact support'],
  ['phone-call', 'Notifications & communication', 'call ringing contact'],
  ['voicemail', 'Notifications & communication', 'message voice audio'],
  ['archive', 'Notifications & communication', 'messages store archive queue'],
  ['tray', 'Notifications & communication', 'inbox incoming queue'],
  ['warning-circle', 'Notifications & communication', 'alert notice info'],
  ['info', 'Notifications & communication', 'information help notice'],

  // ── Settings & interface ─────────────────────────────────────────────────
  ['gear', 'Settings & interface', 'settings config preferences'],
  ['gear-six', 'Settings & interface', 'settings config options'],
  ['sliders-horizontal', 'Settings & interface', 'controls adjust settings filter'],
  ['toggle-left', 'Settings & interface', 'switch off setting'],
  ['faders', 'Settings & interface', 'controls mixer adjust'],
  ['magnifying-glass', 'Settings & interface', 'search find lookup'],
  ['funnel-x', 'Settings & interface', 'filter clear reset'],
  ['plus', 'Settings & interface', 'add new create'],
  ['minus', 'Settings & interface', 'remove subtract'],
  ['x', 'Settings & interface', 'close cancel dismiss'],
  ['check', 'Settings & interface', 'done confirm ok'],
  ['dots-three', 'Settings & interface', 'more menu options'],
  ['list', 'Settings & interface', 'menu list rows'],
  ['arrow-right', 'Settings & interface', 'next forward go'],
  ['arrow-left', 'Settings & interface', 'back previous return'],
  ['caret-down', 'Settings & interface', 'dropdown expand chevron'],
  ['arrows-clockwise', 'Settings & interface', 'refresh sync reload'],
  ['trash', 'Settings & interface', 'delete remove bin'],
  ['pencil-simple', 'Settings & interface', 'edit write modify'],
  ['download-simple', 'Settings & interface', 'download save export', 'download'],
  ['upload-simple', 'Settings & interface', 'upload import send', 'upload'],
  ['copy', 'Settings & interface', 'duplicate clipboard copy'],
  ['link', 'Settings & interface', 'url hyperlink connect'],
  ['house', 'Settings & interface', 'home dashboard start'],
  ['folder', 'Settings & interface', 'directory files storage'],
  ['file', 'Settings & interface', 'document page file'],
  ['funnel-simple-x', 'Settings & interface', 'filter off clear'],
  ['sun', 'Settings & interface', 'light theme day mode'],
  ['moon', 'Settings & interface', 'dark theme night mode'],
  ['caret-up', 'Settings & interface', 'expand chevron up collapse'],
  ['caret-left', 'Settings & interface', 'back previous chevron left'],
  ['caret-right', 'Settings & interface', 'next forward chevron right'],
  ['x-square', 'Settings & interface', 'close cancel remove box'],
  ['plus-square', 'Settings & interface', 'add new create box'],
  ['minus-square', 'Settings & interface', 'remove subtract collapse box'],
  ['compass', 'Settings & interface', 'navigate explore direction'],
  ['map-pin', 'Settings & interface', 'location place marker map'],
  ['clock', 'Settings & interface', 'time schedule recent history'],
  ['spinner-gap', 'Settings & interface', 'loading progress busy wait', 'loading'],
  ['file-text', 'Settings & interface', 'document page notes text'],
  ['folder-simple-star', 'Settings & interface', 'favorite folder starred', 'folder-star'],
  ['columns', 'Settings & interface', 'layout split two-column view'],
  ['layout', 'Settings & interface', 'dashboard grid arrange sections'],
  ['cards', 'Settings & interface', 'deck stack cards view'],
  ['palette', 'Settings & interface', 'colour theme design swatch'],
  ['swatches', 'Settings & interface', 'colour palette samples design'],
  ['paint-bucket', 'Settings & interface', 'fill colour paint theme'],
]

// [phosphorName, category, keywords, financeName?] — appended batches follow.
const MANIFEST_EXTRA = [
  // ── Text & formatting ────────────────────────────────────────────────────
  ['text-b', 'Text & formatting', 'bold weight strong', 'text-bold'],
  ['text-italic', 'Text & formatting', 'italic emphasis slant'],
  ['text-underline', 'Text & formatting', 'underline emphasis line'],
  ['text-strikethrough', 'Text & formatting', 'strike cross delete text'],
  ['text-align-left', 'Text & formatting', 'align left paragraph'],
  ['text-align-center', 'Text & formatting', 'align center paragraph'],
  ['text-align-right', 'Text & formatting', 'align right paragraph'],
  ['text-align-justify', 'Text & formatting', 'align justify paragraph block'],
  ['list-bullets', 'Text & formatting', 'bullet list unordered'],
  ['list-numbers', 'Text & formatting', 'numbered ordered list'],
  ['quotes', 'Text & formatting', 'quote blockquote citation'],
  ['link-simple', 'Text & formatting', 'hyperlink url anchor'],

  // ── Brands & logos ───────────────────────────────────────────────────────
  ['facebook-logo', 'Brands & logos', 'social facebook meta'],
  ['instagram-logo', 'Brands & logos', 'social instagram photo'],
  ['x-logo', 'Brands & logos', 'social twitter x'],
  ['linkedin-logo', 'Brands & logos', 'social linkedin professional b2b'],
  ['youtube-logo', 'Brands & logos', 'social youtube video'],
  ['tiktok-logo', 'Brands & logos', 'social tiktok video'],
  ['snapchat-logo', 'Brands & logos', 'social snapchat'],
  ['whatsapp-logo', 'Brands & logos', 'social whatsapp chat messaging'],
  ['telegram-logo', 'Brands & logos', 'social telegram messaging'],
  ['discord-logo', 'Brands & logos', 'social discord community chat'],
  ['slack-logo', 'Brands & logos', 'work slack messaging team'],
  ['github-logo', 'Brands & logos', 'dev github code repo'],
  ['google-logo', 'Brands & logos', 'google search account'],
  ['apple-logo', 'Brands & logos', 'apple ios mac'],
  ['windows-logo', 'Brands & logos', 'windows microsoft os'],
  ['spotify-logo', 'Brands & logos', 'music spotify audio'],
  ['paypal-logo', 'Brands & logos', 'payment paypal checkout'],
  ['framer-logo', 'Brands & logos', 'framer design prototype'],
]

// ── generate ────────────────────────────────────────────────────────────────
if (!existsSync(PHOSPHOR_DIR)) {
  console.error(`Phosphor source not found: ${PHOSPHOR_DIR}\nSet PHOSPHOR_DIR to the phosphor-icons/core assets/fill dir.`)
  process.exit(1)
}

rmSync(VENDOR_DIR, { recursive: true, force: true })
mkdirSync(VENDOR_DIR, { recursive: true })

const seen = new Set()
const missing = []
const dupes = []
const entries = []

for (const [phosphor, category, keywords, financeName] of [...MANIFEST, ...MANIFEST_EXTRA]) {
  const name = financeName ?? phosphor
  if (seen.has(name)) { dupes.push(name); continue }
  seen.add(name)
  const src = join(PHOSPHOR_DIR, `${phosphor}-fill.svg`)
  if (!existsSync(src)) { missing.push(phosphor); continue }
  const raw = readFileSync(src, 'utf8')
  const viewBox = (raw.match(/viewBox="([^"]+)"/) || [])[1] || '0 0 256 256'
  const body = raw.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim()
  // vendored standalone svg (currentColor so the consumer themes it)
  const standalone = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="24" height="24" fill="currentColor">${body}</svg>\n`
  writeFileSync(join(VENDOR_DIR, `${name}.svg`), standalone)
  entries.push({ name, category, keywords, viewBox, body })
}

if (missing.length) {
  console.error(`Missing Phosphor sources (${missing.length}):\n  ${missing.join('\n  ')}`)
  process.exit(1)
}
if (dupes.length) {
  console.error(`Duplicate icon names: ${dupes.join(', ')}`)
  process.exit(1)
}

// order entries by category order, preserving manifest order within a category
entries.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category))

const esc = (s) => s.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
let ts = `/**
 * Finance OS Icon System — solid (filled) icons.
 *
 * GENERATED by scripts/build-icons.mjs — do not edit by hand. Re-run the script
 * to change the set (see that file for the curated manifest).
 *
 * Visual basis: Phosphor Icons "Fill" weight (MIT, © 2023 Phosphor Icons),
 * chosen for its solid, geometric style. Every glyph uses a single
 * \`currentColor\` fill, so the brand token layer drives the colour — Momentum
 * Amber on dark/paper, Atlas Blue on light, white (\`--c-accent-fg\`) on accent
 * fills. Filled / solid only, no outline variants.
 *
 * \`body\` is the inner SVG markup; render via <Icon name>, which wraps it in
 * <svg viewBox={viewBox} fill="currentColor">.
 */
export type IconCategory =
${CATEGORIES.map((c) => `  | '${c}'`).join('\n')}

export interface IconDef {
  name: string
  category: IconCategory
  keywords: string
  /** SVG viewBox for this glyph (Phosphor icons are '0 0 256 256'). */
  viewBox: string
  body: string
}

export const ICON_CATEGORIES: IconCategory[] = [
${CATEGORIES.map((c) => `  '${c}',`).join('\n')}
]

export const ICONS: IconDef[] = [
`
let lastCat = null
for (const e of entries) {
  if (e.category !== lastCat) {
    ts += `  // ── ${e.category} ${'─'.repeat(Math.max(2, 74 - e.category.length))}\n`
    lastCat = e.category
  }
  ts += `  { name: '${e.name}', category: '${e.category}', keywords: '${e.keywords}', viewBox: '${e.viewBox}', body: \`${esc(e.body)}\` },\n`
}
ts += `]\n`

writeFileSync(OUT_TS, ts)

// ── pack the downloadable zip (raw SVGs + license) ───────────────────────────
const NOTICE = `Finance OS — Icon Pack
======================

These icons are provided for use in your own websites and projects.

They are built on Phosphor Icons (Fill weight), licensed under the MIT License:

  MIT License — Copyright (c) 2023 Phosphor Icons
  https://github.com/phosphor-icons/core

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so.

The Finance OS naming, categorisation and brand-token colouring are by Oscale.
Each SVG uses fill="currentColor" — set a CSS color to recolour it.

Note on brand logos: icons in the "Brands & logos" set depict third-party marks
(e.g. Facebook, Google, Apple, GitHub). The SVG geometry is MIT-licensed via
Phosphor, but the marks themselves are trademarks of their respective owners.
Use them only to refer to those brands, following each owner's brand guidelines.
`
writeFileSync(join(ROOT, 'icons-src/LICENSE.txt'), NOTICE)

rmSync(OUT_ZIP, { force: true })
mkdirSync(join(ROOT, 'public'), { recursive: true })
execFileSync('zip', ['-q', '-j', '-r', OUT_ZIP, VENDOR_DIR, join(ROOT, 'icons-src/LICENSE.txt')])

console.log(`✓ ${entries.length} icons across ${CATEGORIES.length} categories`)
console.log(`  → ${OUT_TS.replace(ROOT + '/', '')}`)
console.log(`  → ${VENDOR_DIR.replace(ROOT + '/', '')}/ (${entries.length} svgs)`)
console.log(`  → ${OUT_ZIP.replace(ROOT + '/', '')}`)
