import { defineDemo } from '../../demo-infra/defineDemo'
import fieldLabelDemo from './field-label.vue'
import fieldLabelSource from './field-label.vue?raw&highlighted'
import metricDefinitionsDemo from './metric-definitions.vue'
import metricDefinitionsSource from './metric-definitions.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import permissionNotesDemo from './permission-notes.vue'
import permissionNotesSource from './permission-notes.vue?raw&highlighted'
import sizesDemo from './sizes.vue'
import sizesSource from './sizes.vue?raw&highlighted'

const options = { className: 'input-preview-host' }

export const infoTipOverview = defineDemo(overviewDemo, overviewSource)
export const infoTipSizes = defineDemo(sizesDemo, sizesSource, options)
export const infoTipFieldLabel = defineDemo(fieldLabelDemo, fieldLabelSource, options)
export const infoTipMetricDefinitions = defineDemo(metricDefinitionsDemo, metricDefinitionsSource, options)
export const infoTipPermissionNotes = defineDemo(permissionNotesDemo, permissionNotesSource, options)
