import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import placementsDemo from './placements.vue'
import placementsSource from './placements.vue?raw&highlighted'

const options = { className: 'input-preview-host' }
export const popoverBasic = defineDemo(basicDemo, basicSource, options)
export const popoverPlacements = defineDemo(placementsDemo, placementsSource, options)
export const popoverForm = defineDemo(formDemo, formSource, options)
export const popoverActions = defineDemo(actionsDemo, actionsSource, options)
export const popoverOverview = defineDemo(overviewDemo, overviewSource, options)
