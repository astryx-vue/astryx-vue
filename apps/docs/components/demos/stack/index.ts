import { defineDemo } from '../../demo-infra/defineDemo'
import alignmentDemo from './alignment.vue'
import alignmentSource from './alignment.vue?raw&highlighted'
import directionsDemo from './directions.vue'
import directionsSource from './directions.vue?raw&highlighted'
import fillDemo from './fill.vue'
import fillSource from './fill.vue?raw&highlighted'
import hStackDemo from './h-stack.vue'
import hStackSource from './h-stack.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import stackItemDemo from './stack-item.vue'
import stackItemSource from './stack-item.vue?raw&highlighted'
import vStackDemo from './v-stack.vue'
import vStackSource from './v-stack.vue?raw&highlighted'

export const stackAlignment = defineDemo(alignmentDemo, alignmentSource, {
  className: 'stack-preview-host',
})

export const stackFill = defineDemo(fillDemo, fillSource, {
  className: 'stack-preview-host',
})

export const stackDirections = defineDemo(directionsDemo, directionsSource, {
  className: 'stack-preview-host',
  dataKind: 'directions',
})

export const stackHStack = defineDemo(hStackDemo, hStackSource, {
  className: 'stack-preview-host',
  dataKind: 'h-stack',
})

export const stackVStack = defineDemo(vStackDemo, vStackSource, {
  className: 'stack-preview-host',
  dataKind: 'v-stack',
})

export const stackItem = defineDemo(stackItemDemo, stackItemSource, {
  className: 'stack-preview-host',
  dataKind: 'stack-item',
})

export const stackOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-hug stack-preview-host', dataKind: 'h-stack' })
