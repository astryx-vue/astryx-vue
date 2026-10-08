import { defineDemo } from '../../demo-infra/defineDemo'
import displaysDemo from './displays.vue'
import displaysSource from './displays.vue?raw&highlighted'
import levelsDemo from './levels.vue'
import levelsSource from './levels.vue?raw&highlighted'

export const headingLevels = defineDemo(levelsDemo, levelsSource, {
  className: 'heading-preview',
})

export const headingDisplays = defineDemo(displaysDemo, displaysSource, {
  className: 'heading-preview',
})
