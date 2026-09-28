import { Section } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { Inspectable } from '@/components/ui/inspectable'

const BG_TILES = [
  { name: 'White', bg: '#FFFFFF', rect: '/logo-rect-blue.png', mark: '/logo-square-blue.png' },
  { name: 'Muted', bg: '#F6F7F9', rect: '/logo-rect-blue.png', mark: '/logo-square-blue.png' },
  { name: 'Black', bg: '#000000', rect: '/logo-rect-white.png', mark: '/logo-square-blue.png' },
]

export function LogoSection() {
  return (
    <Section
      id="logo"
      eyebrow="10 — Logo"
      title="Logo"
      lead="The Finance OS mark and lockup across surfaces — Atlas Blue on white, white on black."
    >
      <div>
        <MonoLabel tone="brand" dot>Logo lockups · the mark across surfaces</MonoLabel>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {BG_TILES.map((tile) => (
            <Inspectable
              key={tile.name}
              name={`Logo — ${tile.name}`}
              explain={`The Finance OS logo as it appears on a ${tile.name.toLowerCase()} background: the rectangular lockup and the square mark.`}
              token={`${tile.rect}\n${tile.mark}`}
              code={`<img src="${tile.rect}" alt="Finance OS" />`}
              download={{ filename: tile.rect.split('/').pop() as string, href: tile.rect }}
            >
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="flex flex-col items-center justify-center gap-6 p-8" style={{ background: tile.bg }}>
                  <img src={tile.rect} alt={`Finance OS lockup — ${tile.name}`} className="h-9 w-auto object-contain" />
                  <img src={tile.mark} alt="Finance OS mark" className="h-10 w-10 object-contain" />
                </div>
                <div className="border-t border-border bg-surface px-4 py-2.5">
                  <span className="font-mono text-caption text-fg-subtle">{tile.name}</span>
                </div>
              </div>
            </Inspectable>
          ))}
        </div>
      </div>
    </Section>
  )
}
