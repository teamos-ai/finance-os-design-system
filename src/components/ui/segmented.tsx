/**
 * SegmentedControl — Finance OS.
 *
 * Daily | Weekly | Monthly. The active segment is the filled inverse (dark-luxury) pill;
 * the rest are muted foreground on a soft inset with a hairline frame. Controlled or
 * uncontrolled.
 *
 * A11y: role="tablist" with roving tabindex and ArrowLeft/Right (and Up/Down) keyboard
 * support, aria-selected on each tab. 8px squircle, gold focus ring, quiet token motion.
 */
import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  /** Controlled value. Omit to run uncontrolled (with `defaultValue`). */
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  'aria-label'?: string;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  defaultValue,
  onValueChange,
  size = 'md',
  className,
  'aria-label': ariaLabel,
}: SegmentedControlProps<T>) {
  const [internal, setInternal] = React.useState<T>(defaultValue ?? options[0]?.value);
  const active = value ?? internal;
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: T) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  /** Move selection AND focus to a tab — roving tabindex requires focus to follow the key. */
  const move = (next: number) => {
    const opt = options[next];
    if (!opt) return;
    select(opt.value);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = options.findIndex((o) => o.value === active);
    if (i < 0) return;
    const len = options.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move((i + 1) % len);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move((i - 1 + len) % len);
    } else if (e.key === 'Home') {
      e.preventDefault();
      move(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      move(len - 1);
    }
  };

  const pad = size === 'sm' ? 'px-3 py-1.5 text-body-sm' : 'px-4 py-2 text-body-sm';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex items-center gap-1 rounded-md border border-border bg-elevated p-1',
        className
      )}
    >
      {options.map((opt, idx) => {
        const isActive = opt.value === active;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => select(opt.value)}
            className={cn(
              'rounded-sm font-display font-medium transition-all duration-fast ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              pad,
              isActive
                ? 'bg-inverse text-inverse-fg shadow-sm'
                : 'text-fg-subtle hover:text-fg'
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
