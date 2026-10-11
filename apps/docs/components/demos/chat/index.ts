import { defineDemo } from '../../demo-infra/defineDemo'
import bubbleCustomDemo from './bubble-custom.vue'
import bubbleCustomSource from './bubble-custom.vue?raw&highlighted'
import bubbleDensityDemo from './bubble-density.vue'
import bubbleDensitySource from './bubble-density.vue?raw&highlighted'
import bubbleGroupingDemo from './bubble-grouping.vue'
import bubbleGroupingSource from './bubble-grouping.vue?raw&highlighted'
import bubbleMetadataDemo from './bubble-metadata.vue'
import bubbleMetadataSource from './bubble-metadata.vue?raw&highlighted'
import bubbleVariantsDemo from './bubble-variants.vue'
import bubbleVariantsSource from './bubble-variants.vue?raw&highlighted'
import layoutPanelDemo from './layout-panel.vue'
import layoutPanelSource from './layout-panel.vue?raw&highlighted'
import listDensityDemo from './list-density.vue'
import listDensitySource from './list-density.vue?raw&highlighted'
import listFullDemo from './list-full.vue'
import listFullSource from './list-full.vue?raw&highlighted'
import messageAvatarDemo from './message-avatar.vue'
import messageAvatarSource from './message-avatar.vue?raw&highlighted'
import messageGhostDemo from './message-ghost.vue'
import messageGhostSource from './message-ghost.vue?raw&highlighted'
import messageGroupDemo from './message-group.vue'
import messageGroupSource from './message-group.vue?raw&highlighted'
import metadataFooterDemo from './metadata-footer.vue'
import metadataFooterSource from './metadata-footer.vue?raw&highlighted'
import metadataStatusDemo from './metadata-status.vue'
import metadataStatusSource from './metadata-status.vue?raw&highlighted'
import metadataTimeDemo from './metadata-time.vue'
import metadataTimeSource from './metadata-time.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import scrollLabelsDemo from './scroll-labels.vue'
import scrollLabelsSource from './scroll-labels.vue?raw&highlighted'
import systemIconDemo from './system-icon.vue'
import systemIconSource from './system-icon.vue?raw&highlighted'
import systemStatusDemo from './system-status.vue'
import systemStatusSource from './system-status.vue?raw&highlighted'
import systemVariantsDemo from './system-variants.vue'
import systemVariantsSource from './system-variants.vue?raw&highlighted'
import toolsExpandableDemo from './tools-expandable.vue'
import toolsExpandableSource from './tools-expandable.vue?raw&highlighted'
import toolsSimpleDemo from './tools-simple.vue'
import toolsSimpleSource from './tools-simple.vue?raw&highlighted'
import toolsStatusesDemo from './tools-statuses.vue'
import toolsStatusesSource from './tools-statuses.vue?raw&highlighted'

const stack = { className: 'chat-preview-stack' }
const wide = { className: 'chat-preview-wide' }

export const chatOverview = defineDemo(overviewDemo, overviewSource, { className: 'chat-overview' })
export const chatLayoutPanel = defineDemo(layoutPanelDemo, layoutPanelSource, { className: 'chat-preview' })
export const chatScrollLabels = defineDemo(scrollLabelsDemo, scrollLabelsSource, stack)
export const chatMessageAvatar = defineDemo(messageAvatarDemo, messageAvatarSource, stack)
export const chatMessageGhost = defineDemo(messageGhostDemo, messageGhostSource, stack)
export const chatMessageGroup = defineDemo(messageGroupDemo, messageGroupSource, stack)
export const chatBubbleCustom = defineDemo(bubbleCustomDemo, bubbleCustomSource, stack)
export const chatBubbleDensity = defineDemo(bubbleDensityDemo, bubbleDensitySource, wide)
export const chatBubbleGrouping = defineDemo(bubbleGroupingDemo, bubbleGroupingSource, stack)
export const chatBubbleMetadata = defineDemo(bubbleMetadataDemo, bubbleMetadataSource, stack)
export const chatBubbleVariants = defineDemo(bubbleVariantsDemo, bubbleVariantsSource, stack)
export const chatListDensity = defineDemo(listDensityDemo, listDensitySource, wide)
export const chatListFull = defineDemo(listFullDemo, listFullSource, stack)
export const chatMetadataFooter = defineDemo(metadataFooterDemo, metadataFooterSource, stack)
export const chatMetadataStatus = defineDemo(metadataStatusDemo, metadataStatusSource, stack)
export const chatMetadataTime = defineDemo(metadataTimeDemo, metadataTimeSource, stack)
export const chatSystemIcon = defineDemo(systemIconDemo, systemIconSource, stack)
export const chatSystemStatus = defineDemo(systemStatusDemo, systemStatusSource, { className: 'chat-preview-system' })
export const chatSystemVariants = defineDemo(systemVariantsDemo, systemVariantsSource, wide)
export const chatToolsExpandable = defineDemo(toolsExpandableDemo, toolsExpandableSource, stack)
export const chatToolsSimple = defineDemo(toolsSimpleDemo, toolsSimpleSource, stack)
export const chatToolsStatuses = defineDemo(toolsStatusesDemo, toolsStatusesSource, stack)
