import { defineDemo } from '../../demo-infra/defineDemo'
import basicDemo from './basic.vue'
import basicSource from './basic.vue?raw&highlighted'
import mediaDemo from './media.vue'
import mediaSource from './media.vue?raw&highlighted'
import metadataDemo from './metadata.vue'
import metadataSource from './metadata.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'

export const listItemBasic = defineDemo(basicDemo, basicSource)
export const listItemMedia = defineDemo(mediaDemo, mediaSource)
export const listItemMetadata = defineDemo(metadataDemo, metadataSource)
export const listItemOverview = defineDemo(overviewDemo, overviewSource, { className: 'overview-frame' })
