import type { CSSProperties, Ref } from 'vue'
import type { LayerPosition } from '../layer/position.js'
import { computed, onMounted, ref, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'

export interface AnchoredListbox {
  position: Ref<LayerPosition>
  style: Ref<CSSProperties>
}

/**
 * 把列表钉在锚点下方，点外面关闭。Escape 交给组件自己处理，这样编辑中的选择可以还原。
 */
export function useAnchoredListbox(options: {
  anchor: Ref<HTMLElement | null>
  layer: Ref<HTMLElement | null>
  isOpen: Ref<boolean>
  onDismiss: () => void
}): AnchoredListbox {
  const placement = computed(() => 'below' as const)
  const alignment = computed(() => 'start' as const)
  const { position } = usePositionedLayer({
    anchor: options.anchor,
    layer: options.layer,
    isOpen: options.isOpen,
    placement,
    alignment,
    gap: 4,
  })

  useDismiss({
    container: options.layer,
    trigger: options.anchor,
    isEnabled: options.isOpen,
    enableEscape: ref(false),
    onDismiss: options.onDismiss,
  })

  const anchorWidth = ref(0)

  function syncWidth(): void {
    anchorWidth.value = options.anchor.value?.getBoundingClientRect().width ?? 0
  }

  watch(options.isOpen, (open) => {
    if (open)
      syncWidth()
  }, { flush: 'pre' })

  onMounted(syncWidth)

  const style = computed<CSSProperties>(() => ({
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
    minWidth: anchorWidth.value > 0 ? `${anchorWidth.value}px` : undefined,
  }))

  return { position, style }
}

/** 只滚动列表自己，避免把页面带到还没定位好的浮层上。 */
export function scrollOptionIntoView(layer: HTMLElement | null, id: string | undefined): void {
  if (!layer || !id)
    return
  const option = layer.querySelector<HTMLElement>(`[data-option-id="${CSS.escape(id)}"]`)
  if (!option)
    return
  const layerRect = layer.getBoundingClientRect()
  const optionRect = option.getBoundingClientRect()
  if (optionRect.top < layerRect.top)
    layer.scrollTop -= layerRect.top - optionRect.top
  else if (optionRect.bottom > layerRect.bottom)
    layer.scrollTop += optionRect.bottom - layerRect.bottom
}
