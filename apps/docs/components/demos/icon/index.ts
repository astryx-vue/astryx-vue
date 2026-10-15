import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import buttonDemo from './button.vue'
import buttonSource from './button.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import paletteDemo from './palette.vue'
import paletteSource from './palette.vue?raw&highlighted'
import semanticDemo from './semantic.vue'
import semanticSource from './semantic.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import themesDemo from './themes.vue'
import themesSource from './themes.vue?raw&highlighted'

export const iconBasic = defineDemo(basicDemo, basicSource)
export const iconSizes = defineDemo(sizesDemo, sizesSource)
export const iconSemantic = defineDemo(semanticDemo, semanticSource)
export const iconPalette = defineDemo(paletteDemo, paletteSource)
export const iconStatus = defineDemo(statusDemo, statusSource)
export const iconButton = defineDemo(buttonDemo, buttonSource)
export const iconThemes = defineDemo(themesDemo, themesSource)

export const iconOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
