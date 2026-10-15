import { defineDemo } from '../../demo-infra/defineDemo'
import columnsDemo from './columns.vue'
import columnsSource from './columns.vue?raw&highlighted'
import createDemo from './create.vue'
import createSource from './create.vue?raw&highlighted'
import formDemo from './form.vue'
import formSource from './form.vue?raw&highlighted'
import ghostDemo from './ghost.vue'
import ghostSource from './ghost.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import searchableDemo from './searchable.vue'
import searchableSource from './searchable.vue?raw&highlighted'
import sectionsDemo from './sections.vue'
import sectionsSource from './sections.vue?raw&highlighted'
import sheetDemo from './sheet.vue'
import sheetSource from './sheet.vue?raw&highlighted'

export const multiSelectorOverview = defineDemo(overviewDemo, overviewSource)
export const multiSelectorSheet = defineDemo(sheetDemo, sheetSource)
export const multiSelectorColumns = defineDemo(columnsDemo, columnsSource)
export const multiSelectorCreate = defineDemo(createDemo, createSource)
export const multiSelectorForm = defineDemo(formDemo, formSource)
export const multiSelectorGhost = defineDemo(ghostDemo, ghostSource)
export const multiSelectorSearchable = defineDemo(searchableDemo, searchableSource)
export const multiSelectorSections = defineDemo(sectionsDemo, sectionsSource)
