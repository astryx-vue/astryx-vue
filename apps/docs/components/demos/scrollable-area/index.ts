import { defineDemo } from '../../demo-infra/defineDemo'
import inlineRailDemo from './inline-rail.vue'
import inlineRailSource from './inline-rail.vue?raw&highlighted'
import overscrollDemo from './overscroll.vue'
import overscrollSource from './overscroll.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import stickyHeadersDemo from './sticky-headers.vue'
import stickyHeadersSource from './sticky-headers.vue?raw&highlighted'
import stickyPassthroughDemo from './sticky-passthrough.vue'
import stickyPassthroughSource from './sticky-passthrough.vue?raw&highlighted'
import twoAxisDemo from './two-axis.vue'
import twoAxisSource from './two-axis.vue?raw&highlighted'

const options = { className: 'scroll-preview' }

export const scrollableAreaInlineRail = defineDemo(inlineRailDemo, inlineRailSource, options)
export const scrollableAreaOverscroll = defineDemo(overscrollDemo, overscrollSource, options)
export const scrollableAreaStickyHeaders = defineDemo(stickyHeadersDemo, stickyHeadersSource, options)
export const scrollableAreaStickyPassthrough = defineDemo(stickyPassthroughDemo, stickyPassthroughSource, options)
export const scrollableAreaTwoAxis = defineDemo(twoAxisDemo, twoAxisSource, options)
export const scrollableAreaOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
