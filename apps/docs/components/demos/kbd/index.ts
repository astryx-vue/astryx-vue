import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import keyNamesDemo from './key-names.vue'
import keyNamesSource from './key-names.vue?raw&highlighted'
import menuDemo from './menu.vue'
import menuSource from './menu.vue?raw&highlighted'
import modifiersDemo from './modifiers.vue'
import modifiersSource from './modifiers.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'kbd-preview' }

export const kbdInline = defineDemo(inlineDemo, inlineSource, options)
export const kbdMenu = defineDemo(menuDemo, menuSource, options)
export const kbdBasic = defineDemo(basicDemo, basicSource, options)
export const kbdModifiers = defineDemo(modifiersDemo, modifiersSource, options)
export const kbdKeyNames = defineDemo(keyNamesDemo, keyNamesSource, options)

export const kbdOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
