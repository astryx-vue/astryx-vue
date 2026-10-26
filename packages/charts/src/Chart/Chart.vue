<script setup lang="ts">
import type { ChartProps, ChartSlots } from './types.js'
import { Text, useLocale, VisuallyHidden } from '@astryx-vue/core'
import { computed, provide } from 'vue'
import ChartLegend from '../ChartLegend/ChartLegend.vue'
import ChartTooltip from '../ChartTooltip/ChartTooltip.vue'
import { chartContextKey } from '../context.js'
import { formatList } from '../formatters.js'
import { deriveLegendItems } from '../legend.js'
import { useChartMessages } from '../messages.js'
import { isUtilityMarkType } from '../types.js'
import ChartMarks from './ChartMarks.js'
import { MAX_TABLE_POINTS } from './types.js'
import { useChartFrame, useChartIds } from './useChartFrame.js'

import '../../styles/chart.css'

defineOptions({ name: 'AstryxChart', inheritAttrs: false })

const props = withDefaults(defineProps<ChartProps>(), {
  height: 300,
  width: 0,
  margin: undefined,
  yBaseline: 'auto',
  yDomain: undefined,
  xDomain: undefined,
  legend: false,
  tooltip: false,
  title: undefined,
  subtitle: undefined,
})

defineSlots<ChartSlots>()

const { containerRef, svgRef, containerWidth, safeHeight, margin, innerWidth, innerHeight, resolved, seriesCtx, chart, handlePointerMove, handlePointerLeave } = useChartFrame(props)
const { clipId, descId } = useChartIds()

/** 模板里写变量名的 ref 读不到类型，绑定统一用函数式 ref 显式赋值。 */
function setSvgRef(element: unknown): void {
  svgRef.value = (element as SVGSVGElement | null) ?? null
}

function setContainerRef(element: unknown): void {
  containerRef.value = (element as HTMLElement | null) ?? null
}

provide(chartContextKey, chart)

const t = useChartMessages()
const { locale } = useLocale()

const primarySeries = computed(() => props.series.filter(s => !isUtilityMarkType(s.type)))

/**
 * SVG 的无障碍名字。给了 `title` 就用它，否则按主系列和 x 字段生成一句，
 * 没有主系列（全是标注）时退到通用的「图表」。
 */
const accessibleLabel = computed(() => {
  if (props.title)
    return props.title
  if (primarySeries.value.length === 0)
    return t('@astryx.chart.label')
  return t('@astryx.chart.labelWithSeries', {
    series: formatList(primarySeries.value.map(s => s.label ?? s.key), locale.value),
    xKey: props.xKey,
  })
})

const tableKeys = computed(() => Array.from(new Set(primarySeries.value.flatMap(s => s.dataKeys))))

/** 数据量小的时候额外给一张表；点太多就成了噪音，只留名字。 */
const showDataTable = computed(() => props.data.length > 0
  && tableKeys.value.length > 0
  && props.data.length * tableKeys.value.length <= MAX_TABLE_POINTS)

/** 表格单元格里怎么显示一个值。 */
function tableCell(value: unknown): string {
  return value == null ? '' : String(value)
}

const legendConfig = computed(() => props.legend === true ? {} : props.legend || null)
const legendItems = computed(() => legendConfig.value?.items ?? deriveLegendItems(props.series))
const legendPosition = computed(() => legendConfig.value?.position ?? 'bottom')
const legendAlignment = computed(() => legendConfig.value?.alignment ?? 'start')

const tooltipConfig = computed(() => props.tooltip === true ? {} : props.tooltip || {})

const chartStyle = computed(() => ({ height: `${safeHeight.value}px` }))

defineExpose({ element: containerRef })
</script>

<template>
  <!--
    只有一个根元素：量宽度的 `ResizeObserver` 盯着它，换元素就会跟丢。
    还没量到宽度时它只撑住高度、不画内容，免得首帧画在 0 宽上。
  -->
  <div
    :ref="setContainerRef"
    v-bind="$attrs"
    class="astryx-chart"
    :style="chartStyle"
  >
    <template v-if="containerWidth !== 0">
      <div
        v-if="title || subtitle"
        class="astryx-chart__header"
      >
        <Text
          v-if="title"
          type="body"
          weight="semibold"
          display="block"
        >
          {{ title }}
        </Text>
        <Text
          v-if="subtitle"
          type="supporting"
          display="block"
        >
          {{ subtitle }}
        </Text>
      </div>
      <div
        class="astryx-chart__body"
        :data-legend-position="legendConfig ? legendPosition : undefined"
      >
        <ChartLegend
          v-if="legendConfig"
          class="astryx-chart__legend"
          :items="legendItems"
          :position="legendPosition"
          :alignment="legendAlignment"
        />
        <div class="astryx-chart__plot">
          <svg
            :ref="setSvgRef"
            role="img"
            width="100%"
            :height="safeHeight"
            :aria-label="accessibleLabel"
            :aria-describedby="subtitle ? descId : undefined"
          >
            <title v-if="title">{{ title }}</title>
            <desc
              v-if="subtitle"
              :id="descId"
            >{{ subtitle }}</desc>
            <defs>
              <clipPath :id="clipId">
                <rect x="0" y="0" :width="innerWidth" :height="innerHeight" />
              </clipPath>
            </defs>
            <g :transform="`translate(${margin.left},${margin.top})`">
              <!-- 1. 网格 -->
              <slot name="grid" />

              <!-- 2. 系列：每个系列自己画，整体按绘图区裁切 -->
              <ChartMarks
                :series="series"
                :resolved="resolved"
                :series-ctx="seriesCtx"
                :clip-id="clipId"
              />

              <!-- 3. 坐标轴 -->
              <slot name="axes" />

              <!-- 4. 指针捕获层和交互层 -->
              <rect
                x="0"
                y="0"
                :width="innerWidth"
                :height="innerHeight"
                fill="transparent"
                @pointermove="handlePointerMove"
                @pointerleave="handlePointerLeave"
              />
              <slot name="interactions" />

              <!-- 5. 提示框：声明式开关；要完全控制就自己写一个 <ChartTooltip> 放进默认插槽 -->
              <ChartTooltip
                v-if="tooltip"
                :series="series"
                v-bind="tooltipConfig"
              >
                <template v-if="$slots.tooltip" #content="scope">
                  <slot name="tooltip" v-bind="scope" />
                </template>
              </ChartTooltip>

              <!-- 6. 逃生口 -->
              <slot />
            </g>
          </svg>
        </div>
      </div>
      <VisuallyHidden
        v-if="showDataTable"
        as="div"
      >
        <table>
          <caption>{{ t('@astryx.chart.dataTableCaption', { label: accessibleLabel }) }}</caption>
          <thead>
            <tr>
              <th scope="col">
                {{ xKey }}
              </th>
              <th
                v-for="key in tableKeys"
                :key="key"
                scope="col"
              >
                {{ key }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in data"
              :key="index"
            >
              <th scope="row">
                {{ tableCell(row[xKey]) }}
              </th>
              <td
                v-for="key in tableKeys"
                :key="key"
              >
                {{ tableCell(row[key]) }}
              </td>
            </tr>
          </tbody>
        </table>
      </VisuallyHidden>
    </template>
  </div>
</template>
