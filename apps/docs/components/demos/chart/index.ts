import { defineDemo } from '../../demo-infra/defineDemo'
import bandDemo from './band-reference.vue'
import bandSource from './band-reference.vue?raw&highlighted'
import barDemo from './bar.vue'
import barSource from './bar.vue?raw&highlighted'
import candlestickDemo from './candlestick.vue'
import candlestickSource from './candlestick.vue?raw&highlighted'
import tooltipDemo from './custom-tooltip.vue'
import tooltipSource from './custom-tooltip.vue?raw&highlighted'
import dotDemo from './dot.vue'
import dotSource from './dot.vue?raw&highlighted'
import errorBarDemo from './error-bar.vue'
import errorBarSource from './error-bar.vue?raw&highlighted'
import lineDemo from './line.vue'
import lineSource from './line.vue?raw&highlighted'
import areaDemo from './stacked-area.vue'
import areaSource from './stacked-area.vue?raw&highlighted'

const chartClass = 'charts-demo'

export const chartsLine = defineDemo(lineDemo, lineSource, { className: chartClass })
export const chartsBar = defineDemo(barDemo, barSource, { className: chartClass })
export const chartsStackedArea = defineDemo(areaDemo, areaSource, { className: chartClass })
export const chartsDot = defineDemo(dotDemo, dotSource, { className: chartClass })
export const chartsBandReference = defineDemo(bandDemo, bandSource, { className: chartClass })
export const chartsErrorBar = defineDemo(errorBarDemo, errorBarSource, { className: chartClass })
export const chartsCandlestick = defineDemo(candlestickDemo, candlestickSource, { className: chartClass })
export const chartsCustomTooltip = defineDemo(tooltipDemo, tooltipSource, { className: chartClass })
