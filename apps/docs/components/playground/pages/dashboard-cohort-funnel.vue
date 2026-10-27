<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import { computed, h, ref } from 'vue'
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
  LayoutHeader,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  Table,
  Text,
  Token,
  VStack,
  pixel,
} from '@astryx-vue/core'
import {
  PlaygroundHorizontalBarChart,
  PlaygroundLineChart,
  PlaygroundResponsive,
} from '@astryx-vue/playground-charts'

type Segment = 'all' | 'web' | 'ios' | 'android'
type FunnelWindow = '7d' | '30d' | '90d'

const COLORS = {
  blue: 'var(--astryx-color-data-categorical-blue, #0171E3)',
  green: 'var(--astryx-color-data-categorical-green, #0B991F)',
  orange: 'var(--astryx-color-data-categorical-orange, #EB6E00)',
  purple: 'var(--astryx-color-data-categorical-purple, #6B1EFD)',
  teal: 'var(--astryx-color-data-categorical-teal, #08A3A3)',
}

const FUNNEL_COLORS = [COLORS.blue, COLORS.teal, COLORS.green, COLORS.orange, COLORS.purple]

const WINDOW_FACTOR: Record<FunnelWindow, number> = { '7d': 0.24, '30d': 1, '90d': 3.1 }

const FUNNEL_STAGES = [
  { key: 'visit', label: 'Visited site', users: { all: 128400, web: 82600, ios: 27300, android: 18500 } },
  { key: 'signup', label: 'Signed up', users: { all: 41200, web: 24800, ios: 9600, android: 6800 } },
  { key: 'activate', label: 'Activated', users: { all: 22600, web: 12900, ios: 5900, android: 3800 } },
  { key: 'subscribe', label: 'Subscribed', users: { all: 9100, web: 5100, ios: 2600, android: 1400 } },
  { key: 'retain', label: 'Retained 30d', users: { all: 6300, web: 3600, ios: 1850, android: 850 } },
]

const TREND = [
  {t: 0, label: 'W1', signup: 30.1, activate: 52.4, subscribe: 38.2},
  {t: 1, label: 'W2', signup: 31.4, activate: 54.1, subscribe: 36.9},
  {t: 2, label: 'W3', signup: 29.2, activate: 51.2, subscribe: 39.8},
  {t: 3, label: 'W4', signup: 32.6, activate: 55.8, subscribe: 37.1},
  {t: 4, label: 'W5', signup: 28.4, activate: 53.6, subscribe: 40.4},
  {t: 5, label: 'W6', signup: 31.8, activate: 56.2, subscribe: 38.3},
  {t: 6, label: 'W7', signup: 33.5, activate: 54.3, subscribe: 44.6},
  {t: 7, label: 'W8', signup: 30.2, activate: 57.1, subscribe: 42.1},
  {t: 8, label: 'W9', signup: 34.1, activate: 48.9, subscribe: 37.4},
  {t: 9, label: 'W10', signup: 29.6, activate: 46.2, subscribe: 35.2},
  {t: 10, label: 'W11', signup: 32.9, activate: 50.4, subscribe: 38.9},
  {t: 11, label: 'W12', signup: 35.4, activate: 55.6, subscribe: 41.3},
  {t: 12, label: 'W13', signup: 31.1, activate: 57.3, subscribe: 39.2},
  {t: 13, label: 'W14', signup: 33.8, activate: 54.8, subscribe: 42.8},
  {t: 14, label: 'W15', signup: 41.2, activate: 49.6, subscribe: 40.1},
  {t: 15, label: 'W16', signup: 38.6, activate: 47.8, subscribe: 36.4},
  {t: 16, label: 'W17', signup: 30.4, activate: 53.2, subscribe: 39.7},
  {t: 17, label: 'W18', signup: 26.8, activate: 44.1, subscribe: 34.2},
  {t: 18, label: 'W19', signup: 31.9, activate: 51.7, subscribe: 38.1},
  {t: 19, label: 'W20', signup: 34.7, activate: 56.4, subscribe: 41.9},
  {t: 20, label: 'W21', signup: 32.2, activate: 58.2, subscribe: 44.2},
  {t: 21, label: 'W22', signup: 36.1, activate: 55.1, subscribe: 40.6},
  {t: 22, label: 'W23', signup: 33.4, activate: 59.4, subscribe: 43.8},
  {t: 23, label: 'W24', signup: 37.2, activate: 56.8, subscribe: 46.1},
  {t: 24, label: 'W25', signup: 34.9, activate: 60.1, subscribe: 42.7},
  {t: 25, label: 'W26', signup: 38.4, activate: 58.6, subscribe: 45.3},
]

const TREND_SERIES = [
  { key: 'signup', name: 'Visit → signup', color: COLORS.blue },
  { key: 'activate', name: 'Signup → activation', color: COLORS.green },
  { key: 'subscribe', name: 'Activation → paid', color: COLORS.orange },
]

const TREND_TICK_STEP = 5
const TREND_TICKS = Array.from({ length: Math.ceil(TREND.length / TREND_TICK_STEP) }, (_, i) => i * TREND_TICK_STEP)
const formatTrendTick = (v: number) => TREND[v]?.label ?? ''

const COHORTS = [
  { label: 'Apr 6 – Apr 12', size: 4820, retention: [100, 62, 48, 41, 37, 34, 32, 31] },
  { label: 'Apr 13 – Apr 19', size: 5140, retention: [100, 64, 50, 43, 39, 36, 34] },
  { label: 'Apr 20 – Apr 26', size: 5390, retention: [100, 66, 52, 45, 41, 38] },
  { label: 'Apr 27 – May 3', size: 5610, retention: [100, 63, 49, 42, 38] },
  { label: 'May 4 – May 10', size: 5980, retention: [100, 67, 54, 47] },
  { label: 'May 11 – May 17', size: 6240, retention: [100, 69, 56] },
  { label: 'May 18 – May 24', size: 6510, retention: [100, 71] },
  { label: 'May 25 – May 31', size: 6720, retention: [100] },
]

const MAX_WEEKS = 8

const KPIS: Record<Segment, Array<{ key: string, label: string, value: string, delta: number, higherIsBetter: boolean }>> = {
  all: [
    { key: 'v2s', label: 'Visit → signup', value: '32.1%', delta: 1.8, higherIsBetter: true },
    { key: 's2a', label: 'Signup → activation', value: '54.9%', delta: 2.4, higherIsBetter: true },
    { key: 'a2s', label: 'Activation → paid', value: '40.3%', delta: -1.1, higherIsBetter: true },
    { key: 'w4', label: 'Week-4 retention', value: '43.2%', delta: 3.6, higherIsBetter: true },
  ],
  web: [
    { key: 'v2s', label: 'Visit → signup', value: '30.0%', delta: 1.2, higherIsBetter: true },
    { key: 's2a', label: 'Signup → activation', value: '52.0%', delta: 1.9, higherIsBetter: true },
    { key: 'a2s', label: 'Activation → paid', value: '39.5%', delta: -0.6, higherIsBetter: true },
    { key: 'w4', label: 'Week-4 retention', value: '41.8%', delta: 2.9, higherIsBetter: true },
  ],
  ios: [
    { key: 'v2s', label: 'Visit → signup', value: '35.2%', delta: 2.6, higherIsBetter: true },
    { key: 's2a', label: 'Signup → activation', value: '61.5%', delta: 3.1, higherIsBetter: true },
    { key: 'a2s', label: 'Activation → paid', value: '44.1%', delta: 0.8, higherIsBetter: true },
    { key: 'w4', label: 'Week-4 retention', value: '47.5%', delta: 4.2, higherIsBetter: true },
  ],
  android: [
    { key: 'v2s', label: 'Visit → signup', value: '36.8%', delta: 2.1, higherIsBetter: true },
    { key: 's2a', label: 'Signup → activation', value: '55.9%', delta: 1.4, higherIsBetter: true },
    { key: 'a2s', label: 'Activation → paid', value: '36.8%', delta: -2.3, higherIsBetter: true },
    { key: 'w4', label: 'Week-4 retention', value: '38.4%', delta: -0.9, higherIsBetter: true },
  ],
}

const SEGMENT_OPTIONS = [
  { value: 'all', label: 'All platforms' },
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
]

function nf(n: number) {
  return n.toLocaleString()
}

function retentionColor(pct: number): 'green' | 'teal' | 'yellow' | 'orange' | 'red' {
  if (pct >= 70) return 'green'
  if (pct >= 50) return 'teal'
  if (pct >= 40) return 'yellow'
  if (pct >= 32) return 'orange'
  return 'red'
}

interface CohortRow extends Record<string, unknown> {
  id: string
  label: string
  size: number
  retention: number[]
}

const cohortRows: CohortRow[] = COHORTS.map((c, i) => ({
  id: `c${i}`,
  label: c.label,
  size: c.size,
  retention: c.retention,
}))

const cohortColumns: TableColumn<CohortRow>[] = [
  {
    key: 'label',
    header: 'Cohort',
    width: pixel(150),
    renderCell: item => h(Text, { type: 'body', weight: 'semibold' }, () => item.label),
  },
  {
    key: 'size',
    header: 'Users',
    width: pixel(90),
    renderCell: item => h(Text, { type: 'body', color: 'secondary' }, () => nf(item.size)),
  },
  ...Array.from({ length: MAX_WEEKS }, (_, week) => ({
    key: `w${week}`,
    header: `W${week}`,
    width: pixel(72),
    renderCell: (item: CohortRow) => {
      const pct = item.retention[week]
      if (pct == null)
        return h(Text, { type: 'supporting', color: 'secondary' }, () => '—')
      return h(Token, { size: 'sm', color: retentionColor(pct), label: `${pct}%` })
    },
  })),
]

const segment = ref<Segment>('all')
const funnelWindow = ref<FunnelWindow>('30d')

const kpis = computed(() => KPIS[segment.value])

const topOfFunnel = computed(() => {
  const base = FUNNEL_STAGES[0].users[segment.value]
  return Math.round(base * WINDOW_FACTOR[funnelWindow.value])
})

const overallConversion = computed(() => {
  const top = FUNNEL_STAGES[0].users[segment.value]
  const bottom = FUNNEL_STAGES[FUNNEL_STAGES.length - 1].users[segment.value]
  return ((bottom / top) * 100).toFixed(1)
})

const funnelBars = computed(() => {
  const top = FUNNEL_STAGES[0].users[segment.value]
  return FUNNEL_STAGES.map((stage, i) => {
    const users = stage.users[segment.value]
    const prev = i > 0 ? FUNNEL_STAGES[i - 1].users[segment.value] : null
    return {
      label: stage.label,
      value: users,
      color: FUNNEL_COLORS[i % FUNNEL_COLORS.length],
      pctOfTop: (users / top) * 100,
      stepPct: prev != null ? (users / prev) * 100 : null,
    }
  })
})

const funnelChartData = computed(() => funnelBars.value.map(b => ({
  label: b.label,
  value: b.value,
  color: b.color,
})))

const funnelSteps = computed(() => FUNNEL_STAGES.slice(1).map((stage, i) => {
  const prev = FUNNEL_STAGES[i]
  const from = prev.users[segment.value]
  const to = stage.users[segment.value]
  const conv = (to / from) * 100
  const drop = 100 - conv
  return {
    key: stage.key,
    label: `${prev.label} → ${stage.label}`,
    conv,
    drop,
  }
}))

const segmentLabel = computed(() => SEGMENT_OPTIONS.find(o => o.value === segment.value)?.label ?? '')
</script>

<template>
  <Layout height="fill" :padding="4" :content-width="1440">
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="3" align="center" justify="between" wrap="wrap">
          <VStack :gap="0">
            <Heading :level="1">
              Funnel & cohort analytics
            </Heading>
            <Text type="supporting" color="secondary">
              {{ nf(topOfFunnel) }} visitors · {{ overallConversion }}% end-to-end conversion
            </Text>
          </VStack>
          <HStack :gap="2">
            <SegmentedControl v-model="funnelWindow" label="Funnel window">
              <SegmentedControlItem label="7d" value="7d" />
              <SegmentedControlItem label="30d" value="30d" />
              <SegmentedControlItem label="90d" value="90d" />
            </SegmentedControl>
            <Selector
              v-model="segment"
              label="Segment"
              is-label-hidden
              :options="SEGMENT_OPTIONS"
            />
            <Button label="Export" variant="secondary">
              <template #icon>
                <Icon icon="i-heroicons-arrow-down-tray" size="sm" />
              </template>
            </Button>
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>
    <template #default>
      <LayoutContent>
        <VStack :gap="10">
          <VStack :gap="4">
            <Grid :columns="{ minWidth: 240, repeat: 'fit' }" :gap="3">
              <Card v-for="kpi in kpis" :key="kpi.key" :padding="4">
                <VStack :gap="1">
                  <Text type="label" color="secondary">
                    {{ kpi.label }}
                  </Text>
                  <HStack :gap="3">
                    <Heading :level="1">
                      {{ kpi.value }}
                    </Heading>
                    <HStack :gap="1" align="center">
                      <Icon
                        :icon="kpi.delta >= 0 ? 'arrowUp' : 'arrowDown'"
                        size="xsm"
                        :color="(kpi.higherIsBetter ? kpi.delta >= 0 : kpi.delta <= 0) ? 'success' : 'error'"
                      />
                      <Text type="supporting" color="secondary">
                        {{ kpi.delta >= 0 ? '+' : '' }}{{ kpi.delta.toFixed(1) }} pts vs. prior
                      </Text>
                    </HStack>
                  </HStack>
                </VStack>
              </Card>
            </Grid>

            <Card :padding="6">
              <VStack :gap="6">
                <VStack>
                  <Heading :level="2">
                    Conversion funnel
                  </Heading>
                  <Text type="supporting" color="secondary">
                    {{ segmentLabel }} · {{ funnelWindow }}
                  </Text>
                </VStack>
                <PlaygroundResponsive :height="260">
                  <PlaygroundHorizontalBarChart :data="funnelChartData" :height="260" has-axis />
                </PlaygroundResponsive>
                <Divider />
                <Grid :columns="{ minWidth: 200, repeat: 'fit' }" :gap="3" class="step-grid">
                  <VStack v-for="step in funnelSteps" :key="step.key" :gap="1" class="step">
                    <Text type="label" color="secondary">
                      {{ step.label }}
                    </Text>
                    <HStack :gap="2" align="center">
                      <Heading :level="2">
                        {{ step.conv.toFixed(1) }}%
                      </Heading>
                      <Token
                        size="sm"
                        :color="step.drop >= 55 ? 'red' : 'green'"
                        :label="`-${step.drop.toFixed(0)}%`"
                      >
                        <template #icon>
                          <Icon icon="i-heroicons-arrow-trending-down" size="xsm" color="inherit" />
                        </template>
                      </Token>
                    </HStack>
                  </VStack>
                </Grid>
              </VStack>
            </Card>

            <Card :padding="6">
              <VStack :gap="6">
                <VStack>
                  <Heading :level="2">
                    Conversion over time
                  </Heading>
                  <Text type="supporting" color="secondary">
                    Stage conversion rates · trailing {{ TREND.length }} weeks
                  </Text>
                </VStack>
                <PlaygroundResponsive :height="260">
                  <PlaygroundLineChart
                    :data="TREND"
                    x-key="t"
                    :series="TREND_SERIES"
                    :height="260"
                    y-unit="%"
                    :x-ticks="TREND_TICKS"
                    :x-tick-format="formatTrendTick"
                    :pad="{ top: 5, right: 12, bottom: 30, left: 40 }"
                    center-ticks
                  />
                </PlaygroundResponsive>
                <HStack :gap="5" align="center" wrap="wrap">
                  <HStack v-for="series in TREND_SERIES" :key="series.key" :gap="2" align="center">
                    <span class="legend-dot" :style="{ background: series.color }" />
                    <Text type="supporting" color="secondary">
                      {{ series.name }}
                    </Text>
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </VStack>

          <Divider />

          <VStack :gap="6">
            <VStack>
              <Heading :level="2">
                Weekly retention cohorts
              </Heading>
              <Text type="supporting" color="secondary">
                Signup week × weeks since signup
              </Text>
            </VStack>
            <Card :padding="6">
              <VStack :gap="8">
                <Table :data="cohortRows" :columns="cohortColumns" id-key="id" density="balanced" dividers="rows" />
                <HStack :gap="4" align="center" wrap="wrap">
                  <Text type="supporting" color="secondary">
                    Retention:
                  </Text>
                  <HStack :gap="2" align="center">
                    <Token size="sm" color="red" label="< 32%" />
                    <Token size="sm" color="orange" label="32–40%" />
                    <Token size="sm" color="yellow" label="40–50%" />
                    <Token size="sm" color="teal" label="50–70%" />
                    <Token size="sm" color="green" label="≥ 70%" />
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </VStack>
      </LayoutContent>
    </template>
  </Layout>
</template>

<style scoped>
.step-grid {
  overflow-x: clip;
}
.step {
  border-inline-start-width: 1px;
  border-inline-start-style: solid;
  border-inline-start-color: var(--astryx-color-border, rgba(5, 54, 89, 0.1));
  margin-inline-start: calc(var(--astryx-spacing-3, 12px) / -2);
  padding-inline-start: calc(var(--astryx-spacing-3, 12px) / 2);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}
</style>
