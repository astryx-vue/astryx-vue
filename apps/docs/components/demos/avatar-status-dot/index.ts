import { defineDemo } from '../../demo-infra/defineDemo'
import iconDemo from './icon.vue'
import iconSource from './icon.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import variantsDemo from './variants.vue'
import variantsSource from './variants.vue?raw&highlighted'

const options = { className: 'overview-row' }

export const avatarStatusDotOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-row overview-status-dots' })
export const avatarStatusDotVariants = defineDemo(variantsDemo, variantsSource, options)
export const avatarStatusDotIcon = defineDemo(iconDemo, iconSource, options)
