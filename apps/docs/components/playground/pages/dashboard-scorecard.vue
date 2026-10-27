<script setup lang="ts">
import {
  Avatar,
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
  LayoutPanel,
  ProgressBar,
  SegmentedControl,
  SegmentedControlItem,
  StackItem,
  Text,
  Timestamp,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { computed, onBeforeUnmount, ref } from 'vue'

type Period = 'WoW' | 'MoM' | 'QoQ'
type Rag = 'green' | 'amber' | 'red'

interface Kpi {
  key: string
  label: string
  value: string
  delta: Record<Period, number>
  higherIsBetter: boolean
}

interface Okr {
  objective: string
  owner: string
  actual: number
  target: number
  unit: string
}

interface TrendSeries {
  key: string
  title: string
  unit: string
  color: string
  kind: 'area' | 'line'
  data: { t: number, label: string, current: number, prior: number }[]
}

interface Callout {
  status: 'success' | 'warning' | 'info'
  title: string
  detail: string
}

const COLORS = {
  blue: 'var(--astryx-color-data-categorical-blue, #0171E3)',
  green: 'var(--astryx-color-data-categorical-green, #0B991F)',
  orange: 'var(--astryx-color-data-categorical-orange, #EB6E00)',
  purple: 'var(--astryx-color-data-categorical-purple, #6B1EFD)',
  prior: 'var(--astryx-color-text-secondary, #737373)',
}

const PERIOD_SUBTITLE: Record<Period, string> = {
  WoW: 'Week of Jun 23 – Jun 29, 2026 vs. prior week',
  MoM: 'June 2026 vs. May 2026',
  QoQ: 'Q2 2026 vs. Q1 2026',
}

const KPIS: Kpi[] = [
  { key: 'revenue', label: 'Net revenue', value: '$4.82M', delta: { WoW: 2.4, MoM: 6.1, QoQ: 14.3 }, higherIsBetter: true },
  { key: 'arr', label: 'ARR', value: '$58.1M', delta: { WoW: 1.1, MoM: 3.8, QoQ: 11.2 }, higherIsBetter: true },
  { key: 'nrr', label: 'Net revenue retention', value: '112%', delta: { WoW: 0.3, MoM: -0.8, QoQ: 2.1 }, higherIsBetter: true },
  { key: 'churn', label: 'Gross churn', value: '1.9%', delta: { WoW: 0.4, MoM: 1.6, QoQ: -0.7 }, higherIsBetter: false },
  { key: 'cac', label: 'CAC payback', value: '14.2 mo', delta: { WoW: -0.2, MoM: -3.4, QoQ: -8.1 }, higherIsBetter: false },
  { key: 'nps', label: 'NPS', value: '48', delta: { WoW: 1.0, MoM: 4.0, QoQ: 6.0 }, higherIsBetter: true },
]

const OKRS: Okr[] = [
  { objective: 'Reach $60M ARR', owner: 'Dana Whitfield · CRO', actual: 58.1, target: 60, unit: 'M' },
  { objective: 'Expand into 3 new enterprise verticals', owner: 'Marcus Lin · VP Sales', actual: 2, target: 3, unit: '' },
  { objective: 'Ship AI copilot GA', owner: 'Priya Raman · VP Product', actual: 82, target: 100, unit: '%' },
  { objective: 'Improve gross margin to 78%', owner: 'Tom Okafor · CFO', actual: 75.4, target: 78, unit: '%' },
]

const WEEK_LABELS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']

function makeTrend(base: number, growth: number, priorGap: number, wobble: number) {
  return WEEK_LABELS.map((label, i) => {
    const drift = base * (1 + (growth * i) / 11)
    const current = Math.round(drift + Math.sin(i * 1.3) * base * wobble)
    return { t: i, label, current, prior: Math.round(current * (1 - priorGap)) }
  })
}

const TRENDS: TrendSeries[] = [
  { key: 'revenue', title: 'Net revenue', unit: 'k', color: COLORS.blue, kind: 'area', data: makeTrend(980, 0.24, 0.12, 0.03) },
  { key: 'pipeline', title: 'Qualified pipeline', unit: 'k', color: COLORS.green, kind: 'area', data: makeTrend(3200, 0.31, 0.18, 0.05) },
  { key: 'activation', title: 'Activation rate', unit: '%', color: COLORS.purple, kind: 'line', data: makeTrend(42, 0.28, 0.09, 0.04) },
  { key: 'support', title: 'Support CSAT', unit: '%', color: COLORS.orange, kind: 'line', data: makeTrend(88, 0.06, 0.03, 0.02) },
]

const NARRATIVE: Record<Period, Callout[]> = {
  WoW: [
    { status: 'success', title: 'Net revenue up 2.4% week-over-week', detail: 'Driven by three enterprise renewals closing early in the East region; expansion ARR contributed 60% of the lift.' },
    { status: 'warning', title: 'Gross churn ticked up 0.4 points', detail: 'Two mid-market logos churned on price; both flagged in QBRs last month. Save-play in motion for the remaining at-risk cohort.' },
    { status: 'info', title: 'CAC payback holding at 14.2 months', detail: 'Paid acquisition efficiency steady; the shift toward partner-sourced pipeline is starting to show in blended CAC.' },
  ],
  MoM: [
    { status: 'success', title: 'Revenue accelerating: +6.1% month-over-month', detail: 'Second consecutive month of accelerating growth. New-logo bookings and expansion both above plan; net-new pipeline covers 3.2x of next quarter target.' },
    { status: 'warning', title: 'NRR dipped 0.8 points to 112%', detail: 'A seasonal downgrade cycle in the SMB segment pulled retention down slightly. Enterprise NRR remains above 120%.' },
    { status: 'success', title: 'CAC payback improved 3.4 points', detail: 'Sales efficiency gains from the new SDR playbook are compounding; payback now inside the 15-month board target.' },
  ],
  QoQ: [
    { status: 'success', title: 'Strong quarter: revenue +14.3%, ARR +11.2%', detail: 'Best quarter on record for net-new ARR. Two of three new verticals landed anchor customers; the AI copilot beta is converting at 2x the baseline trial rate.' },
    { status: 'success', title: 'Churn down 0.7 points quarter-over-quarter', detail: 'Retention initiatives launched in Q1 are paying off; gross churn at a two-year low and NRR up 2.1 points.' },
    { status: 'warning', title: 'Gross margin at 75.4%, short of the 78% goal', detail: 'Infrastructure cost from the AI copilot GA ramp is the primary drag. Finance projects margin recovery once usage-based pricing lands next quarter.' },
  ],
}

const CALLOUT_ICON: Record<Callout['status'], string> = {
  success: 'success',
  warning: 'warning',
  info: 'info',
}

const CALLOUT_ICON_COLOR: Record<Callout['status'], 'success' | 'warning' | 'accent'> = {
  success: 'success',
  warning: 'warning',
  info: 'accent',
}

const CALLOUT_LABEL: Record<Callout['status'], string> = {
  success: 'Positive',
  warning: 'Needs attention',
  info: 'Context',
}

/** Delta 的方向和幅度决定图标与配色：方向有利且幅度大是绿，方向不利且幅度大是红。 */
function ragFor(deltaPct: number, higherIsBetter: boolean): Rag {
  const favorable = higherIsBetter ? deltaPct >= 0 : deltaPct <= 0
  const magnitude = Math.abs(deltaPct)
  if (favorable)
    return magnitude >= 1 ? 'green' : 'amber'
  return magnitude >= 3 ? 'red' : 'amber'
}

function okrRag(pct: number): Rag {
  if (pct >= 90)
    return 'green'
  if (pct >= 70)
    return 'amber'
  return 'red'
}

const RAG_ICON = { green: 'success', amber: 'warning', red: 'error' } as const
const RAG_PROGRESS = { green: 'success', amber: 'warning', red: 'error' } as const

const period = ref<Period>('WoW')
const isNarrow = useMediaQuery('(max-width: 1024px)')

const subtitle = computed(() => PERIOD_SUBTITLE[period.value])
const callouts = computed(() => NARRATIVE[period.value])
const okrSummary = computed(() => {
  const onTrack = OKRS.filter(okr => (okr.actual / okr.target) * 100 >= 90).length
  return `${onTrack} of ${OKRS.length} on track`
})

function deltaText(delta: number): string {
  return `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
}

function deltaIcon(delta: number): string {
  if (delta === 0)
    return 'chevronRight'
  return delta < 0 ? 'arrowDown' : 'arrowUp'
}

function okrPercent(okr: Okr): number {
  return Math.round((okr.actual / okr.target) * 100)
}

function ownerName(owner: string): string {
  return owner.split('·')[0].trim()
}

function trendDelta(trend: TrendSeries): number {
  const latest = trend.data[trend.data.length - 1]
  return Math.round(((latest.current - latest.prior) / latest.prior) * 100)
}

/** 图表画布高度 200，左侧留给 y 轴刻度，底部留给 x 轴标签。 */
const CHART = { h: 200, padLeft: 40, padRight: 8, padTop: 5, padBottom: 30 }
const CHART_INNER_H = CHART.h - CHART.padTop - CHART.padBottom
const X_TICKS = [0, 3, 7, 11]

/** 四张卡片宽度相同，只量第一张；viewBox 和像素一比一，图撑满卡片也不会被拉伸。 */
const chartWidth = ref(360)
const chartInnerW = computed(() => chartWidth.value - CHART.padLeft - CHART.padRight)
let chartObserver: ResizeObserver | null = null
function bindChart(el: unknown, index: number) {
  if (index !== 0 || !(el instanceof SVGSVGElement) || chartObserver || typeof ResizeObserver === 'undefined')
    return
  chartObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0)
      chartWidth.value = entry.contentRect.width
  })
  chartObserver.observe(el)
}
onBeforeUnmount(() => chartObserver?.disconnect())

/**
 * 0 起步、一共 5 个刻度的 y 轴，步长和 recharts 默认的取整规则一致：
 * 原始步长按数量级取 0.05（个位数时取 0.1）的整数倍再向上取整。
 */
function niceTicks(max: number): number[] {
  const raw = max / 4
  const digits = Math.floor(Math.log10(raw)) + 1
  const unit = 10 ** digits * (digits === 1 ? 0.1 : 0.05)
  const step = Math.ceil(raw / unit) * unit
  return [0, 1, 2, 3, 4].map(i => Math.round(i * step * 100) / 100)
}

/** 单调三次样条（等价于 recharts 的 monotone 曲线），返回 SVG 路径。 */
function monotonePath(pts: { x: number, y: number }[]): string {
  const n = pts.length
  const dx: number[] = []
  const slope: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1].x - pts[i].x)
    slope.push((pts[i + 1].y - pts[i].y) / dx[i])
  }
  const m: number[] = [slope[0]]
  for (let i = 1; i < n - 1; i++)
    m.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2)
  m.push(slope[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (slope[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / slope[i]
    const b = m[i + 1] / slope[i]
    const h = Math.hypot(a, b)
    if (h > 3) {
      m[i] = (3 * a / h) * slope[i]
      m[i + 1] = (3 * b / h) * slope[i]
    }
  }
  let d = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`
  for (let i = 0; i < n - 1; i++) {
    const w = dx[i] / 3
    d += `C${(pts[i].x + w).toFixed(1)},${(pts[i].y + m[i] * w).toFixed(1)},${(pts[i + 1].x - w).toFixed(1)},${(pts[i + 1].y - m[i + 1] * w).toFixed(1)},${pts[i + 1].x.toFixed(1)},${pts[i + 1].y.toFixed(1)}`
  }
  return d
}

/** 一张趋势卡的几何：网格刻度、x 轴标签、当前期曲线（含面积）和上期虚线。 */
function trendGeometry(trend: TrendSeries) {
  const max = Math.max(...trend.data.flatMap(row => [row.current, row.prior]))
  const ticks = niceTicks(max)
  const top = ticks[ticks.length - 1]
  const x = (i: number) => CHART.padLeft + (i / 11) * chartInnerW.value
  const y = (v: number) => CHART.padTop + CHART_INNER_H - (v / top) * CHART_INNER_H
  const curve = (key: 'current' | 'prior') => monotonePath(trend.data.map((row, i) => ({ x: x(i), y: y(row[key]) })))
  const current = curve('current')
  const baseline = CHART.padTop + CHART_INNER_H
  return {
    yTicks: ticks.map(value => ({ value, y: y(value) })),
    xTicks: X_TICKS.map(i => ({ label: WEEK_LABELS[i], x: x(i) })),
    current,
    prior: curve('prior'),
    area: `${current}L${x(11).toFixed(1)},${baseline}L${x(0).toFixed(1)},${baseline}Z`,
    baseline,
  }
}
</script>

<template>
  <Layout height="fill" :content-width="1440">
    <template #header>
      <LayoutHeader :padding="6" has-divider>
        <HStack :gap="3" align="center" h-align="between" wrap="wrap">
          <VStack :gap="1">
            <Heading :level="1">
              Weekly Business Review
            </Heading>
            <HStack :gap="2" align="center">
              <Text type="body" color="secondary">
                {{ subtitle }}
              </Text>
              <Text type="body" color="secondary">
                · Generated
              </Text>
              <Timestamp value="2026-06-30T08:00:00Z" format="date" type="body" color="secondary" />
            </HStack>
          </VStack>
          <HStack :gap="3" align="center">
            <SegmentedControl v-model="period" label="Comparison period">
              <SegmentedControlItem label="WoW" value="WoW" />
              <SegmentedControlItem label="MoM" value="MoM" />
              <SegmentedControlItem label="QoQ" value="QoQ" />
            </SegmentedControl>
            <Button label="Export" variant="secondary">
              <template #icon>
                <Icon name="heroicons:arrow-down-tray" size="sm" />
              </template>
            </Button>
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6" class="page-content">
      <VStack :gap="10">
        <VStack v-if="isNarrow" :gap="6">
          <HStack :gap="3" align="center" h-align="between">
            <Heading :level="2">
              What changed &amp; why
            </Heading>
            <Text type="supporting" color="secondary">
              AI summary
            </Text>
          </HStack>
          <VStack :gap="2">
            <Card v-for="callout in callouts" :key="callout.title" :padding="5">
              <HStack :gap="3" align="start">
                <Icon
                  :icon="CALLOUT_ICON[callout.status]"
                  :color="CALLOUT_ICON_COLOR[callout.status]"
                  size="md"
                  :label="CALLOUT_LABEL[callout.status]"
                />
                <StackItem size="fill">
                  <VStack :gap="1">
                    <Heading :level="4">
                      {{ callout.title }}
                    </Heading>
                    <Text type="body" color="secondary">
                      {{ callout.detail }}
                    </Text>
                  </VStack>
                </StackItem>
              </HStack>
            </Card>
          </VStack>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="3" align="center" h-align="between">
            <Heading :level="2">
              Scorecards
            </Heading>
            <Text type="supporting" color="secondary">
              Performance metrics
            </Text>
          </HStack>
          <Grid :gap="2" class="scorecard-grid">
            <Card v-for="kpi in KPIS" :key="kpi.key" :padding="5">
              <VStack :gap="1">
                <Text type="label" color="secondary">
                  {{ kpi.label }}
                </Text>
                <HStack :gap="4" align="center">
                  <Heading :level="2">
                    {{ kpi.value }}
                  </Heading>
                  <HStack :gap="2" align="center">
                    <Text type="body" color="secondary">
                      {{ deltaText(kpi.delta[period]) }}
                    </Text>
                    <Icon
                      :icon="deltaIcon(kpi.delta[period])"
                      size="xsm"
                      :color="RAG_ICON[ragFor(kpi.delta[period], kpi.higherIsBetter)]"
                    />
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="3" align="center" h-align="between">
            <Heading :level="2">
              Goal attainment
            </Heading>
            <Text type="supporting" color="secondary">
              {{ okrSummary }}
            </Text>
          </HStack>
          <Card :padding="6">
            <VStack :gap="6">
              <template v-for="(okr, i) in OKRS" :key="okr.objective">
                <Divider v-if="i > 0" />
                <VStack :gap="2">
                  <HStack h-align="between" align="center" :gap="3">
                    <StackItem size="fill">
                      <Heading :level="4">
                        {{ okr.objective }}
                      </Heading>
                    </StackItem>
                    <Text type="supporting" color="secondary">
                      {{ okrPercent(okr) }}%
                    </Text>
                  </HStack>
                  <ProgressBar
                    :value="okr.actual"
                    :max="okr.target"
                    :variant="RAG_PROGRESS[okrRag(okrPercent(okr))]"
                    :label="okr.objective"
                    is-label-hidden
                  />
                  <HStack h-align="between" align="center" :gap="4">
                    <HStack :gap="2" align="center">
                      <Avatar size="sm" :name="ownerName(okr.owner)" />
                      <Text type="supporting" color="secondary">
                        {{ okr.owner }}
                      </Text>
                    </HStack>
                    <Text type="supporting" color="secondary">
                      {{ okr.actual }}{{ okr.unit }} / {{ okr.target }}{{ okr.unit }} target
                    </Text>
                  </HStack>
                </VStack>
              </template>
            </VStack>
          </Card>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="3" align="center" h-align="between">
            <Heading :level="2">
              Trends
            </Heading>
            <Text type="supporting" color="secondary">
              Current vs. prior period · trailing 12 weeks
            </Text>
          </HStack>
          <Grid :columns="{ minWidth: 330, repeat: 'fit' }" :gap="3">
            <Card v-for="(trend, index) in TRENDS" :key="trend.key" :padding="5">
              <VStack :gap="6">
                <HStack h-align="between" align="center">
                  <HStack :gap="2">
                    <Heading :level="3">
                      {{ trend.title }}
                    </Heading>
                    <Heading :level="3" color="secondary">
                      {{ trend.data[trend.data.length - 1].current.toLocaleString('en-US') }}{{ trend.unit }}
                    </Heading>
                  </HStack>
                  <Text type="supporting" color="secondary">
                    {{ trendDelta(trend) >= 0 ? '+' : '' }}{{ trendDelta(trend) }}% vs prior
                  </Text>
                </HStack>
                <svg
                  :ref="(el: unknown) => bindChart(el, index)"
                  class="trend-chart"
                  :viewBox="`0 0 ${chartWidth} ${CHART.h}`"
                  role="img"
                  :aria-label="trend.title"
                >
                  <defs>
                    <linearGradient :id="`grad-${trend.key}`" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" :stop-color="trend.color" stop-opacity="0.3" />
                      <stop offset="95%" :stop-color="trend.color" stop-opacity="0.04" />
                    </linearGradient>
                  </defs>
                  <g v-for="tick in trendGeometry(trend).yTicks" :key="tick.value">
                    <line :x1="CHART.padLeft" :x2="chartWidth - CHART.padRight" :y1="tick.y" :y2="tick.y" class="chart-grid" />
                    <text :x="CHART.padLeft - 8" :y="tick.y" text-anchor="end" dominant-baseline="middle" class="chart-tick">{{ tick.value }}</text>
                  </g>
                  <text
                    v-for="tick in trendGeometry(trend).xTicks"
                    :key="tick.label"
                    :x="tick.x"
                    :y="CHART.h - 8"
                    :text-anchor="tick.label === 'W1' ? 'start' : tick.label === 'W12' ? 'end' : 'middle'"
                    class="chart-tick"
                  >{{ tick.label }}</text>
                  <path v-if="trend.kind === 'area'" :d="trendGeometry(trend).area" :fill="`url(#grad-${trend.key})`" />
                  <path :d="trendGeometry(trend).prior" fill="none" :stroke="COLORS.prior" stroke-width="1" stroke-dasharray="4 4" />
                  <path :d="trendGeometry(trend).current" fill="none" :stroke="trend.color" stroke-width="2" />
                </svg>
                <HStack :gap="5" align="center">
                  <HStack :gap="2" align="center">
                    <span class="legend-swatch" :style="{ backgroundColor: trend.color }" aria-hidden="true" />
                    <Text type="supporting" color="secondary">
                      Current
                    </Text>
                  </HStack>
                  <HStack :gap="2" align="center">
                    <span class="legend-swatch" :style="{ backgroundColor: COLORS.prior }" aria-hidden="true" />
                    <Text type="supporting" color="secondary">
                      Prior
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </Grid>
        </VStack>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow" #end>
      <LayoutPanel :width="400" :padding="6" has-divider role="complementary" label="What changed and why">
        <VStack :gap="6">
          <HStack :gap="3" align="center" h-align="between">
            <Heading :level="2">
              What changed &amp; why
            </Heading>
            <Text type="supporting" color="secondary">
              AI summary
            </Text>
          </HStack>
          <VStack :gap="2">
            <Card v-for="callout in callouts" :key="callout.title" :padding="5">
              <HStack :gap="3" align="start">
                <Icon
                  :icon="CALLOUT_ICON[callout.status]"
                  :color="CALLOUT_ICON_COLOR[callout.status]"
                  size="md"
                  :label="CALLOUT_LABEL[callout.status]"
                />
                <StackItem size="fill">
                  <VStack :gap="1">
                    <Heading :level="4">
                      {{ callout.title }}
                    </Heading>
                    <Text type="body" color="secondary">
                      {{ callout.detail }}
                    </Text>
                  </VStack>
                </StackItem>
              </HStack>
            </Card>
          </VStack>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.legend-swatch {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.scorecard-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.page-content {
  padding-bottom: var(--astryx-spacing-10);
}
.trend-chart {
  width: 100%;
  height: 200px;
  display: block;
}
.chart-grid {
  stroke: var(--astryx-color-border, rgba(5, 54, 89, 0.1));
  stroke-width: 1;
}
.chart-tick {
  fill: var(--astryx-color-text-secondary, #4E606F);
  font-size: 12px;
}
</style>
