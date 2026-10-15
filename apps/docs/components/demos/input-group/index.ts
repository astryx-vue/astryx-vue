import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'
import websiteDemo from './website.vue'
import websiteSource from './website.vue?raw&highlighted'

export const inputGroupBasic = defineDemo(basicDemo, basicSource, { className: 'input-preview-host' })

export const inputGroupWebsite = defineDemo(websiteDemo, websiteSource, { className: 'input-preview-host' })

export const inputGroupStatus = defineDemo(statusDemo, statusSource, { className: 'input-preview-host' })

export const inputGroupOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
