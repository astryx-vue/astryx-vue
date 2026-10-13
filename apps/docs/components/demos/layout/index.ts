import { defineDemo } from '../../demo-infra/defineDemo'
import cardDemo from './card.vue'
import cardSource from './card.vue?raw&highlighted'
import contentOnlyDemo from './content-only.vue'
import contentOnlySource from './content-only.vue?raw&highlighted'
import contentWidthDemo from './content-width.vue'
import contentWidthSource from './content-width.vue?raw&highlighted'
import dualPanelDemo from './dual-panel.vue'
import dualPanelSource from './dual-panel.vue?raw&highlighted'
import fullBleedDemo from './full-bleed.vue'
import fullBleedSource from './full-bleed.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import sidebarDemo from './sidebar.vue'
import sidebarSource from './sidebar.vue?raw&highlighted'

const options = { className: 'layout-preview' }

export const layoutCard = defineDemo(cardDemo, cardSource, options)
export const layoutContentOnly = defineDemo(contentOnlyDemo, contentOnlySource, options)
export const layoutContentWidth = defineDemo(contentWidthDemo, contentWidthSource, { className: 'layout-preview layout-preview--fill' })
export const layoutDualPanel = defineDemo(dualPanelDemo, dualPanelSource, options)
export const layoutFullBleed = defineDemo(fullBleedDemo, fullBleedSource, options)
export const layoutSidebar = defineDemo(sidebarDemo, sidebarSource, options)
export const layoutOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
