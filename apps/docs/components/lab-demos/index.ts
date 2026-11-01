import { defineDemo } from '../demo-infra/defineDemo'
import circularProgressDemo from './circular-progress.vue'
import circularProgressSource from './circular-progress.vue?raw&highlighted'
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
import transferListDemo from './transfer-list.vue'
import transferListSource from './transfer-list.vue?raw&highlighted'

const options = { className: 'lab-demo' }

export const labCircularProgress = defineDemo(circularProgressDemo, circularProgressSource, options)
export const labInfoTip = defineDemo(infoTipDemo, infoTipSource, options)
export const labListInput = defineDemo(listInputDemo, listInputSource, options)
export const labLogStream = defineDemo(logStreamDemo, logStreamSource, options)
export const labMobileTokenizer = defineDemo(mobileTokenizerDemo, mobileTokenizerSource, options)
export const labStat = defineDemo(statDemo, statSource, options)
export const labSvgIcon = defineDemo(svgIconDemo, svgIconSource, options)
export const labTransferList = defineDemo(transferListDemo, transferListSource, options)
