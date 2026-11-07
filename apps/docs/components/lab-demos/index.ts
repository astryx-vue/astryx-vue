import { defineDemo } from '../demo-infra/defineDemo'
import chatEmojiPickerDemo from './chat-emoji-picker.vue'
import chatEmojiPickerSource from './chat-emoji-picker.vue?raw&highlighted'
import chatReactionBarDemo from './chat-reaction-bar.vue'
import chatReactionBarSource from './chat-reaction-bar.vue?raw&highlighted'
import circularProgressDemo from './circular-progress.vue'
import circularProgressSource from './circular-progress.vue?raw&highlighted'
import codeEditorDemo from './code-editor.vue'
import codeEditorSource from './code-editor.vue?raw&highlighted'
import diffViewerDemo from './diff-viewer.vue'
import diffViewerSource from './diff-viewer.vue?raw&highlighted'
import infoTipDemo from './info-tip.vue'
import infoTipSource from './info-tip.vue?raw&highlighted'
import listInputDemo from './list-input.vue'
import listInputSource from './list-input.vue?raw&highlighted'
import logStreamDemo from './log-stream.vue'
import logStreamSource from './log-stream.vue?raw&highlighted'
import mobileTokenizerDemo from './mobile-tokenizer.vue'
import mobileTokenizerSource from './mobile-tokenizer.vue?raw&highlighted'
import statDemo from './stat.vue'
import statSource from './stat.vue?raw&highlighted'
import svgIconDemo from './svg-icon.vue'
import svgIconSource from './svg-icon.vue?raw&highlighted'
import tourDemo from './tour.vue'
import tourSource from './tour.vue?raw&highlighted'
import transferListDemo from './transfer-list.vue'
import transferListSource from './transfer-list.vue?raw&highlighted'

const options = { className: 'lab-demo' }

export const labChatEmojiPicker = defineDemo(chatEmojiPickerDemo, chatEmojiPickerSource, options)
export const labChatReactionBar = defineDemo(chatReactionBarDemo, chatReactionBarSource, options)
export const labCircularProgress = defineDemo(circularProgressDemo, circularProgressSource, options)
export const labCodeEditor = defineDemo(codeEditorDemo, codeEditorSource, options)
export const labDiffViewer = defineDemo(diffViewerDemo, diffViewerSource, options)
export const labInfoTip = defineDemo(infoTipDemo, infoTipSource, options)
export const labListInput = defineDemo(listInputDemo, listInputSource, options)
export const labLogStream = defineDemo(logStreamDemo, logStreamSource, options)
export const labMobileTokenizer = defineDemo(mobileTokenizerDemo, mobileTokenizerSource, options)
export const labStat = defineDemo(statDemo, statSource, options)
export const labSvgIcon = defineDemo(svgIconDemo, svgIconSource, options)
export const labTransferList = defineDemo(transferListDemo, transferListSource, options)
export const labTour = defineDemo(tourDemo, tourSource, options)
