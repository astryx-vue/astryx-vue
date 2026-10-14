import { defineDemo } from '../../demo-infra/defineDemo'
import actionsDemo from './actions.vue'
import actionsSource from './actions.vue?raw&highlighted'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import compactDemo from './compact.vue'
import compactSource from './compact.vue?raw&highlighted'
import containerDemo from './container.vue'
import containerSource from './container.vue?raw&highlighted'
import illustrationDemo from './illustration.vue'
import illustrationSource from './illustration.vue?raw&highlighted'
import narrowDemo from './narrow.vue'
import narrowSource from './narrow.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'empty-state-preview' }

export const emptyStateBasic = defineDemo(basicDemo, basicSource, options)
export const emptyStateActions = defineDemo(actionsDemo, actionsSource, options)
export const emptyStateCompact = defineDemo(compactDemo, compactSource, options)
export const emptyStateContainer = defineDemo(containerDemo, containerSource, options)
export const emptyStateIllustration = defineDemo(illustrationDemo, illustrationSource, options)
export const emptyStateNarrow = defineDemo(narrowDemo, narrowSource, options)

export const emptyStateOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
