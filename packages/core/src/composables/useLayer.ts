import type { ComputedRef, CSSProperties, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'
import type { LayerAlignment, LayerPlacement } from '../layer/position.js'
import { computed, shallowRef, toValue, useId } from 'vue'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { useDismiss } from './useDismiss.js'

export type LayerMode = 'context' | 'fixed'

export interface UseLayerOptions {
  /**
   * 定位方式。
   * - `context`：跟着触发器元素定位（锚点定位）。
   * - `fixed`：用 `x` / `y` 给出的视口坐标定位。
   */
  mode: LayerMode
  /**
   * 外部锚点元素（context 模式）。不传就用返回的 `anchorRef` 绑定触发器。
   */
  anchor?: Ref<HTMLElement | null>
  /**
   * 相对触发器的方位，context 模式有效。
   * `start` / `end` 是逻辑方位，RTL 下自动镜像。
   * @default 'below'
   */
  placement?: MaybeRefOrGetter<LayerPlacement>
  /**
   * 沿方位轴的对齐方式，context 模式有效。
   * @default 'center'
   */
  alignment?: MaybeRefOrGetter<LayerAlignment>
  /**
   * 浮层与锚点之间的空隙，单位 px。
   * @default 4
   */
  gap?: number
  /**
   * fixed 模式的横向视口坐标，单位 px。
   * @default 0
   */
  x?: MaybeRefOrGetter<number | undefined>
  /**
   * fixed 模式的纵向视口坐标，单位 px。
   * @default 0
   */
  y?: MaybeRefOrGetter<number | undefined>
  /**
   * 首次渲染就打开。
   * @default false
   */
  isDefaultOpen?: boolean
  /**
   * 点击浮层外部是否关闭。
   * @default false
   */
  lightDismiss?: MaybeRefOrGetter<boolean>
  /**
   * 是否等到第一次 `show()` 才渲染内容。关闭后内容卸载，只留下占位。
   * @default false
   */
  lazyMount?: MaybeRefOrGetter<boolean>
  /**
   * 浮层由 `show()` 打开后调用。
   * 首次渲染就打开（`isDefaultOpen`）不算一次打开动作，不会调用它。
   */
  onShow?: () => void
  /** 浮层由 `hide()` 关闭后调用。 */
  onHide?: () => void
}

export interface UseLayerReturn {
  /** 浮层当前是否打开。 */
  isOpen: ShallowRef<boolean>
  /** context 模式的锚点元素，用 `:ref` 绑到触发器上。 */
  anchorRef: Ref<HTMLElement | null>
  /** 浮层内容容器，用 `:ref` 绑到浮层根元素上。 */
  contentRef: Ref<HTMLElement | null>
  /** 浮层的内联样式：定位坐标，fixed 模式还带 `position: fixed`。 */
  contentStyle: ComputedRef<CSSProperties>
  /** 实际生效的方位（空间不够时会翻转）。 */
  resolvedPlacement: ComputedRef<LayerPlacement>
  /** 内容是否应该渲染。`lazyMount` 打开时第一次 `show()` 之前是 false。 */
  isMounted: ComputedRef<boolean>
  /** 浮层的唯一 ID，用于 `aria-controls`、`aria-describedby` 这类关系。 */
  id: string
  /** 锚点的 CSS 标识，用于高级定位场景。 */
  anchorId: string
  /** 打开浮层。 */
  show: () => void
  /** 关闭浮层。 */
  hide: () => void
}

/**
 * 对应原版 Astryx 的 `hooks/useLayer`：渲染浮层的最小内核。
 * 负责开合状态、锚点定位（或固定坐标）、点击外部关闭和延迟渲染。
 * `Popover`、`Tooltip`、`HoverCard` 都在它之上构建。
 *
 * 内容用 `Teleport` 送到 `body`，样式取自 `contentStyle`：
 *
 * ```vue
 * <button :ref="layer.anchorRef" @click="layer.show()">打开</button>
 * <Teleport to="body">
 *   <div v-if="layer.isMounted" v-show="layer.isOpen" :ref="layer.contentRef" :style="layer.contentStyle">
 *     ...
 *   </div>
 * </Teleport>
 * ```
 */
export function useLayer(options: UseLayerOptions): UseLayerReturn {
  const isFixed = options.mode === 'fixed'
  const isOpen = shallowRef(options.isDefaultOpen === true)
  const hasOpened = shallowRef(options.isDefaultOpen === true)
  const internalAnchor = shallowRef<HTMLElement | null>(null)
  const anchorRef = options.anchor ?? internalAnchor
  const contentRef = shallowRef<HTMLElement | null>(null)
  const uid = useId()
  const id = `astryx-layer-${uid}`
  const anchorId = `astryx-layer-anchor-${uid}`

  const placement = computed(() => toValue(options.placement) ?? 'below')
  const alignment = computed(() => toValue(options.alignment) ?? 'center')

  // fixed 模式不跟随锚点，锚点定位器就不需要了。
  const positioned = isFixed
    ? null
    : usePositionedLayer({
        anchor: anchorRef,
        layer: contentRef,
        isOpen,
        placement,
        alignment,
        gap: options.gap ?? 4,
      })

  const resolvedPlacement = computed(() => positioned?.position.value.placement ?? placement.value)

  const contentStyle = computed<CSSProperties>(() => {
    if (isFixed) {
      return {
        position: 'fixed',
        top: `${toValue(options.y) ?? 0}px`,
        left: `${toValue(options.x) ?? 0}px`,
      }
    }
    const { top, left } = positioned?.position.value ?? { top: 0, left: 0 }
    return { top: `${top}px`, left: `${left}px` }
  })

  const isMounted = computed(() => !toValue(options.lazyMount) || hasOpened.value)

  // 正在关闭的过程中又要打开（典型场景：关闭时把焦点还给触发器，触发器上的 Tooltip
  // 立刻要显示）。等到这一次关闭走完再打开，否则会读到一半新一半旧的状态。
  let isHiding = false
  let pendingShow = false

  function runShow(): void {
    if (isOpen.value)
      return
    hasOpened.value = true
    isOpen.value = true
    options.onShow?.()
  }

  function show(): void {
    if (isHiding) {
      pendingShow = true
      queueMicrotask(() => {
        if (!pendingShow)
          return
        pendingShow = false
        runShow()
      })
      return
    }
    runShow()
  }

  function hide(): void {
    // 这一次关闭把之前排队的打开一并作废。
    pendingShow = false
    if (!isOpen.value)
      return
    isHiding = true
    try {
      isOpen.value = false
      options.onHide?.()
    }
    finally {
      isHiding = false
    }
  }

  useDismiss({
    container: contentRef,
    trigger: anchorRef,
    isEnabled: computed(() => isOpen.value && toValue(options.lightDismiss) === true),
    onDismiss: hide,
  })

  return {
    isOpen,
    anchorRef,
    contentRef,
    contentStyle,
    resolvedPlacement,
    isMounted,
    id,
    anchorId,
    show,
    hide,
  }
}
