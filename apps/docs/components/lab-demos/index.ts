import { defineDemo } from '../demo-infra/defineDemo'
import chatEmojiPickerDemo from './chat-emoji-picker.vue'
import chatEmojiPickerSource from './chat-emoji-picker.vue?raw&highlighted'
import chatReactionBarDemo from './chat-reaction-bar.vue'
import chatReactionBarSource from './chat-reaction-bar.vue?raw&highlighted'
import circularProgressDemo from './circular-progress.vue'
import circularProgressSource from './circular-progress.vue?raw&highlighted'
import codeEditorDemo from './code-editor.vue'
import codeEditorSource from './code-editor.vue?raw&highlighted'
import commentComposerEditDemo from './comment-composer-edit.vue'
import commentComposerEditSource from './comment-composer-edit.vue?raw&highlighted'
import commentComposerDemo from './comment-composer.vue'
import commentComposerSource from './comment-composer.vue?raw&highlighted'
import diffViewerOverviewDemo from './diff-viewer-overview.vue'
import diffViewerOverviewSource from './diff-viewer-overview.vue?raw&highlighted'
import diffViewerDemo from './diff-viewer.vue'
import diffViewerSource from './diff-viewer.vue?raw&highlighted'
import emojiPickerPopoverDemo from './emoji-picker-popover.vue'
import emojiPickerPopoverSource from './emoji-picker-popover.vue?raw&highlighted'
import emojiPickerDemo from './emoji-picker.vue'
import emojiPickerSource from './emoji-picker.vue?raw&highlighted'
import infoTipDemo from './info-tip.vue'
import infoTipSource from './info-tip.vue?raw&highlighted'
import listInputDemo from './list-input.vue'
import listInputSource from './list-input.vue?raw&highlighted'
import logStreamOverviewDemo from './log-stream-overview.vue'
import logStreamOverviewSource from './log-stream-overview.vue?raw&highlighted'
import logStreamDemo from './log-stream.vue'
import logStreamSource from './log-stream.vue?raw&highlighted'
import mobileTokenizerOverviewDemo from './mobile-tokenizer-overview.vue'
import mobileTokenizerOverviewSource from './mobile-tokenizer-overview.vue?raw&highlighted'
import mobileTokenizerDemo from './mobile-tokenizer.vue'
import mobileTokenizerSource from './mobile-tokenizer.vue?raw&highlighted'
import scheduleDemo from './schedule.vue'
import scheduleSource from './schedule.vue?raw&highlighted'
import statDemo from './stat.vue'
import statSource from './stat.vue?raw&highlighted'
import svgIconDemo from './svg-icon.vue'
import svgIconSource from './svg-icon.vue?raw&highlighted'
import tourOverviewDemo from './tour-overview.vue'
import tourOverviewSource from './tour-overview.vue?raw&highlighted'
import tourDemo from './tour.vue'
import tourSource from './tour.vue?raw&highlighted'
import transferListOverviewDemo from './transfer-list-overview.vue'
import transferListOverviewSource from './transfer-list-overview.vue?raw&highlighted'
import transferListDemo from './transfer-list.vue'
import transferListSource from './transfer-list.vue?raw&highlighted'

const options = { className: 'lab-demo' }

export const labChatEmojiPicker = defineDemo(chatEmojiPickerDemo, chatEmojiPickerSource, options)
export const labChatReactionBar = defineDemo(chatReactionBarDemo, chatReactionBarSource, options)
export const labCircularProgress = defineDemo(circularProgressDemo, circularProgressSource, options)
export const labCodeEditor = defineDemo(codeEditorDemo, codeEditorSource, options)
export const labCommentComposer = defineDemo(commentComposerDemo, commentComposerSource, options)
export const labCommentComposerEdit = defineDemo(commentComposerEditDemo, commentComposerEditSource, options)
export const labDiffViewer = defineDemo(diffViewerDemo, diffViewerSource, options)
export const labEmojiPicker = defineDemo(emojiPickerDemo, emojiPickerSource, options)
export const labEmojiPickerPopover = defineDemo(emojiPickerPopoverDemo, emojiPickerPopoverSource, options)
export const labDiffViewerOverview = defineDemo(diffViewerOverviewDemo, diffViewerOverviewSource, options)
export const labInfoTip = defineDemo(infoTipDemo, infoTipSource, options)
export const labListInput = defineDemo(listInputDemo, listInputSource, options)
export const labLogStream = defineDemo(logStreamDemo, logStreamSource, options)
export const labLogStreamOverview = defineDemo(logStreamOverviewDemo, logStreamOverviewSource, options)
export const labMobileTokenizer = defineDemo(mobileTokenizerDemo, mobileTokenizerSource, options)
export const labMobileTokenizerOverview = defineDemo(mobileTokenizerOverviewDemo, mobileTokenizerOverviewSource, options)
export const labSchedule = defineDemo(scheduleDemo, scheduleSource, options)
export const labStat = defineDemo(statDemo, statSource, options)
export const labSvgIcon = defineDemo(svgIconDemo, svgIconSource, options)
export const labTransferList = defineDemo(transferListDemo, transferListSource, options)
export const labTransferListOverview = defineDemo(transferListOverviewDemo, transferListOverviewSource, options)
export const labTour = defineDemo(tourDemo, tourSource, options)
export const labTourOverview = defineDemo(tourOverviewDemo, tourOverviewSource, options)
