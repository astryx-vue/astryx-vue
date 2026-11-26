import type { ComputedRef, InjectionKey, MaybeRefOrGetter } from 'vue'
import type { CalendarSystem } from '../utils/calendarSystem.js'
import { computed, inject, provide, toValue } from 'vue'
import { devWarn } from '../composables/useDevWarning.js'
import { isCalendarSystem, isCalendarSystemAvailable } from '../utils/calendarSystem.js'

/** 最近的 `InternationalizationProvider` 要求的历法，原样保存，组件读的时候再解析。 */
export const astryxCalendarKey: InjectionKey<ComputedRef<string | undefined>> = Symbol('astryx-calendar')

export function provideAstryxCalendar(calendar: MaybeRefOrGetter<string | undefined>): void {
  provide(astryxCalendarKey, computed(() => toValue(calendar)))
}

const warned = new Set<string>()

function warnOnce(key: string, source: string, message: string): void {
  if (warned.has(key))
    return
  warned.add(key)
  devWarn(source, message)
}

/**
 * 把一个历法标识解析成能显示的历法。不认识的标识（例如 `islamic`）和当前环境显示不了的历法
 * 都退回 `gregory`，开发期各警告一次。
 */
export function resolveCalendarSystem(id: string | undefined, source: string): CalendarSystem {
  if (id == null)
    return 'gregory'
  if (!isCalendarSystem(id)) {
    warnOnce(`unknown:${id}`, source, `The calendar "${id}" is not supported; showing Gregorian dates.`)
    return 'gregory'
  }
  if (!isCalendarSystemAvailable(id)) {
    warnOnce(`unavailable:${id}`, source, `This runtime cannot show the "${id}" calendar; showing Gregorian dates.`)
    return 'gregory'
  }
  return id
}

/**
 * 日期组件显示的历法：组件自己的 `calendar` 优先，其次是最近的 provider，都没有时是公历。
 * 语言标签本身（包括 `-u-ca-` 扩展）不会改变历法。
 */
export function useCalendarSystem(
  override?: MaybeRefOrGetter<CalendarSystem | undefined>,
  source = 'InternationalizationProvider',
): ComputedRef<CalendarSystem> {
  const provided = inject(astryxCalendarKey, undefined)
  return computed(() => resolveCalendarSystem(toValue(override) ?? provided?.value, source))
}
