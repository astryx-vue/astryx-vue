import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import rangeDemo from './range.vue'
import rangeSource from './range.vue?raw&highlighted'

export const calendarBasic = defineDemo(basicDemo, basicSource)
export const calendarRange = defineDemo(rangeDemo, rangeSource)
