import type { ComputedRef, Ref } from 'vue'
import type { LightboxMedia, LightboxTriggerProps, UseLightboxOptions } from './types.js'
import { computed, ref } from 'vue'

interface LightboxBindings {
  'hasAutoPlay': boolean | undefined
  'hasZoom': boolean | undefined
  'index': number
  'isOpen': boolean
  'media': LightboxMedia | readonly LightboxMedia[]
  'onUpdate:index': (next: number) => void
  'onUpdate:isOpen': (next: boolean) => void
}

/**
 * Owns the open state and gallery index for a `Lightbox`.
 * Bind `bindings` onto `Lightbox`, and call `open(index)` from a thumbnail.
 */
export function useLightbox(options: UseLightboxOptions): {
  bindings: ComputedRef<LightboxBindings>
  close: () => void
  getTriggerProps: (next: number) => LightboxTriggerProps
  index: Ref<number>
  isOpen: Ref<boolean>
  open: (next?: number) => void
  triggerProps: ComputedRef<LightboxTriggerProps>
} {
  const isOpen = ref(false)
  const index = ref(0)

  function open(next = 0): void {
    index.value = next
    isOpen.value = true
  }

  function close(): void {
    isOpen.value = false
  }

  function triggerPropsFor(next: number): LightboxTriggerProps {
    return {
      'aria-haspopup': 'dialog',
      'onClick': () => open(next),
      'onKeydown': (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ')
          return
        event.preventDefault()
        open(next)
      },
      'role': 'button',
      'tabindex': 0,
    }
  }

  const bindings = computed<LightboxBindings>(() => ({
    'hasAutoPlay': options.hasAutoPlay,
    'hasZoom': options.hasZoom,
    'index': index.value,
    'isOpen': isOpen.value,
    'media': options.media,
    'onUpdate:index': (next: number) => {
      index.value = next
    },
    'onUpdate:isOpen': (next: boolean) => {
      isOpen.value = next
    },
  }))

  return {
    bindings,
    close,
    getTriggerProps: triggerPropsFor,
    index,
    isOpen,
    open,
    triggerProps: computed(() => triggerPropsFor(0)),
  }
}
