import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import floatingDemo from './floating.vue'
import floatingSource from './floating.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const buttonGroupPreviewClass = 'button-group-preview-host button-group-preview'

export const buttonGroupBasic = defineDemo(basicDemo, basicSource, {
  className: buttonGroupPreviewClass,
})

export const buttonGroupFloating = defineDemo(floatingDemo, floatingSource, {
  className: buttonGroupPreviewClass,
})

export const buttonGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
