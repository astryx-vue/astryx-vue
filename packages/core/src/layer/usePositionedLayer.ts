import type { Ref } from 'vue'
import type { LayerAlignment, LayerPlacement, LayerPosition } from './position.js'
import { nextTick, ref, watch } from 'vue'
import { computeLayerPosition } from './position.js'

export interface PositionedLayerOptions {
  anchor: Ref<HTMLElement | null>
  layer: Ref<HTMLElement | null>
  isOpen: Ref<boolean>
  placement: Ref<LayerPlacement>
  alignment: Ref<LayerAlignment>
  gap: number
}

/**
 * 在浮层打开时维护其位置，并在滚动与窗口尺寸变化时更新。
 */
export interface PositionedLayer {
  position: Ref<LayerPosition>
  update: () => void
  detach: () => void
}

export function usePositionedLayer(options: PositionedLayerOptions): PositionedLayer {
  const { anchor, layer, isOpen, placement, alignment, gap } = options
  const position = ref<LayerPosition>({ top: 0, left: 0, placement: placement.value })

  function update(): void {
    const anchorEl = anchor.value
    const layerEl = layer.value
    if (!anchorEl || !layerEl || !isOpen.value)
      return
    const rect = layerEl.getBoundingClientRect()
    position.value = computeLayerPosition(
      anchorEl.getBoundingClientRect(),
      { width: rect.width, height: rect.height },
      { width: window.innerWidth, height: window.innerHeight },
      placement.value,
      alignment.value,
      gap,
    )
  }

  function attach(): void {
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
  }

  function detach(): void {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
  }

  watch(isOpen, (open) => {
    if (open) {
      attach()
      nextTick(update)
    }
    else {
      detach()
    }
  })

  watch([placement, alignment], update)

  return { position, update, detach }
}
