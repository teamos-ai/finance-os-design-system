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
