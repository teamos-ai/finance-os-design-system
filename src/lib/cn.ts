import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/* Custom text-{size} tokens (text-display-lg, text-body-md, …) must be
   registered in tailwind-merge's font-size group. Without this, tailwind-merge
   misreads them as text-COLOUR classes and silently drops real colour classes
   like text-fg when both appear in one cn() call. */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm',
            'title-lg', 'title-md', 'title-sm',
            'body-lg', 'body-md', 'body-sm',
            'label', 'caption', 'mono-xs', 'mono-2xs',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
