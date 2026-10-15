import { defineDemo } from '../../demo-infra/defineDemo'
import constraintsDemo from './constraints.vue'
import constraintsSource from './constraints.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'
import singleDemo from './single.vue'
import singleSource from './single.vue?raw&highlighted'
import spanDemo from './span.vue'
import spanSource from './span.vue?raw&highlighted'
import twoMonthsDemo from './two-months.vue'
import twoMonthsSource from './two-months.vue?raw&highlighted'
import weeksDemo from './weeks.vue'
import weeksSource from './weeks.vue?raw&highlighted'

export const calendarConstraints = defineDemo(constraintsDemo, constraintsSource)
export const calendarRange = defineDemo(rangeDemo, rangeSource)
export const calendarSingle = defineDemo(singleDemo, singleSource)
export const calendarSpan = defineDemo(spanDemo, spanSource)
export const calendarTwoMonths = defineDemo(twoMonthsDemo, twoMonthsSource)
export const calendarWeeks = defineDemo(weeksDemo, weeksSource)

export const calendarOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
