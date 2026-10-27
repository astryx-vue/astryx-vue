<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, defineComponent, h, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  Badge,
  Card,
  Divider,
  EmptyState,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutPanel,
  List,
  ListItem,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  StackItem,
  StatusDot,
  Text,
  Timestamp,
  Token,
  VStack,
  useMediaQuery,
} from '@astryx-vue/core'
import { PlaygroundSparkline } from '@astryx-vue/playground-charts'

type TimeWindow = '1h' | '1d' | '7d'
type Environment = 'production' | 'staging' | 'development'
type HealthStatus = 'healthy' | 'warning' | 'critical'

const pageStyle: CSSProperties = { height: '100dvh' }

const ENV_OPTIONS = [
  { value: 'production', label: 'Production' },
  { value: 'staging', label: 'Staging' },
  { value: 'development', label: 'Development' },
]

const REGION_OPTIONS = [
  { value: 'all', label: 'All regions' },
  { value: 'us-east-1', label: 'us-east-1' },
  { value: 'us-west-2', label: 'us-west-2' },
  { value: 'eu-west-1', label: 'eu-west-1' },
  { value: 'ap-southeast-1', label: 'ap-southeast-1' },
]

const KPI_BY_ENV: Record<Environment, Array<{ key: string, label: string, value: string, status: HealthStatus, delta: string, deltaPositive: boolean }>> = {
  production: [
    { key: 'health', label: 'Overall health', value: '98.6%', status: 'healthy', delta: '+0.3%', deltaPositive: true },
    { key: 'error', label: 'Error rate', value: '1.84%', status: 'warning', delta: '+0.9%', deltaPositive: false },
    { key: 'latency', label: 'p99 latency', value: '512 ms', status: 'warning', delta: '+84 ms', deltaPositive: false },
    { key: 'availability', label: 'Availability', value: '99.98%', status: 'healthy', delta: '+0.01%', deltaPositive: true },
  ],
  staging: [
    { key: 'health', label: 'Overall health', value: '99.4%', status: 'healthy', delta: '+0.1%', deltaPositive: true },
    { key: 'error', label: 'Error rate', value: '0.42%', status: 'healthy', delta: '-0.2%', deltaPositive: true },
    { key: 'latency', label: 'p99 latency', value: '338 ms', status: 'healthy', delta: '-12 ms', deltaPositive: true },
    { key: 'availability', label: 'Availability', value: '99.95%', status: 'healthy', delta: '0.00%', deltaPositive: true },
  ],
  development: [
    { key: 'health', label: 'Overall health', value: '96.1%', status: 'warning', delta: '-1.8%', deltaPositive: false },
    { key: 'error', label: 'Error rate', value: '3.10%', status: 'critical', delta: '+1.4%', deltaPositive: false },
    { key: 'latency', label: 'p99 latency', value: '274 ms', status: 'healthy', delta: '-30 ms', deltaPositive: true },
    { key: 'availability', label: 'Availability', value: '99.20%', status: 'warning', delta: '-0.6%', deltaPositive: false },
  ],
}

const SPARKLINES: Record<string, number[]> = {
  health: [97.6, 97.7, 98, 96.5, 97.3, 97, 96.8, 97.2, 95, 96.3, 96.8, 97.1, 96.7, 97.3, 96.1, 96.9, 97.2, 96.5, 97.4, 98.6],
  error: [0.62, 0.98, 1.02, 2.41, 1.57, 0.96, 1.43, 1.36, 1.33, 1.48, 1.41, 1.36, 1.35, 1.19, 1.27, 1.2, 1.26, 1.09, 1.84, 1.75],
  latency: [322, 371, 313, 617, 377, 399, 421, 365, 797, 477, 380, 569, 389, 417, 376, 871, 411, 437, 512, 503],
  availability: [99.891, 99.956, 99.882, 99.696, 99.913, 99.948, 99.921, 99.94, 99.551, 99.891, 99.926, 99.912, 99.739, 99.912, 99.426, 99.928, 99.856, 99.98, 99.98, 99.98],
}

const STATUS_STROKE: Record<HealthStatus, string> = {
  healthy: 'var(--astryx-color-success, #0B991F)',
  warning: 'var(--astryx-color-warning, #B25000)',
  critical: 'var(--astryx-color-error, #D6002A)',
}

type AlertState = 'firing' | 'acknowledged' | 'resolved'

const ALERTS = [
  { id: 'AL-8842', severity: 'critical' as HealthStatus, title: 'search-indexer 5xx rate above 5%', service: 'search-indexer · us-east-1', at: '2026-06-30T21:14:00Z', state: 'firing' as AlertState },
  { id: 'AL-8841', severity: 'warning' as HealthStatus, title: 'checkout-api p99 latency above 500ms', service: 'checkout-api · us-east-1', at: '2026-06-30T21:02:00Z', state: 'firing' as AlertState },
  { id: 'AL-8840', severity: 'warning' as HealthStatus, title: 'edge-cdn cache hit ratio degraded', service: 'edge-cdn · eu-west-1', at: '2026-06-30T20:41:00Z', state: 'acknowledged' as AlertState },
  { id: 'AL-8839', severity: 'critical' as HealthStatus, title: 'auth error rate spike in dev cluster', service: 'auth · us-west-2', at: '2026-06-30T20:18:00Z', state: 'acknowledged' as AlertState },
  { id: 'AL-8838', severity: 'warning' as HealthStatus, title: 'notifications queue depth climbing', service: 'notifications · ap-southeast-1', at: '2026-06-30T19:55:00Z', state: 'firing' as AlertState },
  { id: 'AL-8837', severity: 'warning' as HealthStatus, title: 'payments settlement job heartbeat missed', service: 'payments · us-east-1', at: '2026-06-30T18:30:00Z', state: 'resolved' as AlertState },
]

const ALERT_ORDER: AlertState[] = ['firing', 'acknowledged', 'resolved']
const ALERT_STATE_TOKEN: Record<AlertState, { label: string, color: 'red' | 'yellow' | 'green' }> = {
  firing: { label: 'Firing', color: 'red' },
  acknowledged: { label: 'Ack', color: 'yellow' },
  resolved: { label: 'Resolved', color: 'green' },
}

const HOST_ROWS = [
  { id: '1', service: 'checkout-api', environment: 'production' as Environment, region: 'us-east-1', instances: 24, rpm: 9240, errorRate: 2.1, p99: 512, status: 'warning' as HealthStatus },
  { id: '2', service: 'checkout-api', environment: 'production' as Environment, region: 'us-west-2', instances: 18, rpm: 6110, errorRate: 0.3, p99: 214, status: 'healthy' as HealthStatus },
  { id: '3', service: 'checkout-api', environment: 'production' as Environment, region: 'eu-west-1', instances: 12, rpm: 3980, errorRate: 0.4, p99: 236, status: 'healthy' as HealthStatus },
  { id: '4', service: 'search-indexer', environment: 'production' as Environment, region: 'us-east-1', instances: 16, rpm: 4120, errorRate: 5.8, p99: 1180, status: 'critical' as HealthStatus },
  { id: '5', service: 'search-indexer', environment: 'production' as Environment, region: 'ap-southeast-1', instances: 8, rpm: 2040, errorRate: 0.9, p99: 342, status: 'healthy' as HealthStatus },
  { id: '6', service: 'payments', environment: 'production' as Environment, region: 'us-east-1', instances: 20, rpm: 5310, errorRate: 0.2, p99: 188, status: 'healthy' as HealthStatus },
  { id: '7', service: 'payments', environment: 'production' as Environment, region: 'eu-west-1', instances: 10, rpm: 2760, errorRate: 0.2, p99: 205, status: 'healthy' as HealthStatus },
  { id: '8', service: 'edge-cdn', environment: 'production' as Environment, region: 'eu-west-1', instances: 30, rpm: 14820, errorRate: 1.6, p99: 402, status: 'warning' as HealthStatus },
  { id: '9', service: 'auth', environment: 'production' as Environment, region: 'us-west-2', instances: 14, rpm: 4530, errorRate: 0.1, p99: 96, status: 'healthy' as HealthStatus },
  { id: '10', service: 'notifications', environment: 'production' as Environment, region: 'ap-southeast-1', instances: 6, rpm: 1210, errorRate: 0.5, p99: 268, status: 'healthy' as HealthStatus },
  { id: '11', service: 'checkout-api', environment: 'staging' as Environment, region: 'us-east-1', instances: 3, rpm: 420, errorRate: 0.4, p99: 198, status: 'healthy' as HealthStatus },
  { id: '12', service: 'search-indexer', environment: 'staging' as Environment, region: 'us-east-1', instances: 2, rpm: 180, errorRate: 1.1, p99: 356, status: 'warning' as HealthStatus },
  { id: '13', service: 'checkout-api', environment: 'development' as Environment, region: 'us-west-2', instances: 1, rpm: 44, errorRate: 3.2, p99: 274, status: 'warning' as HealthStatus },
  { id: '14', service: 'auth', environment: 'development' as Environment, region: 'us-west-2', instances: 1, rpm: 38, errorRate: 6.4, p99: 512, status: 'critical' as HealthStatus },
]

// ── 图表 ──────────────────────────────────────────────────────────────────────
// 内联 SVG：锯齿状时间序列 + 坐标轴 + 图例，形状由固定种子的伪随机生成。

/** 两张图并排、一样宽；`width` 跟着第一张图的实际宽度走，viewBox 和像素一比一。 */
const CHART = reactive({ width: 640, height: 280, left: 56, right: 16, top: 12, bottom: 34 })
const chartEl = ref<SVGSVGElement | null>(null)
let chartObserver: ResizeObserver | null = null
onMounted(() => {
  if (!chartEl.value || typeof ResizeObserver === 'undefined')
    return
  chartObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0)
      CHART.width = entry.contentRect.width
  })
  chartObserver.observe(chartEl.value)
})
onBeforeUnmount(() => chartObserver?.disconnect())
const POINTS = 96
const X_LABELS = ['00:00', '04:50', '09:30', '14:20', '19:00', '23:50']

function noise(i: number, seed: number) {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** 基线 + 慢波 + 抖动，偶尔来一根尖峰，读起来像真实遥测。 */
function telemetry(base: number, swing: number, jitter: number, seed: number) {
  return Array.from({ length: POINTS }, (_, i) => {
    const wave = Math.sin((i / POINTS) * Math.PI * 4 + seed) * swing
    const wobble = (noise(i, seed) - 0.5) * jitter
    const spike = noise(i, seed + 41) > 0.86 ? jitter * 2.4 : 0
    return Math.max(0, base + wave + wobble + spike)
  })
}

const latencySeries = [
  { key: 'p50', label: 'p50', color: 'var(--astryx-color-data-categorical-blue, #0171E3)', values: telemetry(46, 10, 14, 3) },
  { key: 'p95', label: 'p95', color: 'var(--astryx-color-data-categorical-orange, #EB6E00)', values: telemetry(152, 40, 34, 7) },
  { key: 'p99', label: 'p99', color: 'var(--astryx-color-data-categorical-purple, #6B1EFD)', values: telemetry(330, 110, 90, 11) },
]

const volumeSeries = [
  { key: 'useast', label: 'us-east-1', color: 'var(--astryx-color-data-categorical-blue, #0171E3)', values: telemetry(9400, 2600, 900, 5) },
  { key: 'uswest', label: 'us-west-2', color: 'var(--astryx-color-data-categorical-teal, #08A3A3)', values: telemetry(6400, 1500, 650, 9) },
  { key: 'euwest', label: 'eu-west-1', color: 'var(--astryx-color-data-categorical-orange, #EB6E00)', values: telemetry(4100, 900, 500, 13) },
]

const LATENCY_Y_TICKS = [0, 200, 400, 600, 800]
const VOLUME_Y_TICKS = [0, 3500, 7000, 10500, 14000]

function chartX(i: number) {
  return CHART.left + (i / (POINTS - 1)) * (CHART.width - CHART.left - CHART.right)
}

function chartY(value: number, max: number) {
  const inner = CHART.height - CHART.top - CHART.bottom
  return CHART.top + (1 - value / max) * inner
}

function chartPath(values: number[], max: number) {
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'}${chartX(i).toFixed(1)},${chartY(v, max).toFixed(1)}`).join(' ')
}

function rpmLabel(rpm: number) {
  return `${(rpm / 1000).toFixed(1)}k rpm`
}

const SEVERITY_RANK: Record<HealthStatus, number> = { critical: 0, warning: 1, healthy: 2 }
const STATUS_LABEL: Record<HealthStatus, string> = { healthy: 'Healthy', warning: 'Degraded', critical: 'Down' }
const STATUS_DOT: Record<HealthStatus, 'success' | 'warning' | 'error'> = { healthy: 'success', warning: 'warning', critical: 'error' }

const alertGroups = ALERT_ORDER
  .map(state => ({ state, items: ALERTS.filter(alert => alert.state === state) }))
  .filter(group => group.items.length > 0)

function errorColor(rate: number): 'red' | 'yellow' | 'green' {
  if (rate >= 5)
    return 'red'
  return rate >= 1.5 ? 'yellow' : 'green'
}

function formatRpm(rpm: number): string {
  return rpm >= 1000 ? `${(rpm / 1000).toFixed(1)}k rpm` : `${rpm} rpm`
}

// ============= 90 天可用性 =============

const UPTIME_DAYS = 90
type UptimeStatus = 'operational' | 'degraded' | 'down'

const UPTIME_COLOR: Record<UptimeStatus, string> = {
  operational: 'var(--astryx-color-success, #0D8626)',
  degraded: 'var(--astryx-color-warning, #E9AF08)',
  down: 'var(--astryx-color-error, #E3193B)',
}
const UPTIME_LABEL: Record<UptimeStatus, string> = {
  operational: 'Operational',
  degraded: 'Partial degradation',
  down: 'Downtime',
}
const UPTIME_ORDER: UptimeStatus[] = ['operational', 'degraded', 'down']
const DAY_UPTIME: Record<UptimeStatus, number> = { operational: 100, degraded: 98.4, down: 82 }
const UPTIME_ENV_RISK: Record<Environment, number> = { production: 1, staging: 1.6, development: 3 }
const UPTIME_STATUS_RISK: Record<HealthStatus, number> = { healthy: 1, warning: 3.5, critical: 7 }
const UPTIME_TODAY: Record<HealthStatus, UptimeStatus> = { healthy: 'operational', warning: 'degraded', critical: 'down' }

interface ServiceUptime {
  service: string
  status: HealthStatus
  days: UptimeStatus[]
  uptime: number
}

/** 每个服务一串 90 天的状态：风险按环境和当前状态放大，种子固定所以每次渲染都一样。 */
function buildUptime(service: string, environment: Environment, status: HealthStatus): ServiceUptime {
  let seed = 7
  for (let i = 0; i < service.length; i++)
    seed = (seed * 31 + service.charCodeAt(i)) % 9973
  const risk = UPTIME_ENV_RISK[environment] * UPTIME_STATUS_RISK[status]
  const downCount = Math.round(UPTIME_DAYS * Math.min(0.09, 0.005 * risk) * (0.6 + 0.8 * noise(seed, 3.7)))
  const degradedCount = Math.round(UPTIME_DAYS * Math.min(0.32, 0.02 * risk) * (0.6 + 0.8 * noise(seed, 5.9)))
  const ranked = [...Array.from({ length: UPTIME_DAYS }).keys()].sort((a, b) => noise(b, seed) - noise(a, seed))
  const days: UptimeStatus[] = Array.from({ length: UPTIME_DAYS }, () => 'operational')
  for (let k = 0; k < downCount; k++)
    days[ranked[k]] = 'down'
  for (let k = downCount; k < downCount + degradedCount; k++)
    days[ranked[k]] = 'degraded'
  days[UPTIME_DAYS - 1] = UPTIME_TODAY[status]
  const cleanDay = DAY_UPTIME.operational - 0.02 - noise(seed, 11.3) * 0.06
  let served = 0
  for (let i = 0; i < UPTIME_DAYS; i++)
    served += days[i] === 'operational' ? cleanDay - noise(i, seed + 1) * 0.02 : DAY_UPTIME[days[i]]
  return { service, status, days, uptime: served / UPTIME_DAYS }
}

function dayLabel(i: number): string {
  const ago = UPTIME_DAYS - 1 - i
  if (ago === 0)
    return 'Today'
  return ago === 1 ? 'Yesterday' : `${ago} days ago`
}

const timeWindow = ref<TimeWindow>('1d')
const environment = ref<Environment>('production')
const region = ref('all')
const isNarrow = useMediaQuery('(max-width: 1024px)')

const kpis = computed(() => KPI_BY_ENV[environment.value])
const rows = computed(() => HOST_ROWS.filter(r => r.environment === environment.value && (region.value === 'all' || r.region === region.value)))
/** 同一服务取最差状态，按名字排序。 */
const uptimeEntries = computed(() => {
  const worst = new Map<string, HealthStatus>()
  for (const row of rows.value) {
    const previous = worst.get(row.service)
    if (previous === undefined || SEVERITY_RANK[row.status] < SEVERITY_RANK[previous])
      worst.set(row.service, row.status)
  }
  return [...worst.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([service, status]) => buildUptime(service, environment.value, status))
})

const sortedRows = computed(() => [...rows.value].sort((a, b) =>
  SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status] || b.errorRate - a.errorRate,
))

const breakdownContext = computed(() => `${ENV_OPTIONS.find(e => e.value === environment.value)?.label} · ${REGION_OPTIONS.find(r => r.value === region.value)?.label}`)
const firingCount = computed(() => ALERTS.filter(a => a.state === 'firing').length)

/** 右栏的两个区块：Active alerts 和 Service breakdown。宽屏进 Layout 的 end 槽，窄屏放到主区底部。 */
const AlertsFeed = defineComponent({
  props: { sticky: { type: Boolean, default: false } },
  setup(props) {
    return () => h(VStack, { gap: 0 }, () => [
      h(VStack, { gap: 0, class: props.sticky ? 'sticky-header' : undefined }, () => [
        h(VStack, { gap: 1, padding: 4, class: 'rail-header' }, () => [
          h(HStack, { gap: 2, vAlign: 'center' }, () => [
            h(Icon, { name: 'heroicons:bell-alert', size: 'sm', color: firingCount.value > 0 ? 'error' : 'secondary' }),
            h(StackItem, { size: 'fill' }, () => h(Heading, { level: 3 }, () => 'Active alerts')),
            h(Badge, { label: `${firingCount.value} firing`, variant: firingCount.value > 0 ? 'error' : 'neutral' }),
          ]),
          h(Text, { type: 'supporting', color: 'secondary' }, () => `${ALERTS.length} in the last 24h · newest first`),
        ]),
        h(Divider),
      ]),
      ...alertGroups.map(group => h(List, { key: group.state, density: 'compact', hasDividers: true }, () => group.items.map(alert =>
        h(ListItem, { key: alert.id, label: alert.title, description: alert.service }, {
          startContent: () => h(StatusDot, { variant: STATUS_DOT[alert.severity], label: alert.severity, isPulsing: alert.state === 'firing' && alert.severity === 'critical' }),
          endContent: () => h(VStack, { gap: 1, hAlign: 'end' }, () => [
            h(Token, { size: 'sm', color: ALERT_STATE_TOKEN[alert.state].color, label: ALERT_STATE_TOKEN[alert.state].label }),
            h(Timestamp, { value: alert.at, format: 'relative', color: 'secondary' }),
          ]),
        }),
      ))),
    ])
  },
})

const ServiceBreakdown = defineComponent({
  props: { sticky: { type: Boolean, default: false } },
  setup(props) {
    return () => h(VStack, { gap: 0 }, () => [
      h(VStack, { gap: 0, class: props.sticky ? 'sticky-header' : undefined }, () => [
        h(VStack, { gap: 1, padding: 4, class: 'rail-header' }, () => [
          h(HStack, { gap: 2, vAlign: 'center' }, () => [
            h(Icon, { name: 'heroicons:server-stack', size: 'sm', color: 'secondary' }),
            h(StackItem, { size: 'fill' }, () => h(Heading, { level: 3 }, () => 'Service breakdown')),
            h(Badge, { label: String(rows.value.length), variant: 'neutral' }),
          ]),
          h(Text, { type: 'supporting', color: 'secondary' }, () => breakdownContext.value),
        ]),
        h(Divider),
      ]),
      h(List, { density: 'compact', hasDividers: true }, () => sortedRows.value.map(row =>
        h(ListItem, { key: row.id, label: row.service, description: `${row.region} · ${row.instances} hosts · ${formatRpm(row.rpm)}` }, {
          startContent: () => h(StatusDot, { variant: STATUS_DOT[row.status], label: STATUS_LABEL[row.status], isPulsing: row.status === 'critical' }),
          endContent: () => h(VStack, { gap: 1, hAlign: 'end' }, () => [
            h(HStack, { gap: 1, vAlign: 'center' }, () => [
              h(Text, { type: 'supporting', color: 'secondary' }, () => 'p99'),
              h(Text, { type: 'body', weight: 'semibold' }, () => `${row.p99} ms`),
            ]),
            h(Token, { size: 'sm', color: errorColor(row.errorRate), label: `${row.errorRate.toFixed(1)}% err` }),
          ]),
        }),
      )),
    ])
  },
})

</script>

<template>
  <Layout height="fill" :style="pageStyle">
    <template #header>
      <LayoutHeader :padding="6" has-divider>
        <HStack :gap="3" align="center" justify="between" wrap="wrap">
          <VStack :gap="0" align="center">
            <Heading :level="1">
              Service Health Monitor
            </Heading>
            <HStack :gap="2" align="center">
              <StatusDot variant="success" label="Live" is-pulsing tooltip="Auto-refreshing every 30s" />
              <Text type="supporting" color="secondary">
                Updated
                <Timestamp value="2026-06-30T21:15:00Z" format="relative" color="inherit" />
              </Text>
            </HStack>
          </VStack>
          <HStack :gap="2" align="center">
            <SegmentedControl v-model="timeWindow" label="Time window" size="lg">
              <SegmentedControlItem label="1h" value="1h" />
              <SegmentedControlItem label="1d" value="1d" />
              <SegmentedControlItem label="7d" value="7d" />
            </SegmentedControl>
            <Selector v-model="environment" label="Environment" is-label-hidden size="lg" :options="ENV_OPTIONS" />
            <Selector v-model="region" label="Region" is-label-hidden size="lg" :options="REGION_OPTIONS" />
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>
    <template #default>
      <LayoutContent :padding="6">
        <VStack :gap="10">
          <VStack :gap="6">
            <Grid :columns="{ minWidth: 240, repeat: 'fit' }" :gap="3">
              <Card v-for="kpi in kpis" :key="kpi.key" :padding="4">
                <VStack :gap="2">
                  <HStack :gap="2" align="center">
                    <StatusDot :variant="kpi.status === 'healthy' ? 'success' : kpi.status === 'warning' ? 'warning' : 'error'" :label="kpi.label" />
                    <Text type="label" color="secondary">
                      {{ kpi.label }}
                    </Text>
                  </HStack>
                  <HStack :gap="2" align="center">
                    <Heading :level="2">
                      {{ kpi.value }}
                    </Heading>
                    <HStack :gap="1" align="center">
                      <Icon :icon="kpi.deltaPositive ? 'arrowUp' : 'arrowDown'" size="xsm" :color="kpi.deltaPositive ? 'success' : 'error'" />
                      <Text type="supporting" color="secondary">
                        {{ kpi.delta }}
                      </Text>
                    </HStack>
                  </HStack>
                  <PlaygroundSparkline :data="SPARKLINES[kpi.key]" :color="STATUS_STROKE[kpi.status]" />
                </VStack>
              </Card>
            </Grid>
            <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="3">
              <Card :padding="6">
                <VStack :gap="4">
                  <VStack :gap="1">
                    <Heading :level="3">
                      Response latency
                    </Heading>
                    <Text type="supporting" color="secondary">
                      Percentile latency across all services (ms)
                    </Text>
                  </VStack>
                  <svg ref="chartEl" class="rail-chart" :viewBox="`0 0 ${CHART.width} ${CHART.height}`" role="img" aria-label="Response latency percentiles">
                    <line
                      v-for="tick in LATENCY_Y_TICKS"
                      :key="`ly-${tick}`"
                      :x1="CHART.left"
                      :x2="CHART.width - CHART.right"
                      :y1="chartY(tick, 800)"
                      :y2="chartY(tick, 800)"
                      class="chart-grid"
                    />
                    <text
                      v-for="tick in LATENCY_Y_TICKS"
                      :key="`lyt-${tick}`"
                      :x="CHART.left - 8"
                      :y="chartY(tick, 800)"
                      text-anchor="end"
                      dominant-baseline="central"
                      class="chart-tick"
                    >
                      {{ tick }} ms
                    </text>
                    <text
                      v-for="(label, i) in X_LABELS"
                      :key="`lx-${label}`"
                      :x="chartX((i / (X_LABELS.length - 1)) * (POINTS - 1))"
                      :y="CHART.height - CHART.bottom + 13"
                      dominant-baseline="central"
                      text-anchor="middle"
                      class="chart-tick"
                    >
                      {{ label }}
                    </text>
                    <path
                      v-for="series in latencySeries"
                      :key="series.key"
                      :d="chartPath(series.values, 800)"
                      fill="none"
                      :stroke="series.color"
                      stroke-width="1.5"
                      vector-effect="non-scaling-stroke"
                    />
                  </svg>
                  <HStack :gap="5" align="center" wrap="wrap">
                    <HStack v-for="series in latencySeries" :key="series.key" :gap="2" align="center">
                      <span class="legend-dot" :style="{ background: series.color }" />
                      <Text type="supporting" color="secondary">
                        {{ series.label }}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="4">
                  <VStack :gap="1">
                    <Heading :level="3">
                      Request volume by region
                    </Heading>
                    <Text type="supporting" color="secondary">
                      Requests per minute (rpm)
                    </Text>
                  </VStack>
                  <svg class="rail-chart" :viewBox="`0 0 ${CHART.width} ${CHART.height}`" role="img" aria-label="Request volume by region">
                    <line
                      v-for="tick in VOLUME_Y_TICKS"
                      :key="`vy-${tick}`"
                      :x1="CHART.left"
                      :x2="CHART.width - CHART.right"
                      :y1="chartY(tick, 14000)"
                      :y2="chartY(tick, 14000)"
                      class="chart-grid"
                    />
                    <text
                      v-for="tick in VOLUME_Y_TICKS"
                      :key="`vyt-${tick}`"
                      :x="CHART.left - 8"
                      :y="chartY(tick, 14000)"
                      text-anchor="end"
                      dominant-baseline="central"
                      class="chart-tick"
                    >
                      {{ tick }}
                    </text>
                    <text
                      v-for="(label, i) in X_LABELS"
                      :key="`vx-${label}`"
                      :x="chartX((i / (X_LABELS.length - 1)) * (POINTS - 1))"
                      :y="CHART.height - CHART.bottom + 13"
                      dominant-baseline="central"
                      text-anchor="middle"
                      class="chart-tick"
                    >
                      {{ label }}
                    </text>
                    <path
                      v-for="series in volumeSeries"
                      :key="series.key"
                      :d="chartPath(series.values, 14000)"
                      fill="none"
                      :stroke="series.color"
                      stroke-width="1.5"
                      vector-effect="non-scaling-stroke"
                    />
                  </svg>
                  <HStack :gap="5" align="center" wrap="wrap">
                    <HStack v-for="series in volumeSeries" :key="series.key" :gap="2" align="center">
                      <span class="legend-dot" :style="{ background: series.color }" />
                      <Text type="supporting" color="secondary">
                        {{ series.label }}
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Card>
            </Grid>
          </VStack>
          <Divider />
          <VStack :gap="6">
            <HStack :gap="3" align="center" h-align="between" wrap="wrap">
              <VStack>
                <Heading :level="2">
                  All services
                </Heading>
                <Text type="supporting" color="secondary">
                  Daily uptime over the last {{ UPTIME_DAYS }} days · {{ breakdownContext }}
                </Text>
              </VStack>
              <HStack :gap="4" align="center" wrap="wrap">
                <HStack v-for="state in UPTIME_ORDER" :key="state" :gap="2" align="center">
                  <span class="legend-dot" :style="{ background: UPTIME_COLOR[state] }" />
                  <Text type="supporting" color="secondary">
                    {{ UPTIME_LABEL[state] }}
                  </Text>
                </HStack>
              </HStack>
            </HStack>
            <Card :padding="6">
              <EmptyState
                v-if="uptimeEntries.length === 0"
                title="No services in this view"
                description="Nothing reports in the selected environment and region. Try widening the region filter."
              />
              <VStack v-else :gap="6">
                <template v-for="(entry, index) in uptimeEntries" :key="entry.service">
                  <Divider v-if="index > 0" />
                  <VStack :gap="2">
                    <HStack :gap="3" align="center" h-align="between">
                      <HStack :gap="2" align="center">
                        <StatusDot :variant="STATUS_DOT[entry.status]" :label="STATUS_LABEL[entry.status]" :is-pulsing="entry.status === 'critical'" />
                        <Heading :level="4">
                          {{ entry.service }}
                        </Heading>
                      </HStack>
                      <Text type="supporting" color="secondary">
                        {{ entry.uptime.toFixed(2) }}% uptime
                      </Text>
                    </HStack>
                    <div class="uptime-strip" role="img" :aria-label="`${UPTIME_DAYS}-day uptime for ${entry.service}`">
                      <div
                        v-for="(day, i) in entry.days"
                        :key="i"
                        class="uptime-bar"
                        :style="{ background: UPTIME_COLOR[day] }"
                        :title="`${dayLabel(i)} — ${UPTIME_LABEL[day]}`"
                      />
                    </div>
                  </VStack>
                </template>
              </VStack>
            </Card>
          </VStack>
          <VStack v-if="isNarrow" :gap="4">
            <Card :padding="0">
              <AlertsFeed />
            </Card>
            <Card :padding="0">
              <ServiceBreakdown />
            </Card>
          </VStack>
        </VStack>
      </LayoutContent>
    </template>
    <template v-if="!isNarrow" #end>
      <LayoutPanel :width="400" :padding="0" has-divider role="complementary" label="Alerts and service breakdown" is-scrollable>
        <VStack :gap="0">
          <AlertsFeed sticky />
          <Divider />
          <ServiceBreakdown sticky />
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.rail-header {
  background-color: var(--astryx-color-background-muted);
}
.rail-chart { width: 100%; height: 280px; display: block; }
.chart-grid { stroke: var(--astryx-color-border, rgb(5 54 89 / 10%)); stroke-width: 1; }
.chart-tick { fill: var(--astryx-color-text-secondary, #4E606F); font-size: 12px; }
.uptime-strip {
  display: flex;
  gap: 2px;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
}
.uptime-bar {
  flex: 1 1 0;
  min-width: 3px;
  height: 30px;
}
.legend-dot { width: 8px; height: 8px; border-radius: 2px; flex: none; }
.sticky-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  background-color: var(--astryx-color-background-surface);
}
</style>
