import { defineDemo } from '../../demo-infra/defineDemo'
import horizontalLabelsDemo from './horizontal-labels.vue'
import horizontalLabelsSource from './horizontal-labels.vue?raw&highlighted'
import horizontalDemo from './horizontal.vue'
import horizontalSource from './horizontal.vue?raw&highlighted'
import mixedDemo from './mixed.vue'
import mixedSource from './mixed.vue?raw&highlighted'
import nestedDemo from './overview.vue'
import overviewDemo from './overview.vue'
import nestedSource from './overview.vue?raw&highlighted'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'form-layout-preview' }

export const formLayoutHorizontal = defineDemo(horizontalDemo, horizontalSource, options)
export const formLayoutHorizontalLabels = defineDemo(horizontalLabelsDemo, horizontalLabelsSource, options)
export const formLayoutMixed = defineDemo(mixedDemo, mixedSource, options)
export const formLayoutNested = defineDemo(nestedDemo, nestedSource, options)
export const formLayoutOverview = defineDemo(overviewDemo, overviewSource)
