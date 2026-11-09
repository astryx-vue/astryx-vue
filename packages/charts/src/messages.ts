import type { TranslatorValues } from '@astryx-vue/core'
import { useLocale, useTranslator } from '@astryx-vue/core'

/**
 * 图表里给读屏软件念的几句话。
 *
 * 原版把这些文案放在 core 的 `locales/*.json` 里，用 `@astryx.chart.*` 这类键取。
 * 我们 core 的文案目录还没收录图表（图表的键在 `upstreamMap` 里没有对应项），
 * 所以这里先自带一份中英文兜底：core 认得出这个键就用 core 的译文，认不出就用兜底。
 * 以后 core 把键补上，兜底自动失效，不用改这里。
 */

export type ChartMessageKey
  = | '@astryx.chart.label'
    | '@astryx.chart.labelWithSeries'
    | '@astryx.chart.dataTableCaption'
    | '@astryx.chartLegend.label'
    | '@astryx.radialChart.radarLabel'
    | '@astryx.radialChart.pieLabel'
    | '@astryx.radialChart.series'
    | '@astryx.radialChart.percentage'
    | '@astryx.radialChart.value'
    | '@astryx.radialChart.share'

/** Chart 与 legend 沿用上游文案；radial 按同一语言习惯补充中英文。 */
const FALLBACKS: Record<ChartMessageKey, Record<'en' | 'zh-CN', string>> = {
  '@astryx.chart.label': {
    'en': 'Chart',
    'zh-CN': '图表',
  },
  '@astryx.chart.labelWithSeries': {
    'en': 'Chart of {series} by {xKey}',
    'zh-CN': '按 {xKey} 显示 {series} 的图表',
  },
  '@astryx.chart.dataTableCaption': {
    'en': '{label} data',
    'zh-CN': '{label}的数据',
  },
  '@astryx.chartLegend.label': {
    'en': 'Chart legend',
    'zh-CN': '图表图例',
  },
  '@astryx.radialChart.radarLabel': {
    'en': 'Radar chart of {axes}',
    'zh-CN': '{axes}雷达图',
  },
  '@astryx.radialChart.pieLabel': {
    'en': 'Pie chart of {valueKey}',
    'zh-CN': '{valueKey}饼图',
  },
  '@astryx.radialChart.series': {
    'en': 'Series',
    'zh-CN': '系列',
  },
  '@astryx.radialChart.percentage': {
    'en': 'Percentage',
    'zh-CN': '百分比',
  },
  '@astryx.radialChart.value': {
    'en': 'Value',
    'zh-CN': '数值',
  },
  '@astryx.radialChart.share': {
    'en': 'Share',
    'zh-CN': '占比',
  },
}

/** 把 `{name}` 占位符换成实际值，认不出的占位符原样留着。 */
function fillPlaceholders(template: string, values?: TranslatorValues): string {
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
    const value = values?.[name]
    return value === undefined ? whole : String(value)
  })
}

/** 图表文案的翻译函数。 */
export type ChartTranslator = (key: ChartMessageKey, values?: TranslatorValues) => string

/** 取图表文案的翻译函数，优先用 core 的译文，没有就用包内的兜底。 */
export function useChartMessages(): ChartTranslator {
  const { t } = useTranslator()
  const { locale } = useLocale()

  return (key, values) => {
    const translated = t(key, values)
    if (translated !== key)
      return translated
    const table = FALLBACKS[key]
    return fillPlaceholders(table[locale.value === 'zh-CN' ? 'zh-CN' : 'en'], values)
  }
}
