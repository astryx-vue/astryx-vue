<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  pixel,
  proportional,
  ProgressBar,
  Selector,
  Table,
  Text,
  VStack,
} from '@astryx-vue/core'
import { computed, h, ref } from 'vue'

// ── 数据 ──────────────────────────────────────────────────────────────────────

const COLORS = {
  blue: 'var(--astryx-color-data-categorical-blue, #0171E3)',
  green: 'var(--astryx-color-data-categorical-green, #0B991F)',
  orange: 'var(--astryx-color-data-categorical-orange, #EB6E00)',
  purple: 'var(--astryx-color-data-categorical-purple, #6B1EFD)',
  teal: 'var(--astryx-color-data-categorical-teal, #08A3A3)',
  neutral: 'var(--astryx-color-data-neutral, #8494A3)',
}

const TREND_DAYS = 90

/** 稳定的伪随机，保证每次渲染的曲线一样。 */
function noise(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** 迷你走势：基线 + 周节律 + 随机游走 + 抖动，偶尔来一个尖峰。 */
function spark(seed: number, trend: number) {
  const out: number[] = []
  let drift = 0
  for (let i = 0; i < TREND_DAYS; i++) {
    const base = 50 + (trend * i * 24) / TREND_DAYS
    const weekly = Math.sin((i * Math.PI * 2) / 7 + seed) * 2.5
    drift = drift * 0.72 + (noise(i, seed) - 0.5) * 7
    const jitter = (noise(i, seed + 17) - 0.5) * 8
    const burst = noise(i, seed + 91) > 0.9 ? (noise(i, seed + 43) - 0.4) * 20 : 0
    out.push(Math.round(base + weekly + drift + jitter + burst))
  }
  return out
}

interface Metric {
  key: string
  label: string
  value: string
  higherIsBetter: boolean
  deltas: { dd: number, ww: number, mm: number, yy: number }
  spark: number[]
}

const OVERVIEW_METRICS: Metric[] = [
  { key: 'active-users', label: 'Active users', value: '1.28M', higherIsBetter: true, deltas: { dd: 0.4, ww: 2.1, mm: 6.4, yy: 18.2 }, spark: spark(1, 1.1) },
  { key: 'new-users', label: 'New users', value: '184.2K', higherIsBetter: true, deltas: { dd: 1.2, ww: 3.8, mm: 9.1, yy: 24.6 }, spark: spark(2, 1.4) },
  { key: 'sessions', label: 'Sessions', value: '4.62M', higherIsBetter: true, deltas: { dd: 0.2, ww: 1.4, mm: 5.2, yy: 15.9 }, spark: spark(3, 0.9) },
  { key: 'avg-session', label: 'Avg. session', value: '6m 42s', higherIsBetter: true, deltas: { dd: -0.3, ww: 0.8, mm: 2.1, yy: -4.3 }, spark: spark(4, 0.3) },
  { key: 'pages-session', label: 'Pages / session', value: '5.3', higherIsBetter: true, deltas: { dd: 0.1, ww: -0.6, mm: 1.2, yy: 3.7 }, spark: spark(5, 0.4) },
  { key: 'bounce', label: 'Bounce rate', value: '38.6%', higherIsBetter: false, deltas: { dd: -0.2, ww: -1.1, mm: -2.4, yy: -6.8 }, spark: spark(6, -0.5) },
  { key: 'dau-mau', label: 'DAU / MAU', value: '52.1%', higherIsBetter: true, deltas: { dd: 0.3, ww: 1, mm: 3.2, yy: 8.4 }, spark: spark(7, 0.7) },
  { key: 'conversion', label: 'Conversion rate', value: '3.84%', higherIsBetter: true, deltas: { dd: -0.1, ww: 0.9, mm: 2.6, yy: 11.2 }, spark: spark(8, 0.6) },
  { key: 'activation', label: 'Activation rate', value: '61.4%', higherIsBetter: true, deltas: { dd: 0.2, ww: 1.3, mm: 4.1, yy: 12.7 }, spark: spark(9, 0.8) },
  { key: 'retention-30', label: '30-day retention', value: '27.4%', higherIsBetter: true, deltas: { dd: 0.1, ww: -0.4, mm: 1.8, yy: 5.3 }, spark: spark(10, -0.3) },
  { key: 'churn', label: 'Churn rate', value: '4.7%', higherIsBetter: false, deltas: { dd: -0.1, ww: -0.5, mm: -1.3, yy: -3.9 }, spark: spark(11, -0.6) },
  { key: 'load-time', label: 'Avg. load time', value: '1.4s', higherIsBetter: false, deltas: { dd: 0.2, ww: 0.6, mm: -2.2, yy: -8.1 }, spark: spark(12, 0.35) },
]

/** 活跃用户趋势：周末流量从桌面端挪到移动端，每天各自抖动，偶尔尖峰。 */
const ACTIVE_TREND = Array.from({ length: TREND_DAYS }, (_, i) => {
  const weekend = i % 7 === 5 || i % 7 === 6
  const spike = noise(i, 61) > 0.88 ? 1 : 0
  return {
    label: `Day ${i + 1}`,
    desktop: Math.round(520 + (i * 90) / TREND_DAYS + (weekend ? -110 : 20) + (noise(i, 11) - 0.5) * 80),
    mobile: Math.round(680 + (i * 150) / TREND_DAYS + (weekend ? 85 : -15) + (noise(i, 23) - 0.5) * 125 + spike * 130),
    tablet: Math.round(140 + (weekend ? 24 : -5) + (noise(i, 37) - 0.5) * 40 + spike * 18),
  }
})

const ACTIVE_SERIES = [
  { key: 'mobile', label: 'Mobile', color: COLORS.blue, hasFill: true },
  { key: 'desktop', label: 'Desktop', color: COLORS.teal, hasFill: true },
  { key: 'tablet', label: 'Tablet', color: COLORS.orange, hasFill: false },
] as const

const CHART = { width: 720, height: 260, left: 44, right: 8, top: 8, bottom: 26 }
const CHART_Y_MAX = 1000

function chartX(i: number) {
  return CHART.left + (i / (TREND_DAYS - 1)) * (CHART.width - CHART.left - CHART.right)
}

function chartY(value: number) {
  const inner = CHART.height - CHART.top - CHART.bottom
  return CHART.top + (1 - value / CHART_Y_MAX) * inner
}

function linePath(pick: (row: typeof ACTIVE_TREND[number]) => number) {
  return ACTIVE_TREND.map((row, i) => `${i === 0 ? 'M' : 'L'}${chartX(i).toFixed(1)},${chartY(pick(row)).toFixed(1)}`).join(' ')
}

function areaPath(pick: (row: typeof ACTIVE_TREND[number]) => number) {
  const baseline = chartY(0).toFixed(1)
  const last = ACTIVE_TREND.length - 1
  return `${linePath(pick)} L${chartX(last).toFixed(1)},${baseline} L${chartX(0).toFixed(1)},${baseline} Z`
}

const Y_TICKS = [0, 250, 500, 750, 1000]
const X_TICKS = [0, 30, 60, 89]

const AGE_DATA = [
  { label: '18–24', value: 26, color: COLORS.blue },
  { label: '25–34', value: 34, color: COLORS.teal },
  { label: '35–44', value: 21, color: COLORS.green },
  { label: '45–54', value: 12, color: COLORS.orange },
  { label: '55+', value: 7, color: COLORS.neutral },
]

const GENDER_DATA = [
  { label: 'Female', value: 48, color: COLORS.purple },
  { label: 'Male', value: 46, color: COLORS.blue },
  { label: 'Other / undisclosed', value: 6, color: COLORS.neutral },
]

const DEVICE_DATA = [
  { label: 'Mobile', value: 58, color: COLORS.blue },
  { label: 'Desktop', value: 34, color: COLORS.teal },
  { label: 'Tablet', value: 8, color: COLORS.orange },
]

interface AcqRow extends Record<string, unknown> {
  id: string
  channel: string
  users: number
  share: number
  delta: number
}

const ACQUISITION: AcqRow[] = [
  { id: 'a1', channel: 'Organic search', users: 486_200, share: 38, delta: 4.2 },
  { id: 'a2', channel: 'Direct', users: 295_400, share: 23, delta: 1.1 },
  { id: 'a3', channel: 'Social', users: 217_800, share: 17, delta: 8.6 },
  { id: 'a4', channel: 'Referral', users: 141_900, share: 11, delta: -2.3 },
  { id: 'a5', channel: 'Email', users: 89_200, share: 7, delta: 3.4 },
  { id: 'a6', channel: 'Paid ads', users: 51_300, share: 4, delta: -1.8 },
]

const ACQ_MAX = Math.max(...ACQUISITION.map(a => a.users))

const RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]
const SEGMENT_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'new', label: 'New users' },
  { value: 'returning', label: 'Returning users' },
]
const DEVICE_OPTIONS = [
  { value: 'all', label: 'All devices' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
]

// ── 状态 ──────────────────────────────────────────────────────────────────────

const range = ref('90d')
const segment = ref('all')
const device = ref('all')

function labelFor(options: { value: string, label: string }[], value: string) {
  return options.find(option => option.value === value)?.label ?? ''
}

const summary = computed(() =>
  [labelFor(SEGMENT_OPTIONS, segment.value), labelFor(DEVICE_OPTIONS, device.value), labelFor(RANGE_OPTIONS, range.value)].join(' · '),
)

// ── 表格列 ────────────────────────────────────────────────────────────────────

function formatNumber(n: number) {
  return n.toLocaleString('en-US')
}

function deltaVariant(value: number) {
  return value === 0 ? 'neutral' : value > 0 ? 'green' : 'red'
}

function deltaLabel(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

const acquisitionColumns: TableColumn<AcqRow>[] = [
  {
    key: 'channel',
    header: 'Channel',
    width: pixel(160),
    renderCell: row => h(Text, { type: 'body', weight: 'semibold' }, () => row.channel),
  },
  {
    key: 'users',
    header: 'Users',
    width: proportional(1),
    renderCell: row => h(VStack, { gap: 1 }, () => [
      h(ProgressBar, { value: row.users, max: ACQ_MAX, label: `${row.channel} users`, isLabelHidden: true }),
      h(Text, { type: 'supporting', color: 'secondary', hasTabularNumbers: true }, () => formatNumber(row.users)),
    ]),
  },
  {
    key: 'share',
    header: 'Share',
    width: pixel(90),
    renderCell: row => h(Text, { type: 'body', hasTabularNumbers: true }, () => `${row.share}%`),
  },
  {
    key: 'delta',
    header: 'w/w',
    width: pixel(100),
    renderCell: row => h(Badge, { variant: deltaVariant(row.delta), label: deltaLabel(row.delta) }),
  },
]

const BREAKDOWNS = [
  { title: 'Age', data: AGE_DATA },
  { title: 'Gender', data: GENDER_DATA },
  { title: 'Device', data: DEVICE_DATA },
]

function sparkPath(data: number[]) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  return data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 32 - ((value - min) / span) * 32
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

function deltaColor(metric: Metric) {
  const trendUp = metric.deltas.ww >= 0
  const favorable = metric.higherIsBetter ? trendUp : !trendUp
  return favorable ? COLORS.green : COLORS.orange
}

function directionColor(metric: Metric) {
  const trendUp = metric.deltas.ww >= 0
  const favorable = metric.higherIsBetter ? trendUp : !trendUp
  return favorable ? 'success' : 'error'
}
</script>

<template>
  <Layout height="fill" :content-width="1440">
    <template #header>
      <LayoutHeader has-divider :padding="6">
        <HStack :gap="3" align="center" justify="between" wrap="wrap">
          <VStack :gap="0">
            <Heading :level="1">
              Data Dashboard
            </Heading>
            <Text type="supporting" color="secondary">
              User analytics overview · {{ summary }}
            </Text>
          </VStack>
          <HStack :gap="1">
            <Selector v-model="range" label="Date range" is-label-hidden :options="RANGE_OPTIONS" />
            <Selector v-model="segment" label="Segment" is-label-hidden :options="SEGMENT_OPTIONS" />
            <Selector v-model="device" label="Device" is-label-hidden :options="DEVICE_OPTIONS" />
            <Button label="Export" variant="secondary">
              <template #icon>
                <Icon icon="upload" size="sm" />
              </template>
            </Button>
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6">
      <VStack :gap="10">
        <VStack :gap="6">
          <HStack :gap="3" align="center" justify="between">
            <HStack :gap="3" align="center">
              <span class="section-tile">
                <Icon icon="i-carbon-user" size="sm" color="secondary" />
              </span>
              <Heading :level="2">
                Key metrics
              </Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Change vs. prior day, week, month, and year
            </Text>
          </HStack>
          <Grid :columns="{ minWidth: 240, repeat: 'fit' }" :gap="3" class="metrics-grid">
            <Card v-for="metric in OVERVIEW_METRICS" :key="metric.key" :padding="4">
              <VStack :gap="4">
                <VStack :gap="1">
                  <Text type="label" color="secondary">
                    {{ metric.label }}
                  </Text>
                  <HStack :gap="2" align="center">
                    <Heading :level="1" :accessibility-level="3">
                      {{ metric.value }}
                    </Heading>
                    <Icon
                      :icon="metric.deltas.ww >= 0 ? 'arrowUp' : 'arrowDown'"
                      size="sm"
                      :color="directionColor(metric)"
                    />
                  </HStack>
                </VStack>
                <svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
                  <path
                    :d="sparkPath(metric.spark)"
                    fill="none"
                    :stroke="deltaColor(metric)"
                    stroke-width="1.25"
                    vector-effect="non-scaling-stroke"
                  />
                </svg>
                <Grid :columns="2" :gap="2">
                  <Text type="body" weight="bold">
                    {{ metric.deltas.dd > 0 ? '+' : '' }}{{ metric.deltas.dd.toFixed(1) }}%
                    <Text type="body" display="inline" weight="normal" color="secondary">
                      d/d
                    </Text>
                  </Text>
                  <Text type="body" weight="bold">
                    {{ metric.deltas.ww > 0 ? '+' : '' }}{{ metric.deltas.ww.toFixed(1) }}%
                    <Text type="body" display="inline" weight="normal" color="secondary">
                      w/w
                    </Text>
                  </Text>
                  <Text type="body" weight="bold">
                    {{ metric.deltas.mm > 0 ? '+' : '' }}{{ metric.deltas.mm.toFixed(1) }}%
                    <Text type="body" display="inline" weight="normal" color="secondary">
                      m/m
                    </Text>
                  </Text>
                  <Text type="body" weight="bold">
                    {{ metric.deltas.yy > 0 ? '+' : '' }}{{ metric.deltas.yy.toFixed(1) }}%
                    <Text type="body" display="inline" weight="normal" color="secondary">
                      y/y
                    </Text>
                  </Text>
                </Grid>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="3" align="center" justify="between">
            <HStack :gap="3" align="center">
              <span class="section-tile">
                <Icon icon="i-carbon-cursor-1" size="sm" color="secondary" />
              </span>
              <Heading :level="2">
                Devices
              </Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Daily active users (thousands)
            </Text>
          </HStack>
          <Card :padding="6">
            <VStack :gap="6">
              <Text type="label">
                Daily active users by device type
              </Text>
              <svg class="trend-chart" :viewBox="`0 0 ${CHART.width} ${CHART.height}`" role="img" aria-label="Daily active users by device type">
                <defs>
                  <linearGradient id="au-mobile" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" :stop-color="COLORS.blue" stop-opacity="0.3" />
                    <stop offset="95%" :stop-color="COLORS.blue" stop-opacity="0.04" />
                  </linearGradient>
                  <linearGradient id="au-desktop" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" :stop-color="COLORS.teal" stop-opacity="0.3" />
                    <stop offset="95%" :stop-color="COLORS.teal" stop-opacity="0.04" />
                  </linearGradient>
                </defs>

                <line
                  v-for="tick in Y_TICKS"
                  :key="`grid-${tick}`"
                  :x1="CHART.left"
                  :x2="CHART.width - CHART.right"
                  :y1="chartY(tick)"
                  :y2="chartY(tick)"
                  class="chart-grid"
                />
                <text
                  v-for="tick in Y_TICKS"
                  :key="`y-${tick}`"
                  :x="CHART.left - 8"
                  :y="chartY(tick) + 4"
                  text-anchor="end"
                  class="chart-tick"
                >
                  {{ tick }}K
                </text>
                <text
                  v-for="tick in X_TICKS"
                  :key="`x-${tick}`"
                  :x="chartX(tick)"
                  :y="CHART.height - 6"
                  text-anchor="middle"
                  class="chart-tick"
                >
                  {{ ACTIVE_TREND[tick].label }}
                </text>

                <path :d="areaPath(row => row.mobile)" fill="url(#au-mobile)" />
                <path :d="areaPath(row => row.desktop)" fill="url(#au-desktop)" />
                <path :d="linePath(row => row.tablet)" fill="none" :stroke="COLORS.orange" stroke-width="1.5" />
                <path :d="linePath(row => row.mobile)" fill="none" :stroke="COLORS.blue" stroke-width="1.5" />
                <path :d="linePath(row => row.desktop)" fill="none" :stroke="COLORS.teal" stroke-width="1.5" />
              </svg>
              <HStack :gap="5" align="center" wrap="wrap">
                <HStack v-for="series in ACTIVE_SERIES" :key="series.key" :gap="2" align="center">
                  <span class="legend-dot" :style="{ background: series.color }" />
                  <Text type="supporting" color="secondary">
                    {{ series.label }}
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Card>
        </VStack>

        <Divider />

        <VStack :gap="6">
          <HStack :gap="3" align="center" justify="between">
            <HStack :gap="3" align="center">
              <span class="section-tile">
                <Icon icon="i-carbon-user-multiple" size="sm" color="secondary" />
              </span>
              <Heading :level="2">
                Audience demographics
              </Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Share of active users
            </Text>
          </HStack>
          <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
            <Card v-for="breakdown in BREAKDOWNS" :key="breakdown.title" :padding="4">
              <VStack :gap="4">
                <Heading :level="4" :accessibility-level="3">
                  {{ breakdown.title }}
                </Heading>
                <div class="breakdown-bar">
                  <div
                    v-for="seg in breakdown.data"
                    :key="seg.label"
                    class="breakdown-bar__seg"
                    :style="{ width: `${seg.value}%`, background: seg.color }"
                  />
                </div>
                <VStack :gap="2">
                  <HStack v-for="seg in breakdown.data" :key="seg.label" justify="between" align="center">
                    <HStack :gap="2" align="center">
                      <span class="legend-dot" :style="{ background: seg.color }" />
                      <Text type="supporting" color="secondary">
                        {{ seg.label }}
                      </Text>
                    </HStack>
                    <Text type="supporting" weight="semibold">
                      {{ seg.value }}%
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="3" align="center" justify="between">
            <Heading :level="2">
              Acquisition channels
            </Heading>
            <Text type="supporting" color="secondary">
              How users find the product
            </Text>
          </HStack>
          <Card>
            <Table :data="ACQUISITION" :columns="acquisitionColumns" id-key="id" density="balanced" dividers="rows" has-hover />
          </Card>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.metrics-grid {
  align-items: stretch;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
.section-tile {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: var(--astryx-radius-element);
  background: var(--astryx-color-background-muted);
}
.spark { width: 100%; height: 48px; display: block; }
.trend-chart { width: 100%; height: 280px; display: block; }
.chart-grid { stroke: var(--astryx-color-border, rgb(5 54 89 / 10%)); stroke-width: 1; }
.chart-tick { fill: var(--astryx-color-text-secondary, #4E606F); font-size: 12px; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex: none; }
.breakdown-bar { display: flex; width: 100%; height: 12px; border-radius: 4px; overflow: hidden; }
.breakdown-bar__seg { height: 100%; }
</style>
