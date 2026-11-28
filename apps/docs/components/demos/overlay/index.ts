import { defineDemo } from '../../demo-infra/defineDemo'
import bottomStripDemo from './bottom-strip.vue'
import bottomStripSource from './bottom-strip.vue?raw&highlighted'
import hookQuickViewDemo from './hook-quick-view.vue'
import hookQuickViewSource from './hook-quick-view.vue?raw&highlighted'
import hoverRevealDemo from './hover-reveal.vue'
import hoverRevealSource from './hover-reveal.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

const options = { className: 'overlay-preview' }

export const overlayBottomStrip = defineDemo(bottomStripDemo, bottomStripSource, options)
export const overlayHoverReveal = defineDemo(hoverRevealDemo, hoverRevealSource, options)
export const overlayOverview = defineDemo(overviewDemo, overviewSource)
export const overlayHookQuickView = defineDemo(hookQuickViewDemo, hookQuickViewSource)
