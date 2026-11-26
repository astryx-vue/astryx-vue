import type { InternationalizationProviderProps } from '../InternationalizationProvider/types.js'
import type { UseCalendarConstraintsOptions } from './useCalendarConstraints.js'
import type { CalendarDay, UseCalendarDaysOptions } from './useCalendarDays.js'
import type { UseCalendarNavigationOptions } from './useCalendarNavigation.js'
import { renderToString } from '@vue/server-renderer'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, ref } from 'vue'
import InternationalizationProvider from '../InternationalizationProvider/InternationalizationProvider.vue'
import { useCalendarConstraints } from './useCalendarConstraints.js'
import { useCalendarDays } from './useCalendarDays.js'
import { useCalendarNavigation } from './useCalendarNavigation.js'

/** 在组件里跑组合式函数；`provider` 给出时套一层 `InternationalizationProvider`。 */
function withSetup<T>(run: () => T, provider?: InternationalizationProviderProps): T {
  let result!: T
  const Probe = defineComponent({
    setup() {
      result = run()
      return () => null
    },
  })
  mount(provider ? { render: () => h(InternationalizationProvider, provider, { default: () => h(Probe) }) } : Probe)
  return result
}

function inMonth(days: CalendarDay[]) {
  return days.filter(day => !day.isOutside)
}

describe('useCalendarDays', () => {
  it('公历一个月：固定六行，补齐首尾，星期名从 weekStartsOn 开始', () => {
    const { days, weeks, dayNames, totalCells } = withSetup(() => useCalendarDays({ year: 2026, month: 12 }))
    expect(totalCells.value).toBe(42)
    expect(weeks.value).toHaveLength(6)
    expect(days.value[0]).toEqual({ date: { year: 2026, month: 11, day: 29 }, iso: '2026-11-29', isOutside: true, dayNumber: 29 })
    expect(inMonth(days.value)).toHaveLength(31)
    expect(dayNames.value).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  })

  it('按需行数，周一开始时 2026 年 2 月占 5 行', () => {
    const { weeks, dayNames } = withSetup(() => useCalendarDays({ year: 2026, month: 2, weekStartsOn: 'mon', hasVariableRowCount: true }))
    expect(weeks.value).toHaveLength(5)
    expect(weeks.value[0]![0]!.iso).toBe('2026-01-26')
    expect(dayNames.value[0]).toBe('Mon')
  })

  it('波斯历阿班月 1405：日子按历法编号，日期仍是公历', () => {
    const { days } = withSetup(() => useCalendarDays({ year: 1405, month: 8, calendar: 'persian' }))
    const month = inMonth(days.value)
    expect(month).toHaveLength(30)
    expect(month[0]).toEqual({ date: { year: 2026, month: 10, day: 23 }, iso: '2026-10-23', isOutside: false, dayNumber: 1 })
    expect(month[29]!.iso).toBe('2026-11-21')
  })

  it('希伯来历闰年的月份按 1 到 13 编号', () => {
    const month = (n: number) => inMonth(withSetup(() => useCalendarDays({ year: 5784, month: n, calendar: 'hebrew' })).days.value)
    const adarI = month(6)
    const adarII = month(7)
    const elul = month(13)
    expect([adarI[0]!.iso, adarI.length]).toEqual(['2024-02-10', 30])
    expect([adarII[0]!.iso, adarII.length]).toEqual(['2024-03-11', 29])
    expect([elul[0]!.iso, elul.length]).toEqual(['2024-09-04', 29])
  })

  it('不读 provider 的历法', () => {
    const { days } = withSetup(() => useCalendarDays({ year: 2026, month: 10 }), { locale: 'en', calendar: 'persian' })
    expect(inMonth(days.value)[0]!.iso).toBe('2026-10-01')
  })

  it('选项是取值函数时跟着变', () => {
    const options = ref<UseCalendarDaysOptions>({ year: 2026, month: 1 })
    const { days } = withSetup(() => useCalendarDays(options))
    options.value = { year: 2026, month: 2 }
    expect(inMonth(days.value)).toHaveLength(28)
  })

  it('显示不了的历法退回公历，开发期警告', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { days } = withSetup(() => useCalendarDays({ year: 2026, month: 10, calendar: 'islamic' as never }))
    expect(inMonth(days.value)[0]!.iso).toBe('2026-10-01')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('useCalendarNavigation', () => {
  it('不受控：翻月、标题、跨月聚焦', () => {
    const nav = withSetup(() => useCalendarNavigation({ initialValue: '2026-01-15' }))
    expect(nav.baseMonth.value).toEqual({ year: 2026, month: 1, day: 1 })
    expect(nav.monthYearLabel.value).toBe('January 2026')
    nav.navigateMonth(1, '2026-01-31', 1)
    expect(nav.baseMonth.value).toEqual({ year: 2026, month: 2, day: 1 })
    expect(nav.pendingFocus.value).toBe('2026-02-01')
    nav.clearPendingFocus()
    expect(nav.pendingFocus.value).toBeNull()
  })

  it('受控：只通知，由调用方改 focusDate', () => {
    const focus = ref<'2026-06-01' | '2026-07-01'>('2026-06-01')
    const onFocusDateChange = vi.fn()
    const nav = withSetup(() => useCalendarNavigation(() => ({ focusDate: focus.value, onFocusDateChange })))
    nav.navigateMonth(1)
    expect(onFocusDateChange).toHaveBeenCalledWith('2026-07-01')
    expect(nav.monthYearLabel.value).toBe('June 2026')
    focus.value = '2026-07-01'
    expect(nav.monthYearLabel.value).toBe('July 2026')
  })

  it('两个月并排', () => {
    const nav = withSetup(() => useCalendarNavigation({ initialValue: '2026-12-10', numberOfMonths: 2 }))
    expect(nav.visibleMonths.value).toEqual([{ year: 2026, month: 12, day: 1 }, { year: 2027, month: 1, day: 1 }])
    expect(nav.monthYearLabel.value).toBe('December 2026 – January 2027')
  })

  it('波斯历按历法月翻，年月可以交给 useCalendarDays', () => {
    const { nav, days } = withSetup(() => {
      const nav = useCalendarNavigation({ initialValue: '2026-10-30', calendar: 'persian' })
      const days = useCalendarDays(() => ({ ...nav.visibleCalendarMonths.value[0]!, calendar: 'persian' }))
      return { nav, days }
    })
    expect(nav.baseMonth.value).toEqual({ year: 2026, month: 10, day: 23 })
    expect(nav.visibleCalendarMonths.value).toEqual([{ year: 1405, month: 8 }])
    expect(nav.monthYearLabel.value).toBe('Aban 1405 AP')
    nav.navigateMonth(1)
    expect(nav.baseMonth.value).toEqual({ year: 2026, month: 11, day: 22 })
    expect(nav.monthYearLabel.value).toBe('Azar 1405 AP')
    expect(inMonth(days.days.value)[0]!.iso).toBe('2026-11-22')
  })

  it('希伯来历闰年经过 Adar I 和 Adar II', () => {
    const nav = withSetup(() => useCalendarNavigation({ initialValue: '2024-02-10', calendar: 'hebrew' }))
    expect(nav.monthYearLabel.value).toBe('Adar I 5784')
    nav.navigateMonth(1)
    expect(nav.monthYearLabel.value).toBe('Adar II 5784')
    expect(nav.visibleCalendarMonths.value).toEqual([{ year: 5784, month: 7 }])
  })

  it('不读 provider 的历法', () => {
    const nav = withSetup(() => useCalendarNavigation({ initialValue: '2026-10-30' }), { locale: 'en', calendar: 'persian' })
    expect(nav.monthYearLabel.value).toBe('October 2026')
  })

  it('标题按 provider 的语言写', () => {
    const options: UseCalendarNavigationOptions = { initialValue: '2026-10-30' }
    const nav = withSetup(() => useCalendarNavigation(options), { locale: 'zh-CN' })
    expect(nav.monthYearLabel.value).toBe('2026年10月')
  })
})

describe('useCalendarConstraints', () => {
  it('min、max 和自定义规则', () => {
    const { isDateDisabled, minDate, maxDate } = withSetup(() => useCalendarConstraints({
      min: '2026-06-05',
      max: '2026-06-25',
      dateConstraints: [date => date.getDay() !== 1],
    }))
    expect(minDate.value).toEqual({ year: 2026, month: 6, day: 5 })
    expect(maxDate.value).toEqual({ year: 2026, month: 6, day: 25 })
    expect(isDateDisabled({ year: 2026, month: 6, day: 4 })).toBe(true)
    expect(isDateDisabled({ year: 2026, month: 6, day: 26 })).toBe(true)
    expect(isDateDisabled({ year: 2026, month: 6, day: 8 })).toBe(true)
    expect(isDateDisabled({ year: 2026, month: 6, day: 9 })).toBe(false)
  })

  it('跨度从起点量，两端都算；起点本身始终可选', () => {
    const options = ref<UseCalendarConstraintsOptions>({ maxRangeSpan: 8, minRangeSpan: 3 })
    const { isDateDisabled } = withSetup(() => useCalendarConstraints(options))
    expect(isDateDisabled({ year: 2026, month: 6, day: 30 })).toBe(false)
    options.value = { ...options.value, rangeAnchor: { year: 2026, month: 6, day: 10 } }
    expect(isDateDisabled({ year: 2026, month: 6, day: 17 })).toBe(false)
    expect(isDateDisabled({ year: 2026, month: 6, day: 18 })).toBe(true)
    expect(isDateDisabled({ year: 2026, month: 6, day: 11 })).toBe(true)
    expect(isDateDisabled({ year: 2026, month: 6, day: 12 })).toBe(false)
    expect(isDateDisabled({ year: 2026, month: 6, day: 10 })).toBe(false)
  })
})

describe('日历组合式函数的服务端渲染', () => {
  it('两次渲染结果一致', async () => {
    const Grid = defineComponent({
      setup() {
        const nav = useCalendarNavigation({ initialValue: '2026-10-30', calendar: 'persian' })
        const { weeks } = useCalendarDays(() => ({ ...nav.visibleCalendarMonths.value[0]!, calendar: 'persian' }))
        return () => h('table', { 'aria-label': nav.monthYearLabel.value }, weeks.value.map(week => h('tr', week.map(day => h('td', day.dayNumber)))))
      },
    })
    const render = (): Promise<string> => renderToString(createSSRApp(Grid))
    const first = await render()
    expect(first).toContain('aria-label="Aban 1405 AP"')
    expect(await render()).toBe(first)
  })
})
