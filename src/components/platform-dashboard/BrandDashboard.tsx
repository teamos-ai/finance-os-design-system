/**
 * BrandDashboard — the Finance OS "My Account" workspace, the FRONT face of the promo flip.
 * A faithful rebuild of brand.financeos.au's "platform in motion" dashboard (sidebar · four
 * stat cards · Total Profits bar chart · profile · today's earnings · tasks · new customers),
 * rendered entirely from Finance OS tokens — 8px squircles, hairline borders, solid surfaces,
 * NO glass — instead of the brand page's larger-radius glassy styling. Drawn on a fixed 1280×720
 * (16:9) canvas and scaled to the board by ScaleToFit, so it stays pixel-faithful at any width.
 *
 * Every figure, name and avatar is illustrative sample data (brand rule 09). Avatars are the
 * brand-supplied memoji assets in /public/dash. Blue (Atlas Blue) is the only accent; the MRR
 * tile is the single gradient moment. Decorative only (aria-hidden) — it is a picture of a product.
 */
import {
  MessageSquare, Calendar, GitBranch, Mail, MonitorPlay, Workflow, ClipboardList, Users,
  Share2, DollarSign, Image as ImageIcon, Settings, Box, Target, Laptop, MessageCircle, Crown,
  Search, Command, Zap, MapPin, GripVertical, Check, ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'

const CANVAS_W = 1280
const CANVAS_H = 720

const NAV: [string, LucideIcon][] = [
  ['My Messages', MessageSquare], ['My Calendars', Calendar], ['Pipelines', GitBranch],
  ['Contacts & Emails', Mail], ['Funnels & Websites', MonitorPlay], ['Automations & A.I.', Workflow],
  ['Forms & Surveys', ClipboardList], ['Community & Courses', Users], ['Social Media', Share2],
  ['Payments & Contracts', DollarSign], ['Ads & SEO', ImageIcon], ['Settings', Settings],
  ['Academy', Box], ['Tasks & Projects', Target], ['Partner Portal', Laptop],
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const BARS = [34, 75, 53, 62, 48, 80, 67, 75, 24, 60, 34, 53]
const MINI = [18, 31, 24, 39, 33, 47]
const TASKS: [string, boolean][] = [
  ['Social media', false], ['Install Systems', true], ['Turn on A.I voice calling', true],
  ['Build pipelines', false], ['Follow up settlements', true],
]
const CUSTS: [string, string, string, string][] = [
  ['Chris', 'Today, 9:00', '+ $53', 'Christina'],
  ['Samantha', 'Today, 7:49', '+ $3', 'Samantha'],
  ['Daniella', 'Yesterday, 8:36', '+ $5', 'Daniella'],
]

/* a soft decorative sparkline wave */
function Wave({ light }: { light?: boolean }) {
  return (
    <svg width="78" height="44" viewBox="0 0 85 48" fill="none" aria-hidden style={{ flex: 'none' }}>
      <path
        d="M2 34c10 0 10-24 20-24s10 27 21 27 11-23 21-23 10 8 19 3"
        stroke={light ? 'var(--c-accent-fg)' : 'var(--c-accent)'}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const card: CSSProperties = {
  background: 'var(--c-surface)',
  border: '1px solid var(--c-border)',
  borderRadius: 8,
  boxShadow: 'var(--shadow-md)',
}
const label: CSSProperties = { color: 'var(--c-fg-subtle)', fontSize: 12, fontWeight: 500 }
const value: CSSProperties = { color: 'var(--c-fg)', fontSize: 23, fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }

function RoundIcon({ Icon, pale, size = 52 }: { Icon: LucideIcon; pale?: boolean; size?: number }) {
  return (
    <span
      style={{
        display: 'grid', placeItems: 'center', height: size, width: size, flex: 'none', borderRadius: 8,
        background: pale ? 'var(--c-inset)' : 'var(--c-gradient-accent)',
        border: '1px solid var(--c-border)',
        color: pale ? 'var(--c-accent)' : 'var(--c-accent-fg)',
      }}
    >
      <Icon size={size === 52 ? 24 : 20} strokeWidth={1.75} aria-hidden />
    </span>
  )
}

export function BrandDashboard() {
  return (
    <div
      style={{
        width: CANVAS_W, height: CANVAS_H, display: 'flex', gap: 20, padding: 16,
        background: 'var(--c-canvas-muted)', color: 'var(--c-fg)',
        fontFamily: 'var(--font-sans), system-ui, sans-serif', lineHeight: 1.4, textAlign: 'left',
      }}
      aria-hidden
    >
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{ ...card, width: 250, flex: 'none', display: 'flex', flexDirection: 'column', padding: 16, overflow: 'hidden' }}>
        <div style={{ height: 48, display: 'grid', placeItems: 'center', borderRadius: 8, background: 'var(--c-gradient-accent)', color: 'var(--c-accent-fg)', fontWeight: 600, fontSize: 15 }}>
          My Account
        </div>
        <div style={{ position: 'relative', marginTop: 11, display: 'flex', alignItems: 'center', gap: 8, height: 40, borderRadius: 8, border: '1px solid var(--c-border)', background: 'var(--c-inset)', padding: '0 10px' }}>
          <Search size={14} strokeWidth={1.75} style={{ color: 'var(--c-fg-subtle)' }} aria-hidden />
          <span style={{ flex: 1, color: 'var(--c-fg-subtle)', fontSize: 11 }}>Search</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: 'var(--c-fg-muted)', fontSize: 9, fontWeight: 600, fontFamily: 'var(--font-mono)' }}><Command size={10} strokeWidth={2} aria-hidden />K</span>
          <Zap size={14} strokeWidth={1.75} style={{ color: 'var(--c-accent)' }} aria-hidden />
        </div>
        <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 1, flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
          {NAV.map(([l, Icon], i) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, padding: '4px 6px', fontSize: 11.5, fontWeight: 500, color: i === 0 ? 'var(--c-accent-text)' : 'var(--c-fg-muted)', background: i === 0 ? 'var(--c-selected)' : 'transparent' }}>
              <span style={{ display: 'grid', width: 26, height: 26, flex: 'none', placeItems: 'center', border: '1px solid var(--c-border)', borderRadius: 6, background: 'var(--c-inset)', color: i === 0 ? 'var(--c-accent)' : 'var(--c-fg-subtle)' }}>
                <Icon size={15} strokeWidth={1.75} aria-hidden />
              </span>
              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</span>
              <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--c-fg-subtle)' }} aria-hidden />
            </span>
          ))}
        </div>
        <div style={{ flex: 'none', marginTop: 9, borderTop: '1px solid var(--c-border)', paddingTop: 9, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {([['Team Chat', MessageCircle], ['Game Plan', Crown]] as [string, LucideIcon][]).map(([l, Icon]) => (
            <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 6, padding: '4px 6px', fontSize: 11.5, fontWeight: 500, color: 'var(--c-fg-muted)' }}>
              <span style={{ display: 'grid', width: 26, height: 26, flex: 'none', placeItems: 'center', border: '1px solid var(--c-border)', borderRadius: 6, background: 'var(--c-inset)', color: 'var(--c-fg-subtle)' }}>
                <Icon size={15} strokeWidth={1.75} aria-hidden />
              </span>
              <span>{l}</span>
            </span>
          ))}
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, flex: 'none' }}>
          <div style={{ ...card, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, padding: '18px 20px', overflow: 'hidden' }}>
            <div><p style={label}>Spent this month</p><strong style={{ ...value, display: 'block', marginTop: 6 }}>$928.5</strong></div>
            <div style={{ display: 'flex', height: 44, alignItems: 'flex-end', gap: 5, color: 'var(--c-accent)' }}>
              {MINI.map((h, i) => <span key={i} style={{ width: 7, height: h, borderRadius: 4, background: 'currentColor' }} />)}
            </div>
          </div>
          <div style={{ ...card, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', overflow: 'hidden' }}>
            <RoundIcon Icon={Users} />
            <div style={{ marginRight: 'auto' }}><p style={label}>New Leads</p><strong style={{ ...value, display: 'block', marginTop: 6 }}>321</strong></div>
            <Wave />
          </div>
          <div style={{ ...card, height: 112, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', overflow: 'hidden' }}>
            <RoundIcon Icon={Target} pale size={44} />
            <div style={{ marginRight: 'auto' }}><p style={label}>Revenue</p><strong style={{ ...value, display: 'block', marginTop: 6 }}>$829,320</strong></div>
          </div>
          <div style={{ height: 112, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '18px 20px', overflow: 'hidden', borderRadius: 8, background: 'var(--c-gradient-accent)', boxShadow: 'var(--shadow-md)' }}>
            <div><p style={{ ...label, color: 'var(--c-accent-fg)', opacity: 0.85 }}>MRR</p><strong style={{ ...value, color: 'var(--c-accent-fg)', display: 'block', marginTop: 6 }}>$74,298.50</strong></div>
            <Wave light />
          </div>
        </div>

        {/* lower grid: 3 cols × 2 rows */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: 18, marginTop: 18, flex: 1, minHeight: 0 }}>
          {/* Total Profits (span 2) */}
          <div style={{ ...card, gridColumn: 'span 2', padding: '22px 26px 16px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div><p style={label}>Total Profits</p><h3 style={{ marginTop: 4, fontSize: 36, fontWeight: 600, letterSpacing: '-0.05em', color: 'var(--c-fg)' }}>$328k</h3></div>
              <RoundIcon Icon={Target} pale size={44} />
            </div>
            <div style={{ position: 'relative', marginTop: 8, borderTop: '2px dashed var(--c-border-strong)' }}>
              <span style={{ position: 'absolute', right: 0, top: -11, background: 'var(--c-surface)', paddingLeft: 7, color: 'var(--c-accent-text)', fontSize: 10, fontWeight: 600 }}>$328k</span>
            </div>
            <div style={{ display: 'flex', flex: 1, minHeight: 0, alignItems: 'stretch', gap: 16, paddingTop: 18 }}>
              {BARS.map((h, i) => {
                const sel = i === 5
                return (
                  <div key={i} style={{ display: 'flex', minWidth: 0, flex: 1, flexDirection: 'column', justifyContent: 'flex-end', textAlign: 'center' }}>
                    <div style={{ width: '100%', minHeight: 15, height: `${h}%`, borderRadius: 6, border: '1px solid var(--c-border)', background: sel ? 'var(--c-accent)' : 'var(--c-inset)' }} />
                    <span style={{ marginTop: 10, color: sel ? 'var(--c-accent-text)' : 'var(--c-fg-subtle)', fontSize: 9.5, fontWeight: sel ? 700 : 500 }}>{MONTHS[i]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Profile */}
          <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ height: 150, width: 150, overflow: 'hidden', border: '1px solid var(--c-border)', borderRadius: 8, background: 'var(--c-canvas-muted)' }}>
              <img src="/dash/Champ.png" alt="" width={150} height={150} style={{ height: '100%', width: '100%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ marginTop: 12, color: 'var(--c-fg)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.03em' }}>Champ Carter</h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2, color: 'var(--c-fg-subtle)', fontSize: 10 }}>
              <MapPin size={13} strokeWidth={1.75} aria-hidden /> Melbourne, Australia
            </p>
            <div style={{ display: 'grid', width: '100%', gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 20, border: '1px solid var(--c-border)', borderRadius: 8, background: 'var(--c-canvas-muted)', padding: '12px 0' }}>
              {([['Projects', '28'], ['Followers', '64k'], ['Following', '76']] as [string, string][]).map(([k, v], i) => (
                <div key={k} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--c-border)' : undefined }}>
                  <span style={{ display: 'block', color: 'var(--c-fg-subtle)', fontSize: 9.5 }}>{k}</span>
                  <strong style={{ display: 'block', marginTop: 7, color: 'var(--c-fg)', fontSize: 20, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Today's earnings */}
          <div style={{ ...card, position: 'relative', overflow: 'hidden' }}>
            <div style={{ padding: '22px 26px 0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={label}>Today&apos;s earnings</p>
                  <h3 style={{ marginTop: 3, color: 'var(--c-accent-text)', fontSize: 30, fontWeight: 600, letterSpacing: '-0.04em' }}>$629.5</h3>
                  <span style={{ display: 'inline-block', marginTop: 4, borderRadius: 6, border: '1px solid var(--c-border)', background: 'var(--c-inset)', padding: '4px 10px', color: 'var(--c-accent-text)', fontSize: 10, fontWeight: 600 }}>-2.46% ▼</span>
                </div>
                <RoundIcon Icon={Target} pale size={44} />
              </div>
            </div>
            <svg style={{ position: 'absolute', right: 0, bottom: 0, left: 0, height: 128, width: '100%' }} viewBox="0 0 400 145" preserveAspectRatio="none" aria-hidden>
              <defs>
                <linearGradient id="fosdEarnArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--c-accent)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--c-accent)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 104 C28 129 57 30 88 48 S118 142 146 116 S187 30 210 40 S233 83 258 79 S285 142 315 103 S342 80 362 61 S388 34 400 38 V145 H0Z" fill="url(#fosdEarnArea)" />
              <path d="M0 104 C28 129 57 30 88 48 S118 142 146 116 S187 30 210 40 S233 83 258 79 S285 142 315 103 S342 80 362 61 S388 34 400 38" fill="none" stroke="var(--c-accent)" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>

          {/* Tasks */}
          <div style={{ ...card, padding: '18px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'var(--c-fg)', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-grid', height: 26, width: 26, placeItems: 'center', borderRadius: 6, background: 'var(--c-accent)', color: 'var(--c-accent-fg)' }}><Check size={15} strokeWidth={2.5} aria-hidden /></span>
                Tasks
              </h3>
              <span style={{ color: 'var(--c-fg-subtle)', fontSize: 16, letterSpacing: 3 }}>···</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {TASKS.map(([t, done]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 9, color: done ? 'var(--c-fg)' : 'var(--c-fg-muted)', fontSize: 10.5 }}>
                  <span style={{ display: 'grid', height: 22, width: 22, flex: 'none', placeItems: 'center', border: '2px solid ' + (done ? 'transparent' : 'var(--c-border-strong)'), borderRadius: 6, background: done ? 'var(--c-accent)' : 'transparent', color: 'var(--c-accent-fg)' }}>
                    {done && <Check size={12} strokeWidth={3} aria-hidden />}
                  </span>
                  <span style={{ flex: 1 }}>{t}</span>
                  <GripVertical size={16} strokeWidth={1.75} style={{ color: 'var(--c-fg-subtle)' }} aria-hidden />
                </div>
              ))}
            </div>
          </div>

          {/* New Customers */}
          <div style={{ ...card, padding: '18px 22px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ color: 'var(--c-fg)', fontSize: 16, fontWeight: 600 }}>New Customers</h3>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {CUSTS.map(([n, tm, am, av]) => (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <img src={`/dash/${av}.png`} alt="" width={36} height={36} style={{ height: 36, width: 36, border: '1px solid var(--c-border)', borderRadius: 6, objectFit: 'cover' }} />
                  <div style={{ display: 'flex', minWidth: 0, flex: 1, flexDirection: 'column' }}>
                    <strong style={{ color: 'var(--c-fg)', fontSize: 11, fontWeight: 600 }}>{n}</strong>
                    <span style={{ color: 'var(--c-fg-subtle)', fontSize: 9 }}>{tm}</span>
                  </div>
                  <b style={{ borderRadius: 6, border: '1px solid var(--c-border)', background: 'var(--c-inset)', padding: '6px 10px', color: 'var(--c-accent-text)', fontSize: 10, fontWeight: 600 }}>{am}</b>
                </div>
              ))}
            </div>
            <span style={{ marginTop: 'auto', paddingTop: 12, textAlign: 'right', color: 'var(--c-accent-text)', fontSize: 10, fontWeight: 600 }}>View all →</span>
          </div>
        </div>
      </div>
    </div>
  )
}
