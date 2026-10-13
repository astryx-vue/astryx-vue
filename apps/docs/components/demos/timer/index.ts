import { defineDemo } from '../../demo-infra/defineDemo'
import formatsDemo from './formats.vue'
import formatsSource from './formats.vue?raw&highlighted'
import inlineDemo from './inline.vue'
import inlineSource from './inline.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import showcaseDemo from './showcase.vue'
import showcaseSource from './showcase.vue?raw&highlighted'
import typographyDemo from './typography.vue'
import typographySource from './typography.vue?raw&highlighted'

export const timerOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
export const timerShowcase = defineDemo(showcaseDemo, showcaseSource)
export const timerFormats = defineDemo(formatsDemo, formatsSource)
export const timerInline = defineDemo(inlineDemo, inlineSource)
export const timerTypography = defineDemo(typographyDemo, typographySource)
