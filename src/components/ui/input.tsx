/**
 * Input — flat hairline field. 8px radius, 1px line, gold focus ring (no glow).
 * Optional label, hint, error and a leading Lucide icon. Anonymous Pro throughout.
 */
import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: LucideIcon
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, icon: Icon, id, ...props }, ref) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`
    const describedBy = error ? errorId : hint ? hintId : undefined
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-body text-caption text-fg-muted">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <Icon
              className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-fg-subtle"
              strokeWidth={1.5}
              aria-hidden
            />
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-md border bg-surface font-body text-body-md text-fg',
              'placeholder:text-fg-subtle transition-colors duration-fast ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-border-strong',
              'disabled:opacity-50 disabled:pointer-events-none',
              Icon ? 'pl-11 pr-4' : 'px-4',
              'py-2.5',
              error ? 'border-danger' : 'border-border',
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...props}
          />
        </div>
        {error ? (
          <p id={errorId} aria-live="polite" className="font-body text-caption text-danger">
            {error}
          </p>
        ) : (
          hint && <p id={hintId} className="font-body text-caption text-fg-muted">{hint}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'
