/**
 * DownloadFolder — a download, drawn as a folder instead of a button.
 *
 * It sits centered and floating with space around it. Press it once and it opens: the files it holds
 * fan out, so you see what you are about to take. Press it again — the front, or the ↓ key — and the
 * real file saves. The label spells the second step out ("Press again to download"), so the two-press
 * gesture is never a guess.
 *
 * Give it the pack's `href` (a public asset) or in-memory `content`, the human `filename`, and the
 * `files` to show inside. Everything else is the shared Folder object, on brand and tokenised.
 */
import * as React from 'react'
import { Folder, type FolderFile, type FolderArt } from '@/components/brand/Folder'
import { downloadHref, downloadBlob } from '@/lib/utils'
import { cn } from '@/lib/cn'

export interface DownloadFolderProps {
  /** Folder label — what is being downloaded (e.g. "Full Lucide set"). */
  label: string
  /** Second line while closed (e.g. a size or a count). Defaults to the file count. */
  meta?: string
  /** The saved file's name. */
  filename: string
  /** A public asset URL (e.g. "/packs/thing.zip")… */
  href?: string
  /** …or generated in-memory text, with an optional mime. */
  content?: string
  mime?: string
  /** The sheets shown inside — a preview of what the download contains. */
  files?: FolderFile[]
  /** Back-panel artwork. Defaults to the blue `atlas` marble. */
  art?: FolderArt
  seed?: number
  width?: number
  appearDelay?: number
  /** Optional caption under the folder. */
  caption?: React.ReactNode
  className?: string
}

export function DownloadFolder({
  label,
  meta,
  filename,
  href,
  content,
  mime,
  files,
  art = 'atlas',
  seed = 3,
  width = 300,
  appearDelay = 0,
  caption,
  className,
}: DownloadFolderProps) {
  const [open, setOpen] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const timer = React.useRef<number | undefined>(undefined)
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const download = React.useCallback(() => {
    if (href) downloadHref(filename, href)
    else if (content != null) downloadBlob(filename, content, mime)
    setSaved(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setSaved(false), 1600)
  }, [href, content, filename, mime])

  return (
    <div className={cn('flex flex-col items-center gap-4 py-4 text-center', className)}>
      <Folder
        label={label}
        meta={meta}
        art={art}
        seed={seed}
        width={width}
        files={files}
        action="download"
        open={open}
        onOpenChange={setOpen}
        onDownload={download}
        labelPlacement="bottom-left"
        appearDelay={appearDelay}
      />
      <p className="font-mono text-mono-2xs uppercase tracking-[0.16em] text-fg-subtle" aria-live="polite">
        {saved ? 'Saved ✓' : open ? 'Press again to download' : 'Press to open · press again to download'}
      </p>
      {caption}
    </div>
  )
}

export default DownloadFolder
