import fs from 'node:fs'

const out = '/workspace/apps/docs/components/playground/pages/dashboard-cohort-funnel.vue'

const source = fs.readFileSync('/tmp/astryx-original/packages/cli/assets/templates/pages/dashboard-cohort-funnel/page.tsx', 'utf8')

// Extract TREND array block
const trendMatch = source.match(/const TREND: TrendPoint\[\] = (\[[\s\S]*?\]);/)
const trend = trendMatch ? trendMatch[1] : '[]'

const vue = `<script setup lang="ts">
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
  blue: 'var(--color-data-categorical-blue, #0171E3)',
  green: 'var(--color-data-categorical-green, #0B991F)',
  orange: 'var(--color-data-categorical-orange, #EB6E00)',
  purple: 'var(--color-data-categorical-purple, #6B1EFD)',
  teal: 'var(--color-data-categorical-teal, #08A3A3)',
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

const TREND = ${trend}

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
  id: \`c\${i}\`,
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
    key: \`w\${week}\`,
    header: \`W\${week}\`,
    width: pixel(72),
    renderCell: (item: CohortRow) => {
      const pct = item.retention[week]
      if (pct == null)
        return h(Text, { type: 'supporting', color: 'secondary' }, () => '—')
      return h(Token, { size: 'sm', color: retentionColor(pct), label: \`\${pct}%\` })
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
    label: \`\${prev.label} → \${stage.label}\`,
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
        <HStack :gap="3" v-align="center" h-align="between" wrap="wrap">
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
                    <HStack :gap="1" v-align="center">
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
                  <PlaygroundHorizontalBarChart :data="funnelChartData" :height="260" />
                </PlaygroundResponsive>
                <Divider />
                <Grid :columns="{ minWidth: 200, repeat: 'fit' }" :gap="3" class="step-grid">
                  <VStack v-for="step in funnelSteps" :key="step.key" :gap="1" class="step">
                    <Text type="label" color="secondary">
                      {{ step.label }}
                    </Text>
                    <HStack :gap="2" v-align="center">
                      <Heading :level="2">
                        {{ step.conv.toFixed(1) }}%
                      </Heading>
                      <Token
                        size="sm"
                        :color="step.drop >= 55 ? 'red' : 'green'"
                        :label="\`-\${step.drop.toFixed(0)}%\`"
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
                  />
                </PlaygroundResponsive>
                <HStack :gap="5" v-align="center" wrap="wrap">
                  <HStack v-for="series in TREND_SERIES" :key="series.key" :gap="2" v-align="center">
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
                <HStack :gap="4" v-align="center" wrap="wrap">
                  <Text type="supporting" color="secondary">
                    Retention:
                  </Text>
                  <HStack :gap="2" v-align="center">
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
  border-inline-start-color: var(--color-border, rgba(5, 54, 89, 0.1));
  margin-inline-start: calc(var(--spacing-3, 12px) / -2);
  padding-inline-start: calc(var(--spacing-3, 12px) / 2);
}
.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  flex-shrink: 0;
}
</style>
`

fs.writeFileSync(out, vue)
console.log('wrote', out, vue.length)
