import { defineDemo } from '../../demo-infra/defineDemo'
import descriptionDemo from './description.vue'
import descriptionSource from './description.vue?raw&highlighted'
import disabledDemo from './disabled.vue'
import disabledSource from './disabled.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import settingsDemo from './settings.vue'
import settingsSource from './settings.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const switchDisabled = defineDemo(disabledDemo, disabledSource, options)
export const switchSettings = defineDemo(settingsDemo, settingsSource, options)
export const switchDescription = defineDemo(descriptionDemo, descriptionSource, options)
export const switchStatus = defineDemo(statusDemo, statusSource, options)
export const switchOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug' })
