import { defineDemo } from '../../demo-infra/defineDemo'
import clearableDemo from './clearable.vue'
import clearableSource from './clearable.vue?raw&highlighted'
import descriptionsDemo from './descriptions.vue'
import descriptionsSource from './descriptions.vue?raw&highlighted'
import ghostDemo from './ghost.vue'
import ghostSource from './ghost.vue?raw&highlighted'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import secondaryDemo from './secondary.vue'
import secondarySource from './secondary.vue?raw&highlighted'
import sectionsDemo from './sections.vue'
import sectionsSource from './sections.vue?raw&highlighted'
import sheetDemo from './sheet.vue'
import sheetSource from './sheet.vue?raw&highlighted'
import statesDemo from './states.vue'
import statesSource from './states.vue?raw&highlighted'
import statusDemo from './status.vue'
import statusSource from './status.vue?raw&highlighted'

export const selectorSheet = defineDemo(sheetDemo, sheetSource)
export const selectorClearable = defineDemo(clearableDemo, clearableSource)
export const selectorGhost = defineDemo(ghostDemo, ghostSource)
export const selectorSecondary = defineDemo(secondaryDemo, secondarySource)
export const selectorActions = defineDemo(actionsDemo, actionsSource)
export const selectorDescriptions = defineDemo(descriptionsDemo, descriptionsSource)
export const selectorSections = defineDemo(sectionsDemo, sectionsSource)
export const selectorStatus = defineDemo(statusDemo, statusSource)
export const selectorStates = defineDemo(statesDemo, statesSource)

export const selectorOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
