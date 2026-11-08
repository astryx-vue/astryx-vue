import type { PlainDate } from '@astryx-vue/core'
import type { Component, VNodeChild } from 'vue'
import type { CalendarEvent, ScheduleCategory } from './CalendarEvent.js'
import type { ZonedDateTime, ZonedDateTimeRange } from './zonedDateTime.js'

export type {
  CalendarDayEvent,
  CalendarEvent,
  CalendarEventBase,
  CalendarInstantEvent,
  ScheduleCategory,
  ScheduleEventColor,
} from './CalendarEvent.js'
export type { ZonedDateTime, ZonedDateTimeRange } from './zonedDateTime.js'
export type { PlainDate } from '@astryx-vue/core'

/** Unix 纪元毫秒。 */
export type Instant = number

export type ScheduleEventSource
  = | ReadonlyArray<CalendarEvent>
    | ((start: Instant, end: Instant) => Promise<ReadonlyArray<CalendarEvent>>)

export type ScheduleDate = Instant

export interface ScheduleRange {
  startDate: PlainDate
  endDate: PlainDate
  start: Instant
  end: Instant
}

export type ScheduleViewOptions = object

/**
 * 周视图和日视图画的是同一张时间格，所以小时窗口和事件浮层是同一组选项。
 * `renderPopover` 在每个画出来的事件上调用。返回内容时该事件是按钮，打开这一视图唯一的浮层；
 * 返回 `null` 时该事件只读。不传时整张格子只读。
 */
export interface ScheduleTimeGridViewOptions {
  /** 画出的第一个小时，0–23。默认 0。 */
  minHour?: number
  /** 格子结束的小时，1–24，并且大于 `minHour`。默认 24。 */
  maxHour?: number
  /** 一小时的像素高度。默认 100。 */
  hourHeight?: number
  renderPopover?: (event: CalendarEvent) => VNodeChild
}

export interface ScheduleViewComponentProps<
  Options extends ScheduleViewOptions = ScheduleViewOptions,
> {
  options: Options
}

export interface ScheduleNavigationRange {
  label: string
  range: ZonedDateTimeRange
}

export interface ScheduleViewBase {
  getDateRange: (date: ZonedDateTime) => ZonedDateTimeRange
  getPreviousDateRange: (date: ZonedDateTime) => ScheduleNavigationRange
  getNextDateRange: (date: ZonedDateTime) => ScheduleNavigationRange
}

export interface ScheduleView<
  Options extends ScheduleViewOptions = ScheduleViewOptions,
> extends ScheduleViewBase {
  component: Component
  options: Options
}

export interface ScheduleHeaderContent {
  startContent: VNodeChild
  centerContent: VNodeChild
  endContent: VNodeChild
}

export type SchedulePluginPosition = 'start' | 'end'

export interface SchedulePlugin {
  renderHeader?: (
    startContent: VNodeChild,
    centerContent: VNodeChild,
    endContent: VNodeChild,
  ) => ScheduleHeaderContent
}

export type ScheduleHeadingLevel = 2 | 3 | 4 | 5 | 6

export interface ScheduleProps {
  /** `createSchedule*View()` 返回的视图。请保持同一引用。 */
  view: ScheduleView
  /** 静态事件，或用当前区间起止毫秒去拉事件的函数。 */
  events: ScheduleEventSource
  /** 用 `label === event.category` 决定颜色和读屏里的分类名。 */
  categories?: ReadonlyArray<ScheduleCategory>
  /** 落在要显示的那一页里的任意毫秒。完全受控。 */
  date: Instant
  /** 当作「今天」高亮的毫秒。不传则取挂载时的时刻，之后不再自己往前走。 */
  focusDate?: Instant
  /** 分页或 Today 时调用，参数是下一页要显示的毫秒。 */
  onChangeDate?: (date: Instant) => void
  /** IANA 时区，例如 `America/Los_Angeles`。默认浏览器时区。 */
  timezoneID?: string
  /** 头部插件。传入数组会换掉默认的分页按钮。 */
  plugins?: ReadonlyArray<SchedulePlugin>
  /** 视图内部小标题的级别。页眉上的区间标题固定是 2 级。默认 3。 */
  headingLevel?: ScheduleHeadingLevel
}

export interface ScheduleEmits {
  /** 和 `onChangeDate` 同一个时刻。模板里写 `@change-date`。 */
  changeDate: [date: Instant]
}
