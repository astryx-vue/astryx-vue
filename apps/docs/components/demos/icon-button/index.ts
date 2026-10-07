import { defineDemo } from '../../demo-infra/defineDemo'
import actionBarDemo from './action-bar.vue'
import actionBarSource from './action-bar.vue?raw&highlighted'
import asyncDemo from './async.vue'
import asyncSource from './async.vue?raw&highlighted'
import floatingDemo from './floating.vue'
import floatingSource from './floating.vue?raw&highlighted'
import tooltipsDemo from './tooltips.vue'
import tooltipsSource from './tooltips.vue?raw&highlighted'

const iconButtonPreviewClass = 'icon-button-preview-host icon-button-preview'

export const iconButtonActionBar = defineDemo(actionBarDemo, actionBarSource, {
  className: iconButtonPreviewClass,
})

export const iconButtonFloating = defineDemo(floatingDemo, floatingSource, {
  className: iconButtonPreviewClass,
})

export const iconButtonAsync = defineDemo(asyncDemo, asyncSource, {
  className: `${iconButtonPreviewClass} icon-button-preview--async`,
})

export const iconButtonTooltips = defineDemo(tooltipsDemo, tooltipsSource, {
  className: iconButtonPreviewClass,
})
