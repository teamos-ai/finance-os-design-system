/**
 * FoldersSection — the reusable Folder object, and the download-folder pattern built on it.
 *
 * The folder is an illustrated asset (like the logo), so it owns its drawn geometry; everything else
 * is the system — the back-panel art is the signature halftone clouds (or a token wash), the key is a
 * solid Atlas-Blue 8px squircle, the menu a solid popover, motion is the --ease-out / --ease-confirm
 * vocabulary, and the frosted front is a near-opaque scoped "material", never a glass UI surface.
 * Use it anywhere files, storage, templates or downloads want a container with presence.
 */
import { Section, Demo } from '@/showcase/Section'
import { MonoLabel } from '@/components/ui/mono-label'
import { TokenTag } from '@/components/ui/token-tag'
import type { InspectData } from '@/components/ui/inspectable'
import { Folder } from '@/components/brand/Folder'
import { DownloadFolder } from '@/components/brand/DownloadFolder'

const FOLDER_INSPECT: InspectData = {
  name: 'Folder',
  explain:
    'A folder drawn as an object: a back panel holding a liquid blue field, the files it contains, and a frosted front that leans open on hover, focus or press so the files rise and fan — each one a button. The back art is a blue marble/streak (the onestaaack tools look, every colour an Atlas Blue ramp value) or the animated cloud signature. The key adds files (+), opens a menu (···) or downloads (↓). It is an illustration, so it owns its curves; the detached chrome stays on the 8px grid, solid and token-coloured. A trailing "· +N" in the meta is drawn in the accent.',
  token: [
    'art        atlas·azure·tide·mist·slate (marble/streak) · clouds · wash · none · image',
    'ramp       every art colour is an Atlas Blue value (#33488f=--p-blue-400 …) — on-palette',
    'action     add (+) · more (···) · download (↓) · none',
    'meta       "220 fields · +28" — the trailing "· +N" is --c-accent-text',
    'key        bg-accent · 8px squircle · white glyph (blue leads)',
    'front      near-opaque frosted material (scoped) · --c-surface base',
    'motion     open --ease-out (land + hold) · drop --ease-confirm (the one overshoot)',
    'focus      --c-ring (neutral) · reduced-motion safe',
  ].join('\n'),
  code: `import { Folder } from '@/components/brand/Folder'

<Folder
  label="Contacts"
  meta="220 fields · +28"   // trailing "· +N" → accent
  art="atlas"               // atlas·azure·tide·mist·slate · clouds · wash · none · image
  action="add"              // add · more · download · none
  files={[{ name: 'Brief.pdf', meta: 'PDF · 1.2 MB', art: 'tide' }]}
/>`,
}

const DOWNLOAD_INSPECT: InspectData = {
  name: 'Download folder',
  explain:
    'A download drawn as a folder instead of a button. It floats, centered, with space around it. The first press opens it so you see what you are about to take; the second press — the front or the ↓ key — saves the real file. The label spells the second step out, so the two-press gesture is never a guess. Give it the asset href (or in-memory content), the filename, and the sheets to preview.',
  token: [
    'press 1    opens — the files fan out (a preview of the contents)',
    'press 2    front or ↓ key → the real file saves (downloadHref / downloadBlob)',
    'label      "Press again to download" while open (--c-accent-text)',
    'layout     centered · floating · minimal (the brief)',
    'built on   <Folder action="download" /> — same object, same tokens',
  ].join('\n'),
  code: `import { DownloadFolder } from '@/components/brand/DownloadFolder'

<DownloadFolder
  label="Full Lucide set"
  meta="2713 · 1.2 MB"
  filename="lucide-icons-full.zip"
  href="/packs/lucide-icons-full.zip"
  files={[
    { name: 'lucide-static', meta: '2356 SVG', art: 'wash' },
    { name: '@lucide/lab', meta: '357 SVG' },
    { name: 'README.md', meta: 'ISC' },
  ]}
/>`,
}

export function FoldersSection() {
  return (
    <Section
      id="folders"
      eyebrow="Folders"
      title="Folders"
      lead="A folder you can actually use, drawn as an object. Press one to open it — the files rise and fan, each a button. The back panel is a liquid blue field (a marble or streak painted from the Atlas Blue ramp — the onestaaack tools look), or the animated cloud signature. The key adds, menus or downloads. Reuse it wherever files, storage, templates or downloads want a container with presence."
    >
      <div className="flex flex-col gap-8">
        {/* A — the object, across its art + action variants */}
        <Demo
          label="The folder — press to open, then click a file"
          inspect={FOLDER_INSPECT}
          action={<TokenTag>{'<Folder art action files>'}</TokenTag>}
        >
          <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-12 py-4">
            <div className="flex flex-col items-center gap-3">
              <Folder
                label="Contacts"
                meta="220 fields · +28"
                art="atlas"
                seed={3}
                action="add"
                appearDelay={0}
                files={[
                  { name: 'Lifecycle stage', meta: 'select · +6', art: 'tide' },
                  { name: 'Lead source', meta: 'text' },
                  { name: 'Broker notes.pdf', meta: 'PDF · 1.2 MB' },
                ]}
              />
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <TokenTag title="back-panel art — blue marble">art="atlas"</TokenTag>
                <TokenTag title="key action">action="add"</TokenTag>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Folder
                label="Pipelines"
                meta="8 pipelines · +2"
                art="tide"
                seed={7}
                action="more"
                labelPlacement="top-left"
                appearDelay={120}
                files={[
                  { name: 'Purchase', meta: '7 stages', art: 'mist' },
                  { name: 'Refinance', meta: '6 stages' },
                  { name: 'Pre-approval', meta: '4 stages', art: 'azure' },
                  { name: 'Settlement', meta: '5 stages' },
                ]}
                menu={[{ label: 'Rename' }, { label: 'Share…' }, { label: 'Archive', danger: true }]}
              />
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <TokenTag title="back-panel art — blue streak">art="tide"</TokenTag>
                <TokenTag title="key action">action="more"</TokenTag>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Folder
                label="Motion"
                meta="4 films"
                art="clouds"
                seed={11}
                action="none"
                labelPlacement="top-right"
                appearDelay={240}
                files={[
                  { name: 'Brand sting', meta: 'MP4 · 6s', art: 'wash' },
                  { name: 'Data story', meta: 'MP4 · 8s' },
                ]}
              />
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                <TokenTag title="animated cloud signature">art="clouds"</TokenTag>
                <TokenTag title="no key">action="none"</TokenTag>
              </div>
            </div>
          </div>
        </Demo>

        {/* B — the download-folder pattern */}
        <Demo
          label="A download, not a button — press to open, press again to save"
          inspect={DOWNLOAD_INSPECT}
          action={<TokenTag>{'<DownloadFolder href filename files>'}</TokenTag>}
        >
          <div className="mx-auto max-w-md">
            <DownloadFolder
              label="Full Lucide set"
              meta="2713 · 1.2 MB"
              filename="lucide-icons-full.zip"
              href="/packs/lucide-icons-full.zip"
              width={300}
              files={[
                { name: 'lucide-static', meta: '2356 SVG', art: 'wash' },
                { name: '@lucide/lab', meta: '357 SVG' },
                { name: 'README.md', meta: 'ISC' },
              ]}
            />
          </div>
        </Demo>

        {/* legend — the props at a glance */}
        <div className="flex flex-col items-center gap-3">
          <MonoLabel tone="subtle" size="sm">
            Props
          </MonoLabel>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <TokenTag title="blue marble">art="atlas"</TokenTag>
            <TokenTag title="blue marble">art="azure"</TokenTag>
            <TokenTag title="blue streak">art="tide"</TokenTag>
            <TokenTag title="blue streak">art="mist"</TokenTag>
            <TokenTag title="cloud signature">art="clouds"</TokenTag>
            <TokenTag title="token wash">art="wash"</TokenTag>
            <TokenTag title="key action">action="add"</TokenTag>
            <TokenTag title="key action">action="more"</TokenTag>
            <TokenTag title="key action">action="download"</TokenTag>
            <TokenTag title="label position">labelPlacement="top-left"</TokenTag>
          </div>
        </div>
      </div>
    </Section>
  )
}
