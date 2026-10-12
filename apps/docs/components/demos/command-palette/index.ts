import { defineDemo } from '../../demo-infra/defineDemo'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import footerDemo from './footer.vue'
import footerSource from './footer.vue?raw&highlighted'
import groupedDemo from './grouped.vue'
import groupedSource from './grouped.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import pickerDemo from './picker.vue'
import pickerSource from './picker.vue?raw&highlighted'
import richDemo from './rich.vue'
import richSource from './rich.vue?raw&highlighted'

const options = { className: 'command-palette-preview' }

export const commandPaletteBasic = defineDemo(basicDemo, basicSource, options)
export const commandPalettePicker = defineDemo(pickerDemo, pickerSource, options)
export const commandPaletteFooter = defineDemo(footerDemo, footerSource, options)
export const commandPaletteAsync = defineDemo(asyncDemo, asyncSource, options)
export const commandPaletteRich = defineDemo(richDemo, richSource, options)
export const commandPaletteGrouped = defineDemo(groupedDemo, groupedSource, options)
export const commandPaletteOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
