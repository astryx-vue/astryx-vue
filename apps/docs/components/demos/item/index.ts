import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import documentTabsDemo from './document-tabs.vue'
import documentTabsSource from './document-tabs.vue?raw&highlighted'
import metadataDemo from './metadata.vue'
import metadataSource from './metadata.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import startContentDemo from './start-content.vue'
import startContentSource from './start-content.vue?raw&highlighted'

export const itemBasic = defineDemo(basicDemo, basicSource)
export const itemDocumentTabs = defineDemo(documentTabsDemo, documentTabsSource)
export const itemMetadata = defineDemo(metadataDemo, metadataSource)
export const itemStartContent = defineDemo(startContentDemo, startContentSource)
export const itemOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
