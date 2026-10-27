<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Button,
  Card,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Link,
  pixel,
  ProgressBar,
  proportional,
  Table,
  Text,
  VStack,
} from '@astryx-vue/core'
import { computed, h, onBeforeUnmount, onMounted, ref } from 'vue'

interface PageRow extends Record<string, unknown> {
  id: string
  page: string
  views: number
  newUsers: string
  avgTime: string
  exits: string
}

interface EventRow extends Record<string, unknown> {
  id: string
  event: string
  count: number
  users: number
  newUsers: number
}

const CHART_COLORS = {
  allUsers: 'var(--astryx-color-data-categorical-blue, #0171E3)',
  desktop: 'var(--astryx-color-data-categorical-orange, #EB6E00)',
  mobile: 'var(--astryx-color-data-categorical-purple, #6B1EFD)',
}

/** 24 小时的活跃用户曲线，每 15 分钟一个点，共 96 点。 */
const ACTIVE_ALL = [116, 118, 117, 119, 116, 113, 109, 111, 110, 107, 104, 101, 100, 99, 97, 95, 93, 91, 89, 87, 85, 83, 80, 77, 75, 76, 76, 75, 73, 71, 69, 67, 65, 63, 61, 60, 59, 58, 57, 56, 56, 56, 57, 56, 56, 55, 55, 54, 54, 53, 53, 52, 51, 50, 49, 49, 48, 48, 49, 49, 50, 51, 52, 54, 56, 58, 61, 64, 67, 70, 73, 76, 80, 85, 90, 95, 99, 102, 104, 104, 106, 109, 112, 114, 116, 117, 119, 119, 120, 115, 111, 110, 113, 116, 118, 120]
const ACTIVE_DESKTOP = [79, 80, 79, 81, 79, 76, 72, 74, 72, 69, 66, 62, 57, 54, 50, 46, 41, 39, 37, 36, 34, 32, 30, 28, 26, 26, 27, 27, 27, 27, 27, 28, 29, 29, 30, 31, 33, 34, 35, 36, 38, 39, 40, 40, 41, 41, 41, 40, 40, 39, 39, 38, 37, 36, 35, 35, 34, 33, 33, 32, 31, 30, 29, 28, 27, 26, 26, 27, 28, 30, 33, 37, 43, 49, 55, 61, 66, 69, 72, 72, 74, 76, 78, 80, 81, 81, 83, 82, 83, 78, 74, 73, 76, 79, 81, 83]
const ACTIVE_MOBILE = [37, 38, 38, 38, 37, 37, 37, 37, 38, 38, 38, 39, 43, 45, 47, 49, 52, 52, 52, 51, 51, 51, 50, 49, 49, 50, 49, 48, 46, 44, 42, 39, 36, 34, 31, 29, 26, 24, 22, 20, 18, 17, 17, 16, 15, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 16, 17, 19, 21, 23, 26, 29, 32, 35, 37, 39, 40, 40, 39, 37, 36, 35, 34, 33, 33, 32, 32, 32, 33, 34, 34, 35, 36, 36, 37, 37, 37, 37, 37, 37, 37, 37, 37]

const ACTIVE_SERIES = [
  { key: 'allUsers', color: CHART_COLORS.allUsers, name: 'All Users', values: ACTIVE_ALL },
  { key: 'desktop', color: CHART_COLORS.desktop, name: 'Desktop', values: ACTIVE_DESKTOP },
  { key: 'mobile', color: CHART_COLORS.mobile, name: 'Mobile', values: ACTIVE_MOBILE },
]

/** 图表画布：800×300，留出左侧刻度与底部时间轴的边距。 */
const CHART = { h: 300, padLeft: 30, padRight: 10, padTop: 5, padBottom: 35 }

/** 图表宽度跟着容器走，viewBox 和像素一比一，线和文字都不会被拉伸。 */
const chartEl = ref<SVGSVGElement | null>(null)
const chartWidth = ref(800)
const chartInnerWidth = computed(() => chartWidth.value - CHART.padLeft - CHART.padRight)
let chartObserver: ResizeObserver | null = null
onMounted(() => {
  if (!chartEl.value || typeof ResizeObserver === 'undefined')
    return
  chartObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0)
      chartWidth.value = entry.contentRect.width
  })
  chartObserver.observe(chartEl.value)
})
onBeforeUnmount(() => chartObserver?.disconnect())
const CHART_INNER_H = CHART.h - CHART.padTop - CHART.padBottom

/** 把一个数组折成 polyline 的 points 字符串。 */
function pointsFor(values: number[], min: number, max: number): string {
  return values.map((value, i) => {
    const x = CHART.padLeft + (i / (values.length - 1)) * chartInnerWidth.value
    const y = CHART.padTop + CHART_INNER_H - ((value - min) / (max - min)) * CHART_INNER_H
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

function tickY(value: number, min: number, max: number): number {
  return CHART.padTop + CHART_INNER_H - ((value - min) / (max - min)) * CHART_INNER_H
}

function tickX(index: number): number {
  return CHART.padLeft + (index / (ACTIVE_ALL.length - 1)) * chartInnerWidth.value
}

const Y_AXIS = [0, 20, 40, 60, 80, 100, 120]
const Y_MIN = 0
const Y_MAX = 120

/** 横轴标 3 个时间点（曲线上的 32 / 64 / 95），起点不标，和原版一样。 */
const X_TICKS = [32, 64, 95]
const X_LABELS: Record<number, string> = {
  0: 'Apr 1 14:00',
  32: 'Apr 1 22:00',
  64: 'Apr 2 06:00',
  95: 'Apr 2 14:00',
}

const METRICS = [
  { label: 'Monthly Visitors', value: '27.3 k', change: '+18.2%', positive: true },
  { label: 'Monthly Page Views', value: '48.2 k', change: '+12.5%', positive: true },
  { label: 'Avg. Session', value: '4.5 min', change: '-14.3%', positive: false },
  { label: 'Bounce Rate', value: '42.3%', change: '-8.7%', positive: false },
]

const SPARKLINES = [
  [48, 46, 44, 42, 40, 18, 16, 38, 36, 34, 32, 30, 12, 10, 28, 26, 28, 32, 36, 14, 12, 40, 44, 48, 52, 56, 28, 24, 58, 62],
  [36, 38, 35, 37, 36, 14, 12, 38, 36, 34, 37, 35, 12, 10, 36, 34, 36, 35, 38, 14, 12, 40, 44, 50, 54, 56, 26, 22, 58, 60],
  [58, 56, 60, 58, 62, 30, 26, 60, 58, 62, 60, 58, 28, 24, 56, 54, 50, 46, 42, 18, 14, 38, 36, 34, 32, 30, 10, 8, 28, 26],
  [52, 56, 50, 54, 58, 62, 60, 54, 52, 56, 50, 54, 60, 58, 50, 48, 46, 44, 40, 46, 44, 38, 36, 34, 36, 32, 38, 36, 30, 28],
]

const REGION_DATA = [
  { label: 'NORAM', value: 38, color: 'var(--astryx-color-data-categorical-blue, #0171E3)' },
  { label: 'EMEA', value: 28, color: 'var(--astryx-color-data-categorical-orange, #EB6E00)' },
  { label: 'APAC', value: 22, color: 'var(--astryx-color-data-categorical-green, #0B991F)' },
  { label: 'LATAM', value: 8, color: 'var(--astryx-color-data-categorical-purple, #6B1EFD)' },
  { label: 'Other', value: 4, color: 'var(--astryx-color-data-neutral, #8494A3)' },
]

const ROLE_DATA = [
  { label: 'Engineer', value: 45, color: 'var(--astryx-color-data-categorical-blue, #0171E3)' },
  { label: 'Manager', value: 20, color: 'var(--astryx-color-data-categorical-orange, #EB6E00)' },
  { label: 'Designer', value: 15, color: 'var(--astryx-color-data-categorical-green, #0B991F)' },
  { label: 'Data Scientist', value: 12, color: 'var(--astryx-color-data-categorical-purple, #6B1EFD)' },
  { label: 'Other', value: 8, color: 'var(--astryx-color-data-neutral, #8494A3)' },
]

const TOP_PAGES: PageRow[] = [
  { id: '1', page: '/home', views: 8420, newUsers: '62.3%', avgTime: '3:42', exits: '18.5%' },
  { id: '2', page: '/products', views: 6150, newUsers: '45.1%', avgTime: '4:15', exits: '22.8%' },
  { id: '3', page: '/pricing', views: 4830, newUsers: '38.7%', avgTime: '2:58', exits: '35.2%' },
  { id: '4', page: '/blog', views: 3920, newUsers: '71.4%', avgTime: '5:30', exits: '12.1%' },
  { id: '5', page: '/docs', views: 3410, newUsers: '29.8%', avgTime: '6:12', exits: '8.4%' },
  { id: '6', page: '/about', views: 2980, newUsers: '55.6%', avgTime: '2:15', exits: '28.3%' },
  { id: '7', page: '/contact', views: 2540, newUsers: '48.2%', avgTime: '1:48', exits: '41.7%' },
  { id: '8', page: '/changelog', views: 2210, newUsers: '22.1%', avgTime: '4:55', exits: '15.6%' },
  { id: '9', page: '/support', views: 1870, newUsers: '59.3%', avgTime: '3:22', exits: '30.9%' },
  { id: '10', page: '/careers', views: 1520, newUsers: '83.1%', avgTime: '2:34', exits: '45.2%' },
]

const TOP_EVENTS: EventRow[] = [
  { id: '1', event: 'page_view', count: 18420, users: 12300, newUsers: 4920 },
  { id: '2', event: 'session_start', count: 14850, users: 9870, newUsers: 3950 },
  { id: '3', event: 'first_visit', count: 8230, users: 8230, newUsers: 8230 },
  { id: '4', event: 'user_engagement', count: 6120, users: 4510, newUsers: 1580 },
  { id: '5', event: 'click', count: 3540, users: 2680, newUsers: 940 },
  { id: '6', event: 'scroll', count: 2910, users: 2140, newUsers: 750 },
  { id: '7', event: 'form_submit', count: 1870, users: 1350, newUsers: 540 },
  { id: '8', event: 'video_play', count: 1240, users: 980, newUsers: 390 },
  { id: '9', event: 'search', count: 960, users: 720, newUsers: 290 },
  { id: '10', event: 'share', count: 580, users: 410, newUsers: 160 },
]

const TOP_PAGES_MAX = Math.max(...TOP_PAGES.map(row => row.views))
const TOP_EVENTS_MAX = Math.max(...TOP_EVENTS.map(row => row.count))

/** 数值列里画一条进度条，条下再写原始数字。 */
function barCell(value: number, max: number, label: string, suffix = '') {
  return h(VStack, { gap: 1 }, () => [
    h(ProgressBar, { value, max, label, isLabelHidden: true }),
    h(Text, { type: 'supporting' }, () => `${value.toLocaleString()}${suffix}`),
  ])
}

const TOP_PAGES_COLUMNS: TableColumn<PageRow>[] = [
  { key: 'page', header: 'Page', width: pixel(160) },
  { key: 'views', header: 'Views', width: proportional(1), renderCell: (row: PageRow) => barCell(row.views, TOP_PAGES_MAX, `${row.page} views`, ' views') },
  { key: 'newUsers', header: 'New Users', width: pixel(120) },
  { key: 'avgTime', header: 'Avg. Time', width: pixel(120) },
]

const TOP_EVENTS_COLUMNS: TableColumn<EventRow>[] = [
  { key: 'event', header: 'Event', width: pixel(160) },
  { key: 'count', header: 'Count', width: proportional(1), renderCell: (row: EventRow) => barCell(row.count, TOP_EVENTS_MAX, `${row.count}`) },
  { key: 'users', header: 'Users', width: pixel(120), renderCell: (row: EventRow) => row.users.toLocaleString() },
  { key: 'newUsers', header: 'New Users', width: pixel(120), renderCell: (row: EventRow) => row.newUsers.toLocaleString() },
]

function tickLabel(value: number): string {
  return X_LABELS[value] ?? ''
}

/**
 * 指标卡里的迷你折线：不带坐标轴，纵轴从 0 起，上界取到下一个整刻度（和原版的图表默认一样），
 * 上下各留 5px、左右各留 5px。宽度跟着卡片走，viewBox 和像素一比一。
 */
const SPARK = { h: 40, pad: 5 }
const sparkWidth = ref(398)
let sparkObserver: ResizeObserver | null = null

/** 第一张迷你图量宽，四张同宽，共用这个宽度。 */
function bindSpark(element: unknown): void {
  sparkObserver?.disconnect()
  sparkObserver = null
  if (!(element instanceof SVGSVGElement) || typeof ResizeObserver === 'undefined')
    return
  sparkObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0)
      sparkWidth.value = entry.contentRect.width
  })
  sparkObserver.observe(element)
}
onBeforeUnmount(() => sparkObserver?.disconnect())

function sparkTop(values: number[]): number {
  const max = Math.max(...values)
  const step = max > 50 ? 20 : max > 20 ? 10 : 5
  return Math.ceil(max / step) * step
}

function sparklinePoints(values: number[]): string {
  const top = sparkTop(values)
  const inner = SPARK.h - SPARK.pad * 2
  const width = sparkWidth.value - SPARK.pad * 2
  return values.map((value, i) => {
    const x = SPARK.pad + (i / (values.length - 1)) * width
    const y = SPARK.pad + inner - (value / top) * inner
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}
</script>

<template>
  <Layout height="fill">
    <LayoutContent :padding="6">
      <VStack :gap="6">
        <VStack :gap="6">
          <HStack h-align="between" align="center">
            <Heading :level="3">
              Active users
            </Heading>
            <Button label="Reload" variant="secondary">
              <template #icon>
                <Icon name="heroicons:arrow-path" size="sm" />
              </template>
            </Button>
          </HStack>
          <VStack :gap="3">
            <svg ref="chartEl" class="active-users-chart" :viewBox="`0 0 ${chartWidth} ${CHART.h}`" role="img" aria-label="Active users">
              <g>
                <line
                  v-for="tick in Y_AXIS"
                  :key="`grid-${tick}`"
                  class="chart-grid"
                  :x1="CHART.padLeft"
                  :x2="chartWidth - CHART.padRight"
                  :y1="tickY(tick, Y_MIN, Y_MAX)"
                  :y2="tickY(tick, Y_MIN, Y_MAX)"
                />
                <text
                  v-for="tick in Y_AXIS"
                  :key="`ylabel-${tick}`"
                  class="chart-axis"
                  :x="CHART.padLeft - 8"
                  :y="Math.max(tickY(tick, Y_MIN, Y_MAX), 9)"
                  text-anchor="end"
                  dominant-baseline="central"
                >{{ tick }}</text>
                <text
                  v-for="index in X_TICKS"
                  :key="`xlabel-${index}`"
                  class="chart-axis"
                  :x="Math.min(tickX(index), chartWidth - CHART.padRight - 23)"
                  :y="CHART.h - CHART.padBottom + 8"
                  text-anchor="middle"
                >{{ tickLabel(index) }}</text>
                <polyline
                  v-for="series in ACTIVE_SERIES"
                  :key="series.key"
                  fill="none"
                  :stroke="series.color"
                  stroke-width="2"
                  :points="pointsFor(series.values, Y_MIN, Y_MAX)"
                />
              </g>
            </svg>
            <HStack :gap="6" align="center">
              <HStack v-for="series in ACTIVE_SERIES" :key="series.key" :gap="2" align="center">
                <span class="legend-swatch" :style="{ backgroundColor: series.color }" aria-hidden="true" />
                <Text type="supporting" color="secondary">
                  {{ series.name }}
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </VStack>

        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Grid v-for="(start, group) in [0, 2]" :key="group" :columns="{ minWidth: 240, repeat: 'fit' }" :gap="4">
            <Card v-for="(metric, i) in METRICS.slice(start, start + 2)" :key="metric.label">
              <VStack :gap="2">
                <Heading :level="4">
                  {{ metric.label }}
                </Heading>
                <HStack :gap="2" align="center">
                  <Heading :level="2">
                    {{ metric.value }}
                  </Heading>
                  <HStack :gap="1" align="center">
                    <Icon :icon="metric.positive ? 'arrowUp' : 'arrowDown'" size="xsm" :color="metric.positive ? 'success' : 'error'" />
                    <Text type="body" color="secondary">
                      {{ metric.change }}
                    </Text>
                  </HStack>
                </HStack>
                <Text type="supporting" color="secondary">
                  Last 30 days vs. Previous
                </Text>
                <svg :ref="i === 0 && start === 0 ? bindSpark : undefined" class="sparkline" :viewBox="`0 0 ${sparkWidth} ${SPARK.h}`" aria-hidden="true">
                  <polyline fill="none" :stroke="CHART_COLORS.allUsers" stroke-width="1.5" :points="sparklinePoints(SPARKLINES[start + i])" />
                </svg>
              </VStack>
            </Card>
          </Grid>
        </Grid>

        <Divider />

        <HStack h-align="between" align="center">
          <Heading :level="3">
            Demographics
          </Heading>
          <Button label="View more" variant="secondary" />
        </HStack>
        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Card v-for="group in [{ title: 'Region', data: REGION_DATA }, { title: 'Role', data: ROLE_DATA }]" :key="group.title">
            <VStack :gap="4">
              <Heading :level="4">
                {{ group.title }}
              </Heading>
              <div class="stacked-bar" role="img" :aria-label="group.title">
                <span
                  v-for="segment in group.data"
                  :key="segment.label"
                  class="stacked-bar__segment"
                  :style="{ backgroundColor: segment.color, flexGrow: segment.value }"
                />
              </div>
              <HStack :gap="4" wrap="wrap">
                <VStack v-for="segment in group.data" :key="segment.label" :gap="0">
                  <HStack :gap="2" align="center">
                    <span class="legend-swatch" :style="{ backgroundColor: segment.color }" aria-hidden="true" />
                    <Text type="supporting">
                      {{ segment.label }}
                    </Text>
                  </HStack>
                  <Text type="supporting" color="secondary">
                    {{ segment.value }} - {{ ((segment.value / group.data.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(2) }}%
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </Grid>

        <Divider />

        <HStack h-align="between" align="center">
          <Heading :level="3">
            Engagement
          </Heading>
          <Button label="View more" variant="secondary" />
        </HStack>
        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Card>
            <VStack :gap="6">
              <HStack h-align="between" align="center">
                <Heading :level="4">
                  Top pages
                </Heading>
                <Text type="body">
                  <Link href="#">
                    All pages
                  </Link>
                </Text>
              </HStack>
              <Table :data="TOP_PAGES" :columns="TOP_PAGES_COLUMNS" id-key="id" density="compact" dividers="rows" has-hover />
            </VStack>
          </Card>
          <Card>
            <VStack :gap="6">
              <HStack h-align="between" align="center">
                <Heading :level="4">
                  Top events
                </Heading>
                <Text type="body">
                  <Link href="#">
                    All events
                  </Link>
                </Text>
              </HStack>
              <Table :data="TOP_EVENTS" :columns="TOP_EVENTS_COLUMNS" id-key="id" density="compact" dividers="rows" has-hover />
            </VStack>
          </Card>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.legend-swatch {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.stacked-bar {
  display: flex;
  height: 24px;
  overflow: clip;
  border-radius: 4px;
}
.stacked-bar__segment {
  flex-basis: 0;
}
.active-users-chart {
  width: 100%;
  height: 300px;
  display: block;
}
.chart-grid {
  stroke: var(--astryx-color-border);
  stroke-width: 1;
}
.chart-axis {
  fill: var(--astryx-color-text-secondary);
  font-size: 12px;
}
.sparkline {
  width: 100%;
  height: 40px;
  display: block;
}
</style>
