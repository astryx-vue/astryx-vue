import type { ComputedRef, Ref } from 'vue'
import type { LayerAlignment, LayerPlacement, LayerPosition } from './position.js'
import { nextTick, ref, watch } from 'vue'
import { useLayerTeleportTarget } from '../composables/useLayerMountTarget.js'
import { useLayerGutter } from '../LayerProvider/context.js'
import { computeLayerPosition } from './position.js'

const GEOMETRY_POLL_INTERVAL = 100

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
  /**
   * 这一层该挂到哪里的 `Teleport` 目标。Dialog 打开时是它内部的挂载点，
   * 没有就是 `'body'`。
   */
  teleportTarget: ComputedRef<string | HTMLElement>
  update: () => void
  detach: () => void
}

export function usePositionedLayer(options: PositionedLayerOptions): PositionedLayer {
  const { anchor, layer, isOpen, placement, alignment, gap } = options
  const position = ref<LayerPosition>({ top: 0, left: 0, placement: placement.value })
  // 视口边距由最近一个 LayerProvider 决定，没有 provider 时是基础空隙加设备安全区。
  const gutter = useLayerGutter()
  // 浮层实际挂到哪里：Dialog 打开时挂进对话框里面，否则挂到 body。
  const teleportTarget = useLayerTeleportTarget()

  function update(): void {
    const anchorEl = anchor.value
    const layerEl = layer.value
    if (!anchorEl || !layerEl || !isOpen.value)
      return
    position.value = computeLayerPosition(
      anchorEl.getBoundingClientRect(),
      { width: layerEl.offsetWidth, height: layerEl.offsetHeight },
      { width: window.innerWidth, height: window.innerHeight },
      placement.value,
      alignment.value,
      gap,
      gutter.value,
    )
  }

  let pollId: ReturnType<typeof setInterval> | undefined

  // 布局偏移（例如上方内容异步加载）不会触发 scroll 或 resize，因此在浮层打开期间
  // 轮询锚点与浮层的几何信息，任一发生变化即重新计算位置。
  function geometryKey(): string {
    const a = anchor.value?.getBoundingClientRect()
    const l = layer.value
    return [a?.top, a?.left, a?.width, a?.height, l?.offsetWidth, l?.offsetHeight].join(',')
  }

  function watchGeometry(): void {
    let lastKey = ''
    pollId = setInterval(() => {
      const key = geometryKey()
      if (key !== lastKey) {
        lastKey = key
        update()
      }
    }, GEOMETRY_POLL_INTERVAL)
  }

  function attach(): void {
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    watchGeometry()
  }

  function detach(): void {
    window.removeEventListener('scroll', update, true)
    window.removeEventListener('resize', update)
    clearInterval(pollId)
    pollId = undefined
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
  watch(gutter, update)

  return { position, teleportTarget, update, detach }
}
