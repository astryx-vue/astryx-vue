import type { ComputedRef, Ref } from 'vue'
import type { LayerAlignment, LayerPlacement, LayerPosition } from './position.js'
import { nextTick, onScopeDispose, ref, watch } from 'vue'
import { useLayerTeleportTarget } from '../composables/useLayerMountTarget.js'
import { useLayerGutter } from '../LayerProvider/context.js'
import { keepClearOfAnchor } from './anchorClear.js'
import { layerEntranceSide, writeLayerEntranceSide } from './layerEntranceSide.js'
import { computeLayerPosition } from './position.js'
import { getLayerViewport } from './visibleViewport.js'

const GEOMETRY_POLL_INTERVAL = 100

export interface PositionedLayerOptions {
  anchor: Ref<HTMLElement | null>
  layer: Ref<HTMLElement | null>
  isOpen: Ref<boolean>
  placement: Ref<LayerPlacement>
  alignment: Ref<LayerAlignment>
  gap: number
  /** 浮层比四周空地都高时也不盖住锚点：改放到锚点旁边，或限高后在浮层里滚动。 */
  keepAnchorClear?: boolean
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
    // 卸载后若还有一次轮询赶在定时器清掉之前进来，测试环境可能已经拆掉 window。
    if (typeof window === 'undefined')
      return
    const anchorEl = anchor.value
    const layerEl = layer.value
    if (!anchorEl || !layerEl || !isOpen.value)
      return
    const anchorRect = anchorEl.getBoundingClientRect()
    const viewport = getLayerViewport()
    // 限高之后 offsetHeight 只剩被限的那一截，scrollHeight 才是内容本来的高度。
    const box = {
      width: layerEl.offsetWidth,
      height: options.keepAnchorClear === true ? Math.max(layerEl.offsetHeight, layerEl.scrollHeight) : layerEl.offsetHeight,
    }
    const placed = computeLayerPosition(anchorRect, box, viewport, placement.value, alignment.value, gap, gutter.value)
    const next = options.keepAnchorClear === true
      ? keepClearOfAnchor(placed, anchorRect, box, viewport, gap, gutter.value)
      : placed
    position.value = next
    // 进场从摆好之后（翻面也算）落在的那一侧滑进来，在第一帧之前写好。
    const height = next.maxHeight == null ? box.height : Math.min(box.height, next.maxHeight)
    writeLayerEntranceSide(layerEl, layerEntranceSide({ left: next.left, top: next.top, width: box.width, height }, anchorRect))
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
    window.visualViewport?.addEventListener('resize', update)
    watchGeometry()
  }

  function detach(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
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
  }, { immediate: true })

  // 外部锚点和内容元素都可能在挂载后才写入；变化时要重新定位。
  watch([anchor, layer], update)
  watch([placement, alignment], update)
  watch(gutter, update)

  // 只在 isOpen 变成 false 时拆监听的话，调用方不调 detach、组件直接卸载，轮询还会继续。
  onScopeDispose(detach)

  return { position, teleportTarget, update, detach }
}
