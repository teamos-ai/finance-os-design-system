/**
 * CopyButton — ghost, swaps its own label for 1.2s and announces the swap to a screen reader.
 * Shared by the email sections, where every artefact is meant to be pasted somewhere else.
 */
import * as React from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** How long the "Copied" label and its live announcement hold. Not a motion duration. */
const COPIED_RESET_MS = 1200

export const CopyButton = ({ value, children }: { value: string; children: React.ReactNode }) => {
  const [copied, setCopied] = React.useState(false)
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        leadingIcon={<Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            setTimeout(() => setCopied(false), COPIED_RESET_MS)
          } catch {
            /* clipboard blocked: the panel below is selectable, so there is still a way through */
          }
        }}
      >
        {copied ? 'Copied' : children}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </>
  )
}
