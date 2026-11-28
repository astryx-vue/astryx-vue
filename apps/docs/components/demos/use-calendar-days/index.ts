import { defineDemo } from '../../demo-infra/defineDemo'
import monthGridDemo from './month-grid.vue'
import monthGridSource from './month-grid.vue?raw&highlighted'

export const useCalendarDaysMonthGrid = defineDemo(monthGridDemo, monthGridSource)
