import { defineDemo } from '../../demo-infra/defineDemo'
import labelsDemo from './labels.vue'
import labelsSource from './labels.vue?raw&highlighted'
import numbersDemo from './numbers.vue'
import numbersSource from './numbers.vue?raw&highlighted'

const options = { className: 'citation-preview' }

export const citationLabels = defineDemo(labelsDemo, labelsSource, options)
export const citationNumbers = defineDemo(numbersDemo, numbersSource, options)
