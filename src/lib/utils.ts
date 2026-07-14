// Canonical helper barrel. cn() lives in ./cn (with the tailwind-merge font-size fix).
// Re-exported here so both `@/lib/cn` and `@/lib/utils` resolve.
export { cn } from './cn'

/** Clamp a number into [min, max]. */
export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/** Copy text to the clipboard, resolving to true/false. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/** Download in-memory text as a file (icons → .svg, colours → .css, components → .tsx …). */
export function downloadBlob(filename: string, content: string, mime = 'text/plain'): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

/** Download a static/public asset (fonts, logos, PDFs) by URL. */
export function downloadHref(filename: string, href: string): void {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  a.click()
}
