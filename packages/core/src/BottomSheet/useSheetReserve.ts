import type { ComputedRef, Ref } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { MIN_RESERVE, sheetReserve } from './sheetDragMath.js'

const BLOCK_SIZE_PROPERTIES = ['height', 'min-height', 'max-height', 'block-size', 'min-block-size', 'max-block-size'] as const

function camelCase(property: string): string {
  return property.replace(/-([a-z])/g, (_match, letter: string) => letter.toUpperCase())
}

/** Whether an inline `style` binding sets any block size. */
function styleSetsBlockSize(style: unknown): boolean {
  if (Array.isArray(style))
    return style.some(styleSetsBlockSize)
  if (typeof style === 'string')
    return BLOCK_SIZE_PROPERTIES.some(property => new RegExp(`(^|;)\\s*${property}\\s*:`, 'i').test(style))
  if (style == null || typeof style !== 'object')
    return false
  const record = style as Record<string, unknown>
  return BLOCK_SIZE_PROPERTIES.some(property => record[property] != null || record[camelCase(property)] != null)
}

/**
 * Whether the caller sizes the sheet through its fallthrough attributes: an
 * inline block size, or any class, whose rules can size it too. Nothing
 * extends such a sheet by the reserve.
 */
export function isSizedByCaller(attrs: Record<string, unknown>): boolean {
  const className = attrs.class
  const hasClass = Array.isArray(className)
    ? className.length > 0
    : className != null && className !== '' && !(typeof className === 'object' && Object.keys(className).length === 0)
  return hasClass || styleSetsBlockSize(attrs.style)
}

/**
 * How far the sheet's surface reaches below the screen. Only a finger
 * stretches the sheet past MIN_RESERVE, so a device with a touch pointer keeps
 * 40% of the layout viewport while the sheet is presented, enough that a pull
 * past the top never shows the page under it. A device without one, and a
 * sheet the caller sizes, keep MIN_RESERVE.
 */
export function useSheetReserve(isPresented: Ref<boolean>, isSized: () => boolean): ComputedRef<number> {
  const hasTouchPointer = useMediaQuery('(any-pointer: coarse)')
  const viewportHeight = shallowRef(0)
  const tracksViewport = computed(() => isPresented.value && hasTouchPointer.value && !isSized())

  watch(tracksViewport, (tracks, _previous, onCleanup) => {
    if (!tracks || typeof window === 'undefined') {
      viewportHeight.value = 0
      return
    }
    // `dvh` budgets ignore the virtual keyboard, so the layout viewport is the measure.
    const read = (): void => {
      viewportHeight.value = window.innerHeight
    }
    read()
    window.addEventListener('resize', read)
    onCleanup(() => window.removeEventListener('resize', read))
  }, { immediate: true })

  return computed(() => (viewportHeight.value > 0 ? sheetReserve(viewportHeight.value) : MIN_RESERVE))
}
