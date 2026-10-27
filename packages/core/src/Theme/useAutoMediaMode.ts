import type { ComputedRef, Ref } from 'vue'
import type { ResolvedColorMode } from './colorMode.js'
import type { RgbColor } from './contrast.js'
import { onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue'
import { compositeOver, parseColor, pickMediaMode } from './contrast.js'
import { useTheme } from './useTheme.js'

export type DetectedMediaMode = 'dark' | 'light' | 'off' | null

/** What the last measurement read, to skip the probe when nothing moved. */
interface MeasurementKey {
  backdrop: string
  mode: ResolvedColorMode
  tokens: unknown
}

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
    // An unset background image reads as `none` in a browser, and as `initial`
    // or an empty string where the engine reports the initial value verbatim.
    const image = style.backgroundImage
    if (image !== 'none' && image !== 'initial' && image !== '')
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
 * Measures after mount, after every update of the owning component, whenever
 * the parent's `style` or `class` changes, and whenever the theme's color mode
 * or tokens change, so a surface recolored by its own prop and a surface
 * repainted by a theme switch are both picked up without the media theme
 * re-rendering. The probe is only appended when the painted backdrop or the
 * theme moved. `null` until the surface can be read.
 */
export function useAutoMediaMode(
  element: Ref<HTMLElement | null>,
  enabled: ComputedRef<boolean>,
): Ref<DetectedMediaMode> {
  const detected = ref<DetectedMediaMode>(null)
  const { mode, tokens } = useTheme()
  let lastKey: MeasurementKey | null = null

  function measure(): void {
    if (!enabled.value || typeof getComputedStyle !== 'function')
      return
    const surface = element.value?.parentElement
    if (!surface)
      return
    const backdrop = resolveBackdrop(surface)
    if (!backdrop)
      return
    const key: MeasurementKey = {
      backdrop: `${backdrop.r},${backdrop.g},${backdrop.b}`,
      mode: mode.value,
      tokens: tokens.value,
    }
    if (
      lastKey !== null
      && key.backdrop === lastKey.backdrop
      && key.mode === lastKey.mode
      && key.tokens === lastKey.tokens
      && detected.value !== null
    ) {
      return
    }
    lastKey = key
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
    lastKey = null
    observe()
    if (isOn)
      measure()
    else
      detected.value = null
  })
  // A color mode switch repaints the ambient text and the `on-*` colors
  // through `light-dark()`, which only the DOM knows. Measure after the new
  // inline styles land, so the read sees the new mode.
  watch([mode, tokens], measure, { flush: 'post' })

  return detected
}
