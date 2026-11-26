import { defineDemo } from '../../demo-infra/defineDemo'
import bubbleCustomDemo from '../chat-message-bubble/custom-content.vue'
import bubbleCustomSource from '../chat-message-bubble/custom-content.vue?raw&highlighted'
import bubbleDensityDemo from '../chat-message-bubble/density.vue'
import bubbleDensitySource from '../chat-message-bubble/density.vue?raw&highlighted'
import bubbleGroupingDemo from '../chat-message-bubble/grouping.vue'
import bubbleGroupingSource from '../chat-message-bubble/grouping.vue?raw&highlighted'
import bubbleMetadataDemo from '../chat-message-bubble/metadata.vue'
import bubbleMetadataSource from '../chat-message-bubble/metadata.vue?raw&highlighted'
import bubbleVariantsDemo from '../chat-message-bubble/variants.vue'
import bubbleVariantsSource from '../chat-message-bubble/variants.vue?raw&highlighted'
import listDensityDemo from '../chat-message-list/density.vue'
import listDensitySource from '../chat-message-list/density.vue?raw&highlighted'
import listFullDemo from '../chat-message-list/full-featured.vue'
import listFullSource from '../chat-message-list/full-featured.vue?raw&highlighted'
import metadataFooterDemo from '../chat-message-metadata/footer-actions.vue'
import metadataFooterSource from '../chat-message-metadata/footer-actions.vue?raw&highlighted'
import metadataStatusDemo from '../chat-message-metadata/status.vue'
import metadataStatusSource from '../chat-message-metadata/status.vue?raw&highlighted'
import metadataTimeDemo from '../chat-message-metadata/timestamps.vue'
import metadataTimeSource from '../chat-message-metadata/timestamps.vue?raw&highlighted'
import messageAvatarDemo from '../chat-message/avatar.vue'
import messageAvatarSource from '../chat-message/avatar.vue?raw&highlighted'
import messageGhostDemo from '../chat-message/ghost.vue'
import messageGhostSource from '../chat-message/ghost.vue?raw&highlighted'
import messageGroupDemo from '../chat-message/multi-bubble.vue'
import messageGroupSource from '../chat-message/multi-bubble.vue?raw&highlighted'
import systemIconDemo from '../chat-system-message/icon.vue'
import systemIconSource from '../chat-system-message/icon.vue?raw&highlighted'
import systemStatusDemo from '../chat-system-message/status-updates.vue'
import systemStatusSource from '../chat-system-message/status-updates.vue?raw&highlighted'
import systemVariantsDemo from '../chat-system-message/variants.vue'
import systemVariantsSource from '../chat-system-message/variants.vue?raw&highlighted'
import toolsSimpleDemo from '../chat-tool-calls/simple.vue'
import toolsSimpleSource from '../chat-tool-calls/simple.vue?raw&highlighted'
import toolsStatusesDemo from '../chat-tool-calls/statuses.vue'
import toolsStatusesSource from '../chat-tool-calls/statuses.vue?raw&highlighted'
import composerMentionsDemo from './composer-mentions.vue'
import composerMentionsSource from './composer-mentions.vue?raw&highlighted'
import composerShellDemo from './composer-shell.vue'
import composerShellSource from './composer-shell.vue?raw&highlighted'
import composerStatesDemo from './composer-states.vue'
import composerStatesSource from './composer-states.vue?raw&highlighted'
import layoutPanelDemo from './layout-panel.vue'
import layoutPanelSource from './layout-panel.vue?raw&highlighted'
import overviewDemo from './overview.vue'
import overviewSource from './overview.vue?raw&highlighted'
import patternConversationDemo from './pattern-conversation.vue'
import patternConversationSource from './pattern-conversation.vue?raw&highlighted'
import patternLandingDemo from './pattern-landing.vue'
import patternLandingSource from './pattern-landing.vue?raw&highlighted'
import scrollLabelsDemo from './scroll-labels.vue'
import scrollLabelsSource from './scroll-labels.vue?raw&highlighted'
import tokenizedDemo from './tokenized.vue'
import tokenizedSource from './tokenized.vue?raw&highlighted'
import toolsExpandableDemo from './tools-expandable.vue'
import toolsExpandableSource from './tools-expandable.vue?raw&highlighted'

const stack = { className: 'chat-preview-stack' }
const wide = { className: 'chat-preview-wide' }

export const chatOverview = defineDemo(overviewDemo, overviewSource, { className: 'chat-overview' })
export const chatPatternConversation = defineDemo(patternConversationDemo, patternConversationSource, { className: 'chat-pattern' })
export const chatPatternLanding = defineDemo(patternLandingDemo, patternLandingSource, { className: 'chat-pattern-landing' })
export const chatLayoutPanel = defineDemo(layoutPanelDemo, layoutPanelSource, { className: 'chat-preview' })
export const chatComposerShell = defineDemo(composerShellDemo, composerShellSource, { className: 'chat-preview' })
export const chatComposerStates = defineDemo(composerStatesDemo, composerStatesSource, { className: 'chat-preview' })
export const chatComposerMentions = defineDemo(composerMentionsDemo, composerMentionsSource, { className: 'chat-preview' })
export const chatTokenized = defineDemo(tokenizedDemo, tokenizedSource, stack)
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
