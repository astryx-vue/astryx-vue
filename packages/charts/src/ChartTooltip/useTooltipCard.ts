import type { Ref } from 'vue'
import type { TooltipSeriesValue } from '../tooltip.js'
import type { ChartPointerEvent } from '../types.js'
import type { ChartTooltipPlacement } from './types.js'
import { useLayer } from '@astryx-vue/core'
import { computed, nextTick, onScopeDispose, ref, watch, watchEffect } from 'vue'
import { useChart } from '../context.js'
import { deriveTooltipSeriesValues } from '../tooltip.js'
import { computeCardPosition } from './position.js'

/** 卡片内容渲染完以后还要再等一帧，`v-show` 才把元素显示出来、量得到尺寸。 */
const MEASURE_TICKS = 2

export interface TooltipCard {
  /** 卡片元素，绑到卡片根节点上 */
  cardRef: Ref<HTMLElement | null>
  /** 卡片的内联样式（固定定位的 top / left） */
  cardStyle: Readonly<Ref<Record<string, string>>>
  /** 卡片现在该不该显示 */
  isVisible: Readonly<Ref<boolean>>
  /** 卡片挂到哪个 HTML 元素上；服务端渲染时是 null，卡片不渲染 */
  portalTarget: Readonly<Ref<HTMLElement | null>>
  /** 悬停的行下标，没悬停时是 null */
  hoveredIndex: Readonly<Ref<number | null>>
  /** 悬停的 x 原始值 */
  xValue: Readonly<Ref<unknown>>
  /** 悬停的这一行在数据里存在（有内容可显示） */
  hasDatum: Readonly<Ref<boolean>>
  /** 每个系列在悬停位置的一行数据 */
  seriesValues: Readonly<Ref<TooltipSeriesValue[]>>
}

/**
 * 提示卡片的状态机：订阅图表的指针事件、算出该显示哪一行、量出卡片尺寸再定位置。
 *
 * 只在下标的「行」变化时才更新状态，同一行里挪动鼠标不会引起重排。
 * 卡片内容为空（自定义内容故意不返回东西）时按隐藏处理，但高亮和圆点照画。
 */
export function useTooltipCard(options: {
  series: () => readonly import('../types.js').SeriesDef[]
  placement: () => ChartTooltipPlacement
  hasCustomContent: () => boolean
}): TooltipCard {
  const chart = useChart()

  const hoveredIndex = ref<number | null>(null)
  const cardHidden = ref(true)
  const cardPosition = ref({ x: 0, y: 0 })
  const cardRef = ref<HTMLElement | null>(null)
  let lastEvent: ChartPointerEvent | null = null

  // `fixed` 模式只出内联坐标，不跟随锚点：卡片的位置由指针算。
  const layer = useLayer({
    mode: 'fixed',
    x: () => cardPosition.value.x,
    y: () => cardPosition.value.y,
  })

  /** 卡片挂到图表所在的 HTML 容器里，这样外层主题（含深浅色）对它同样生效。 */
  const portalTarget = ref<HTMLElement | null>(null)
  watchEffect(() => {
    portalTarget.value = chart.svgRef.value?.parentElement ?? null
  })

  const datum = computed(() => (hoveredIndex.value == null ? undefined : chart.data[hoveredIndex.value]))
  const xValue = computed(() => datum.value?.[chart.xKey])
  const resolvedKeys = computed(() => new Set(chart.resolved.keys()))
  const seriesValues = computed(() => deriveTooltipSeriesValues(
    options.series(),
    datum.value,
    resolvedKeys.value,
  ))

  /** 自定义内容渲染出来是空的，就等于上游 `render()` 返回 `null`：不显示卡片。 */
  function hasRenderedContent(element: HTMLElement): boolean {
    if ((element.textContent ?? '').trim() !== '')
      return true
    return element.children.length > 0
  }

  function resolveHidden(): void {
    if (hoveredIndex.value == null || datum.value == null) {
      cardHidden.value = true
      return
    }
    if (!options.hasCustomContent()) {
      cardHidden.value = false
      return
    }
    const card = cardRef.value
    cardHidden.value = card == null || !hasRenderedContent(card)
  }

  function place(event: ChartPointerEvent): void {
    const card = cardRef.value
    const svg = chart.svgRef.value
    if (!card || !svg || !event.nearest)
      return
    const svgRect = svg.getBoundingClientRect()
    cardPosition.value = computeCardPosition({
      anchorLeft: svgRect.left + chart.margin.left + event.nearest.px,
      anchorTop: svgRect.top + chart.margin.top,
      width: card.offsetWidth,
      height: card.offsetHeight,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    }, options.placement())
  }

  /** 等内容和显隐都落到 DOM 上，再量尺寸定位置，否则量到的是上一帧的卡片。 */
  async function sync(): Promise<void> {
    for (let i = 0; i < MEASURE_TICKS; i++)
      await nextTick()
    resolveHidden()
    if (cardHidden.value || !lastEvent || !portalTarget.value) {
      layer.hide()
      return
    }
    layer.show()
    await nextTick()
    place(lastEvent)
  }

  let pending = false
  async function scheduleSync(): Promise<void> {
    // 一次指针事件里可能同时改了下标和内容，合并成一次同步。
    if (pending)
      return
    pending = true
    try {
      await sync()
    }
    finally {
      pending = false
    }
  }

  const unsubscribe = chart.onPointer((event) => {
    lastEvent = event
    const index = event.nearest?.dataIndex ?? null
    if (index !== hoveredIndex.value) {
      hoveredIndex.value = index
      // 先按「没有这一行」处理，免得量到上一行的内容。
      if (index == null)
        cardHidden.value = true
    }
    void scheduleSync()
  })
  onScopeDispose(unsubscribe)

  // 内容变了（换了一行、数据更新、自定义内容变化）也要重新判断显示和位置。
  watch([hoveredIndex, seriesValues, portalTarget], () => {
    void scheduleSync()
  })

  const isVisible = computed(() => !cardHidden.value && layer.isOpen.value)
  const cardStyle = computed(() => layer.contentStyle.value as Record<string, string>)

  return {
    cardRef,
    cardStyle,
    isVisible,
    portalTarget,
    hoveredIndex,
    xValue,
    hasDatum: computed(() => datum.value != null),
    seriesValues,
  }
}
