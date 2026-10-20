import type { ComputedRef, Ref } from 'vue'
import type { RgbColor } from './contrast.js'
import { onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue'
import { compositeOver, parseColor, pickMediaMode } from './contrast.js'

export type DetectedMediaMode = 'dark' | 'light' | 'off' | null

/**
 * The opaque color behind `start`: every translucent layer up the tree,
 * composited over the first opaque one. `null` when a background image is in
 * the way, since its pixels are not readable from CSS, or when nothing
 * opaque is found.
 */
function resolveBackdrop(start: HTMLElement): RgbColor | null {
  const layers: RgbColor[] = []
  for (let node: HTMLElement | null = start; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (style.backgroundImage !== 'none')
      return null
    const color = parseColor(style.backgroundColor)
    if (color && color.a > 0) {
      layers.push(color)
      if (color.a >= 1)
        break
    }
  }
  const base = layers.pop()
  if (!base || base.a < 1)
    return null
  return layers.reduceRight((backdrop, layer) => compositeOver(layer, backdrop), base)
}

/**
 * Read what each token paints by assigning it to a hidden probe's `color`.
 * A custom property read directly returns its written text, such as
 * `light-dark(a, b)`; the probe returns the color the browser resolved.
 */
function paintedColors(host: HTMLElement, tokens: readonly string[]): (RgbColor | null)[] {
  const probe = document.createElement('span')
  probe.style.display = 'none'
  host.appendChild(probe)
  try {
    return tokens.map((token) => {
      probe.style.color = `var(${token})`
      return parseColor(getComputedStyle(probe).color)
    })
  }
  finally {
    probe.remove()
  }
}

/**
 * Measure the element that actually paints behind a `display: contents`
 * media theme, its parent, and pick a surface for it.
 *
 * Measures after mount, after every update of the owning component, and
 * whenever the parent's `style` or `class` changes, so a surface recolored
 * by its own prop is picked up without the media theme re-rendering. The
 * probe is only appended when the painted backdrop changed. `null` until the
 * surface can be read.
 */
export function useAutoMediaMode(
  element: Ref<HTMLElement | null>,
  enabled: ComputedRef<boolean>,
): Ref<DetectedMediaMode> {
  const detected = ref<DetectedMediaMode>(null)
  let lastBackdrop: string | null = null

  function measure(): void {
    if (!enabled.value || typeof getComputedStyle !== 'function')
      return
    const surface = element.value?.parentElement
    if (!surface)
      return
    const backdrop = resolveBackdrop(surface)
    if (!backdrop)
      return
    const key = `${backdrop.r},${backdrop.g},${backdrop.b}`
    if (key === lastBackdrop && detected.value !== null)
      return
    lastBackdrop = key
    const [ambient, onDark, onLight] = paintedColors(surface, [
      '--astryx-color-text-primary',
      '--astryx-color-on-dark',
      '--astryx-color-on-light',
    ])
    const next = pickMediaMode(backdrop, ambient ?? null, onDark ?? null, onLight ?? null)
    if (next !== null)
      detected.value = next
  }

  let observer: MutationObserver | null = null

  function observe(): void {
    observer?.disconnect()
    observer = null
    const surface = element.value?.parentElement
    if (!enabled.value || !surface || typeof MutationObserver === 'undefined')
      return
    observer = new MutationObserver(measure)
    observer.observe(surface, { attributes: true, attributeFilter: ['style', 'class'] })
  }

  onMounted(() => {
    measure()
    observe()
  })
  onUpdated(measure)
  onBeforeUnmount(() => observer?.disconnect())
  watch(enabled, (isOn) => {
    lastBackdrop = null
    observe()
    if (isOn)
      measure()
    else
      detected.value = null
  })

  return detected
}
