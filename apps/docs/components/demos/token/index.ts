import { defineDemo } from '../../demo-infra/defineDemo'
import clickableDemo from './clickable.vue'
import clickableSource from './clickable.vue?raw&highlighted'
import colorsDemo from './colors.vue'
import colorsSource from './colors.vue?raw&highlighted'
import endDemo from './end.vue'
import endSource from './end.vue?raw&highlighted'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import removableDemo from './removable.vue'
import removableSource from './removable.vue?raw&highlighted'

export const tokenOverview = defineDemo(overviewDemo, overviewSource)
export const tokenClickable = defineDemo(clickableDemo, clickableSource)
export const tokenColors = defineDemo(colorsDemo, colorsSource)
export const tokenEnd = defineDemo(endDemo, endSource)
export const tokenIcon = defineDemo(iconDemo, iconSource)
export const tokenRemovable = defineDemo(removableDemo, removableSource)
