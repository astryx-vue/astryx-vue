<script setup lang="ts">
import type { WeekStartsOn } from '../composables/useDateRange.js'
import type { ReducedMotionDip } from '../motion/reducedMotion.js'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import type { PlainDate } from '../utils/plainDate.js'
import type { MonthRows } from './monthRows.js'
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, shallowRef, useTemplateRef } from 'vue'
import { weekStartIndex } from '../Calendar/calendarDate.js'
import { standaloneShortWeekdayNames } from '../locale/format.js'
import { useAstryxLocale } from '../locale/index.js'
import { playReducedMotionDip, reducedMotionFade } from '../motion/reducedMotion.js'
import { calendarMonthOf } from '../utils/calendarSystem.js'
import { plainDateToISO } from '../utils/plainDate.js'
import { attachInlineSwipe } from './inlineSwipe.js'
import { paneRows, rowAtScrollOffset, scrollOffsetForRow } from './monthRows.js'
import { attachScrollSettle, createScrollSteer, PASSIVE } from './scrollSettle.js'
import TouchMonthGrid from './TouchMonthGrid.vue'

/**
 * 横向连续、按月吸附的一排月份。每个月正好一屏宽，吸附在起点，所以面板高度不变，
 * 也没有停在两个月中间的位置。列表很长（默认前后各五十年），但只挂中心月两边几个月，
 * 一条占位轨道撑出整段滚动宽度。滚动途中不拼接也不回收，吸附位置恒定，惯性不被打断。
 */

const props = defineProps<{
  calendar: CalendarSystem
  rows: MonthRows
  /** 挂载时停在第几排。 */
  initialRow: number
  selected?: Date | null
  min?: Date
  max?: Date
  isDateDisabled?: (date: Date) => boolean
  dateConstraints?: ReadonlyArray<(date: Date) => boolean>
  weekStartsOn?: WeekStartsOn
  today: Date
}>()

const emit = defineEmits<{
  pick: [date: Date]
  /** 滚动经过的每一排，停没停稳都报；调用方自己引导的滚动不报。 */
  visible: [row: number]
}>()

/**
 * 可见月份两边各挂几个月。按快速甩动估算：窗口每帧最多跟一次，只要一帧走不出三个月就够；
 * 在 `scroll-snap-type: mandatory` 下落到没挂的月份，不只是露出空白，还会被吸回最近挂着的那个。
 */
const OVERSCAN = 3

const locale = useAstryxLocale()
const scroller = useTemplateRef<HTMLElement>('scroller')
const paneSize = shallowRef(0)
const centerRow = shallowRef(props.initialRow)
const focusDate = shallowRef<PlainDate | null>(null)
/** 量到宽度之前（含服务端渲染）只挂当前这个月，量到之后再铺开虚拟轨道。 */
const visibleRows = computed(() => paneSize.value > 0 ? paneRows(centerRow.value, props.rows.count, OVERSCAN) : [centerRow.value])
const weekdays = computed(() => {
  const names = standaloneShortWeekdayNames(locale.value)
  const start = weekStartIndex(props.weekStartsOn)
  return Array.from({ length: 7 }, (_, index) => names[(index + start) % 7] ?? '')
})

let rtl = false
/** 可见的排，同步记一份，滚动处理不用等渲染就能分清变没变。 */
let centerNow = props.initialRow
/** 首次摆放要停的排；量到宽度之前的跳转改写它。 */
let initialTarget = props.initialRow
let positioned = false
/** 挂好那一排的月份之后要滚过去的排，见 scrollToMonth。 */
let pendingScroll: number | null = null
/** 从手指按下到它引起的滚动停稳，滚动归手指；这期间重新居中不关吸附。 */
let fingerScroll = false
let snapFrame = 0
let scrollFrame = 0
let settleFrame = 0
let dip: ReducedMotionDip | null = null
const steer = createScrollSteer()
const detachers: Array<() => void> = []

const offsetFor = (row: number): number => scrollOffsetForRow(row, paneSize.value, rtl)
const clampRow = (row: number): number => Math.min(props.rows.count - 1, Math.max(0, row))

/**
 * 重新居中时，到提交后的下一帧之前关掉吸附。WebKit 把吸附到的位置记成吸附点列表里的序号，
 * 布局一变就按序号重新吸附：卸掉吸附点前面的月份会让序号错位，重新吸附落到下一个月，
 * 那次滚动又触发重新居中，日历就自己一个月一个月往前翻。提交时关着吸附就没有重新吸附，
 * 下一帧再打开，吸附到原地那一屏。手指驱动的滚动不关：iOS 为手势记着一个吸附目标，关掉会丢。
 */
function recenter(element: HTMLElement, row: number): void {
  if (!fingerScroll) {
    element.style.scrollSnapType = 'none'
    cancelAnimationFrame(snapFrame)
    void nextTick(() => {
      snapFrame = requestAnimationFrame(() => {
        element.style.scrollSnapType = ''
      })
    })
  }
  centerRow.value = row
}

function stopDip(): void {
  dip?.cancel()
  dip = null
}

/** 让第 `row` 排停在滚动区起点。 */
function scrollToMonth(target: number, behavior: ScrollBehavior = 'smooth'): void {
  // 每次换月都替掉正在播的淡出淡入，免得它落地时撤销之后的跳转。
  stopDip()
  const element = scroller.value
  const row = clampRow(target)
  if (element == null || paneSize.value === 0) {
    initialTarget = row
    centerNow = row
    centerRow.value = row
    return
  }
  if (Math.abs(row - centerNow) > OVERSCAN) {
    // 挂着的窗口之外没有那一屏，强制吸附会把滚动器吸回最近挂着的月份。先挂目标月，挂好再滚；
    // 跳这么远也不值得做动画。这次跳转也是一次引导。
    pendingScroll = row
    centerNow = row
    steer.start(row)
    recenter(element, row)
    return
  }
  const left = offsetFor(row)
  // 减少动效时换月不滑动：精细指针上直接换，粗指针上在一次透明度下沉里换。
  const fade = behavior === 'smooth' ? reducedMotionFade(element) : null
  if (fade != null) {
    const land = (): void => {
      steer.end()
      if (row === centerNow) {
        element.scrollTo({ left, behavior: 'auto' })
        return
      }
      pendingScroll = row
      centerNow = row
      centerRow.value = row
    }
    if (fade.duration === 0) {
      land()
      return
    }
    dip = playReducedMotionDip(element, fade, () => {
      dip = null
      land()
    })
    return
  }
  steer.start(row)
  element.scrollTo({ left, behavior })
}

// 每次渲染后看一眼：等待中的那一排挂好了就滚过去。
onUpdated(() => {
  const element = scroller.value
  if (pendingScroll == null || element == null || paneSize.value === 0)
    return
  const row = pendingScroll
  pendingScroll = null
  element.scrollTo({ left: offsetFor(row), behavior: 'auto' })
})

/**
 * 手势结束后把滚动器放回月份边界上。列表是虚拟的，吸附点就是挂着的那几屏，手指每划过一个月就挂一屏卸一屏；
 * iOS 在主线程外滚动，按当时知道的吸附点选落点，之后的重新渲染挪走了它，滚动器就停在没有吸附点的地方。
 * 所以停稳后要核对：先隔一帧取两次偏移，还在动就不管（那是 iOS 自己没放完的吸附动画，
 * 从半路四舍五入会把这一划拉回去）；真的停了才校正。人自己滚的去最近的边界，
 * 被浏览器提前截断的引导送到引导的那个月。
 */
function settleOnRest(element: HTMLElement): void {
  fingerScroll = false
  if (paneSize.value === 0)
    return
  const before = element.scrollLeft
  cancelAnimationFrame(settleFrame)
  settleFrame = requestAnimationFrame(() => {
    settleFrame = 0
    if (Math.abs(element.scrollLeft - before) >= 0.5)
      return
    // WebKit 在第二次平滑滚动改了目标后，按第一次的时长提前结束并触发 `scrollend`：
    // 上一次箭头滚到一半时再点箭头，会停在上一个月附近。引导的滚动要送到底，不能四舍五入回去。
    const row = steer.current() ?? rowAtScrollOffset(element.scrollLeft, paneSize.value, props.rows.count, rtl)
    const target = offsetFor(row)
    if (Math.abs(element.scrollLeft - target) < 1) {
      steer.end()
      return
    }
    element.scrollTo({ left: target, behavior: 'smooth' })
  })
}

// 一次触屏滚动的事件比帧多得多，这里只是挪标题、扩窗口，所以按帧节流。
function onScroll(): void {
  const element = scroller.value
  if (scrollFrame !== 0 || element == null || paneSize.value === 0)
    return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    const row = rowAtScrollOffset(element.scrollLeft, paneSize.value, props.rows.count, rtl)
    if (row === centerNow)
      return
    centerNow = row
    recenter(element, row)
    // 引导途中经过的月份不报：引导只由已经知道月份的一方发起（箭头、滚轮、键盘、重置），报回去会成回路。
    const steered = steer.current()
    if (steered != null) {
      if (steered === row)
        steer.end()
      return
    }
    emit('visible', row)
  })
}

function onTouchStart(): void {
  fingerScroll = true
}

function measure(): void {
  const element = scroller.value
  // 不认 0：面板可能还没显示，宽度为 0 会卸掉所有月份并丢掉滚动位置。
  if (element == null || element.clientWidth <= 0)
    return
  rtl = getComputedStyle(element).direction === 'rtl'
  paneSize.value = element.clientWidth
  if (positioned)
    return
  positioned = true
  void nextTick(() => {
    element.scrollLeft = offsetFor(initialTarget)
  })
}

onMounted(() => {
  const element = scroller.value
  if (element == null)
    return
  measure()
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    detachers.push(() => observer.disconnect())
  }
  element.addEventListener('scroll', onScroll, PASSIVE)
  element.addEventListener('touchstart', onTouchStart, PASSIVE)
  detachers.push(() => {
    element.removeEventListener('scroll', onScroll, PASSIVE)
    element.removeEventListener('touchstart', onTouchStart, PASSIVE)
  })
  detachers.push(attachScrollSettle(element, settleOnRest, steer))
  // 浏览器不肯平移的斜向划动，按页翻。
  detachers.push(attachInlineSwipe(element, (direction) => {
    if (paneSize.value > 0)
      element.scrollBy({ left: direction * paneSize.value, behavior: 'smooth' })
  }))
})

onBeforeUnmount(() => {
  stopDip()
  cancelAnimationFrame(snapFrame)
  cancelAnimationFrame(scrollFrame)
  cancelAnimationFrame(settleFrame)
  for (const detach of detachers.splice(0))
    detach()
})

/** 键盘把焦点挪出了一个月：滚到那个月，等那一天挂好再把焦点交给它。 */
function onView(date: PlainDate): void {
  focusDate.value = date
  scrollToMonth(props.rows.rowOf(calendarMonthOf(props.calendar, date)), 'smooth')
  const iso = plainDateToISO(date)
  void nextTick(() => scroller.value?.querySelector<HTMLElement>(`[data-date="${iso}"]:not(.is-other-month)`)?.focus({ preventScroll: true }))
}

defineExpose({ scrollToMonth })
</script>

<template>
  <div class="astryx-date-touch-months">
    <div class="astryx-calendar-weekdays astryx-date-touch-weekdays" aria-hidden="true">
      <div v-for="(name, index) in weekdays" :key="index" class="astryx-calendar-weekday">
        {{ name }}
      </div>
    </div>
    <div ref="scroller" class="astryx-date-touch-scroller" data-scroller="months">
      <div
        class="astryx-date-touch-track"
        :style="paneSize > 0 ? { gridTemplateColumns: `repeat(${rows.count}, ${paneSize}px)` } : undefined"
      >
        <div
          v-for="row in visibleRows"
          :key="row"
          class="astryx-date-touch-pane"
          :style="paneSize > 0 ? { gridColumn: String(row + 1) } : undefined"
        >
          <TouchMonthGrid
            :calendar="calendar"
            :month="rows.monthAt(row)"
            :selected="selected"
            :min="min"
            :max="max"
            :is-date-disabled="isDateDisabled"
            :date-constraints="dateConstraints"
            :week-starts-on="weekStartsOn"
            :today="today"
            :weekdays="false"
            :focus-date="focusDate"
            @pick="emit('pick', $event)"
            @update:view="onView"
          />
        </div>
      </div>
    </div>
  </div>
</template>
