/**
 * ScaleToFit — render a fixed design canvas and scale the whole thing to the container width.
 * Lets a dense, pixel-placed mock (the brand "My Account" dashboard) stay faithful at any size
 * while the parent controls the aspect. The container's height follows the scaled canvas, so a
 * 16:9 canvas yields a 16:9 block at every width. Reduced-motion safe (no animation here).
 */
import * as React from 'react'

export function ScaleToFit({
  width,
  height,
  children,
  className,
}: {
  width: number
  height: number
  children: React.ReactNode
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = React.useState(0)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => setScale(el.clientWidth / width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div ref={ref} className={className} style={{ height: scale ? height * scale : undefined, overflow: 'hidden' }}>
      <div style={{ width, height, transform: `scale(${scale || 0.0001})`, transformOrigin: 'top left' }} aria-hidden>
        {children}
      </div>
    </div>
  )
}
