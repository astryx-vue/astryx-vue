<script setup lang="ts">
/**
 * @file PageControl.vue
 * @input core 的文案和粗指针检测、触屏热区；PageControl 的实测表、数学（pageControlModel.ts）、
 *   输入层（usePageControlInput.ts）和动效层（usePageControlMotion.ts）
 * @output PageControl：一排页码指示点，点按翻一页，手指拖过去换页，像 UIPageControl
 * @position lab 组件：手机上分页视图下面「我在第几页」的指示，对应 UIPageControl
 *
 * 画的是 UIPageControl 实测的几何：9.67px 的点间隔 8px，两端各 14px 内边距，高 25.67px。
 * 最多显示十个槽位；页数更多时这排是一个窗口，哪一侧还有页，那一侧最后两个槽位缩小。
 * 当前页落进缩小的槽位时窗口才按 UIKit 的弹簧挪。细指针下显示整排、被控件裁掉，不透明度立刻变。
 */
import type { CSSProperties } from 'vue'
import type { PageControlEmits, PageControlProps } from './types'
import { paginationMessages, useCoarsePointer, useComponentMessages } from '@astryx-vue/core'
import { isRtlElement, useTouchHitArea } from '@astryx-vue/core/internal/touch'
import { computed, shallowRef, useTemplateRef } from 'vue'
import {
  BOX,
  clampPage,
  croppedRowOffset,
  indicatorSize,
  pageControlLayout,
  PITCH,
  renderedPages,
  SWITCH,
  windowFor,
} from './pageControlModel'
import { createPageRequests } from './pageControlRequest'
import { pageControl as PC } from './pageControlTable'
import { usePageControlInput } from './usePageControlInput'
import { DOT_SCALE, usePageControlMotion } from './usePageControlMotion'

defineOptions({ name: 'AstryxPageControl', inheritAttrs: false })

const props = withDefaults(defineProps<PageControlProps>(), {
  label: undefined,
  hidesForSinglePage: false,
})
const emit = defineEmits<PageControlEmits>()
const messages = useComponentMessages({ pagination: paginationMessages })

// UIKit 把其余的点画成 45%。这个透明度下 core 的主文字色在页面背景上只有 2.97:1，不够 WCAG 1.4.11
// 给唯一页数线索要的 3:1；48% 是 3.25:1。
const INACTIVE_ALPHA = Math.max(PC.otherIndicatorAlpha, 0.48)

const root = useTemplateRef<HTMLDivElement>('root')
const strip = useTemplateRef<HTMLSpanElement>('strip')
const isScrubbing = shallowRef(false)
// 按住的垫片、缩小的窗口和淡出是触屏呈现，任何触屏设备的手指下都有。鼠标下显示被裁的整排，
// 照样接点按和拖动。
const isTouch = useCoarsePointer()

/** 页数：不是有限数时为 0。 */
const pages = computed(() => Number.isFinite(props.totalPages) ? Math.max(0, Math.floor(props.totalPages)) : 0)
const isShown = computed(() => pages.value > 0 && !(props.hidesForSinglePage && pages.value === 1))
// 对外从 1 数，对内从 0 数。
const current = computed(() => pages.value === 0 || !Number.isFinite(props.page) ? 0 : clampPage(props.page - 1, pages.value))
const layout = computed(() => pageControlLayout(pages.value))

// 当前页落进缩小的槽位时窗口才挪，所以它取决于原来在哪：记住上一次的值。
let lastWindowStart = windowFor(pages.value, 0, current.value)
const windowStart = computed(() => {
  if (isTouch.value)
    lastWindowStart = windowFor(pages.value, lastWindowStart, current.value)
  return lastWindowStart
})

const view = (): Window => root.value?.ownerDocument.defaultView ?? window
const requests = createPageRequests(() => current.value, (page) => {
  emit('update:page', page)
  emit('change', page)
}, view)

const motion = usePageControlMotion({ isTouch, root, strip, pages, current, windowStart, isScrubbing, requests })
usePageControlInput({
  isTouch,
  root,
  strip,
  pages,
  current,
  windowStart,
  requests,
  isScrubbing,
  showHeld: motion.showHeld,
  hideHeld: motion.hideHeld,
})

// 手指要 44px 的目标：触屏热区把控件往那里撑，邻居让多少撑多少。拖动时暂停，手指移动时不读布局。
useTouchHitArea(root, () => !isScrubbing.value)

const KEY_STEPS: Record<string, (page: number, isRtl: boolean) => number> = {
  ArrowRight: (page, isRtl) => page + (isRtl ? -1 : 1),
  ArrowLeft: (page, isRtl) => page + (isRtl ? 1 : -1),
  ArrowUp: page => page + 1,
  ArrowDown: page => page - 1,
  Home: () => 0,
  End: () => pages.value - 1,
}

// 调用方的 onKeydown 先跑（$attrs 绑在前面），它 preventDefault 就不翻页。
function onKeydown(event: KeyboardEvent): void {
  const next = KEY_STEPS[event.key]
  if (next == null || event.defaultPrevented)
    return
  event.preventDefault()
  const isRtl = isRtlElement(event.currentTarget as HTMLElement)
  requests.request(clampPage(next(current.value, isRtl), pages.value), 'other')
}

const isWindow = computed(() => isTouch.value && layout.value.isWindowed)
const renderedRange = computed(() => {
  const [first, last] = isWindow.value ? renderedPages(pages.value, windowStart.value) : [0, pages.value]
  return Array.from({ length: last - first }, (_, i) => first + i)
})
const switchTransition = computed(() => (isTouch.value ? SWITCH : 'none'))

const rootStyle = computed<CSSProperties>(() => ({
  'width': `${layout.value.width}px`,
  'height': `${PC.height}px`,
  '--_page-control-platter-transition': motion.platterTransition.value ?? switchTransition.value,
}))

// 被裁的整排从内边距里面开始。服务端渲染时静止的窗口也写在标记里，动效引擎接手前就能看到当前点；
// 之后引擎的内联值优先。
const stripStyle = computed<CSSProperties>(() => {
  const count = pages.value
  const fullRow = count * PITCH - PC.indicatorSpacing
  const width = layout.value.width
  const start = isTouch.value
    ? (width - layout.value.rowWidth) / 2
    : (width - Math.min(fullRow, width - 2 * PC.horizontalPadding)) / 2
  const rest = isTouch.value ? windowStart.value * PITCH : croppedRowOffset(count, current.value)
  return { 'insetInlineStart': `${start}px`, '--_page-control-rest': `${rest}px` }
})

const dotTop = (PC.height - BOX) / 2
function dotStyle(page: number): CSSProperties {
  const otherAlpha = motion.isInteracting.value ? PC.interactingOtherIndicatorAlpha : INACTIVE_ALPHA
  const scale = isTouch.value ? indicatorSize(pages.value, windowStart.value, page) / BOX : DOT_SCALE
  return {
    // 盒子比画出来的点每边多出半像素。
    'insetInlineStart': `${page * PITCH - (BOX - PC.indicatorSize) / 2}px`,
    'top': `${dotTop}px`,
    'width': `${BOX}px`,
    'height': `${BOX}px`,
    '--_page-control-scale': String(scale),
    'opacity': page === current.value ? PC.currentIndicatorAlpha : otherAlpha,
    'transition': motion.dotTransition.value ?? switchTransition.value,
  }
}
</script>

<template>
  <div
    v-if="isShown"
    v-bind="$attrs"
    ref="root"
    class="astryx-page-control"
    :class="{ 'astryx-touch-hit-area-band': isTouch }"
    :data-touch="isTouch || undefined"
    :data-interacting="motion.isInteracting.value || undefined"
    :style="rootStyle"
    role="slider"
    tabindex="0"
    :aria-label="label ?? messages.pagination.pageIndicators"
    aria-orientation="horizontal"
    aria-valuemin="1"
    :aria-valuemax="pages"
    :aria-valuenow="current + 1"
    :aria-valuetext="messages.pagination.pageOf(current + 1, pages)"
    @keydown="onKeydown"
  >
    <span ref="strip" class="astryx-page-control__strip" aria-hidden="true" :style="stripStyle">
      <span
        v-for="page in renderedRange"
        :key="page"
        class="astryx-page-control__indicator"
        :data-page="page"
        :style="dotStyle(page)"
      />
    </span>
  </div>
</template>
