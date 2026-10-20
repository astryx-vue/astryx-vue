<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { computed, ref } from 'vue'
import {
  Badge,
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
  List,
  ListItem,
  SegmentedControl,
  SegmentedControlItem,
  Selector,
  StatusDot,
  Text,
  Timestamp,
  Token,
  VStack,
  useMediaQuery,
} from '@astryx-vue/core'
import { PlaygroundLineChart, PlaygroundResponsive, PlaygroundSparkline } from '@astryx-vue/playground-charts'

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
  healthy: 'var(--color-success, #0B991F)',
  warning: 'var(--color-warning, #B25000)',
  critical: 'var(--color-error, #D6002A)',
}

const ALERTS = [
  { id: 'AL-8842', severity: 'critical' as HealthStatus, title: 'search-indexer 5xx rate above 5%', service: 'search-indexer · us-east-1', at: '2026-06-30T21:14:00Z', state: 'firing' },
  { id: 'AL-8841', severity: 'warning' as HealthStatus, title: 'checkout-api p99 latency above 500ms', service: 'checkout-api · us-east-1', at: '2026-06-30T21:02:00Z', state: 'firing' },
  { id: 'AL-8840', severity: 'warning' as HealthStatus, title: 'edge-cdn cache hit ratio degraded', service: 'edge-cdn · eu-west-1', at: '2026-06-30T20:41:00Z', state: 'acknowledged' },
]

const HOST_ROWS = [
  { id: '1', service: 'checkout-api', environment: 'production' as Environment, region: 'us-east-1', instances: 24, rpm: 9240, errorRate: 2.1, p99: 512, status: 'warning' as HealthStatus },
  { id: '4', service: 'search-indexer', environment: 'production', region: 'us-east-1', instances: 16, rpm: 4120, errorRate: 5.8, p99: 1180, status: 'critical' },
  { id: '6', service: 'payments', environment: 'production', region: 'us-east-1', instances: 20, rpm: 5310, errorRate: 0.2, p99: 188, status: 'healthy' },
]

const LATENCY_SERIES = Array.from({ length: 48 }, (_, i) => ({
  t: i,
  p50: 46 + Math.sin(i / 4) * 8,
  p95: 158 + Math.sin(i / 3) * 30,
  p99: 312 + Math.sin(i / 2.5) * 70,
}))

const timeWindow = ref<TimeWindow>('1d')
const environment = ref<Environment>('production')
const region = ref('all')
const isNarrow = useMediaQuery('(max-width: 1024px)')

const kpis = computed(() => KPI_BY_ENV[environment.value])
const rows = computed(() => HOST_ROWS.filter(r => r.environment === environment.value && (region.value === 'all' || r.region === region.value)))
const breakdownContext = computed(() => `${ENV_OPTIONS.find(e => e.value === environment.value)?.label} · ${REGION_OPTIONS.find(r => r.value === region.value)?.label}`)
const firingCount = computed(() => ALERTS.filter(a => a.state === 'firing').length)
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
                  <Heading :level="3">
                    Response latency
                  </Heading>
                  <PlaygroundResponsive :height="280">
                    <PlaygroundLineChart
                      :data="LATENCY_SERIES"
                      x-key="t"
                      :series="[
                        { key: 'p50', color: 'var(--color-data-categorical-blue, #0171E3)', name: 'p50' },
                        { key: 'p95', color: 'var(--color-data-categorical-orange, #EB6E00)', name: 'p95' },
                        { key: 'p99', color: 'var(--color-data-categorical-purple, #6B1EFD)', name: 'p99' },
                      ]"
                      :height="280"
                      y-unit=" ms"
                    />
                  </PlaygroundResponsive>
                </VStack>
              </Card>
              <Card :padding="6">
                <VStack :gap="4">
                  <Heading :level="3">
                    Request volume by region
                  </Heading>
                  <PlaygroundResponsive :height="280">
                    <PlaygroundLineChart
                      :data="LATENCY_SERIES.map((p, i) => ({ t: i, useast: 9200 + i * 40, uswest: 6100 + i * 20, euwest: 3900 + i * 15 }))"
                      x-key="t"
                      :series="[
                        { key: 'useast', color: 'var(--color-data-categorical-blue, #0171E3)', name: 'us-east-1' },
                        { key: 'uswest', color: 'var(--color-data-categorical-teal, #08A3A3)', name: 'us-west-2' },
                        { key: 'euwest', color: 'var(--color-data-categorical-orange, #EB6E00)', name: 'eu-west-1' },
                      ]"
                      :height="280"
                    />
                  </PlaygroundResponsive>
                </VStack>
              </Card>
            </Grid>
          </VStack>
          <Divider />
          <VStack v-if="isNarrow" :gap="4">
            <Card :padding="0">
              <VStack :gap="0">
                <VStack :gap="1" :padding="4" class="rail-header">
                  <HStack :gap="2" align="center">
                    <Icon icon="i-heroicons-bell-alert" size="sm" color="error" />
                    <Heading :level="3">
                      Active alerts
                    </Heading>
                    <Badge :label="`${firingCount} firing`" variant="error" />
                  </HStack>
                </VStack>
                <List density="compact" has-dividers>
                  <ListItem
                    v-for="alert in ALERTS"
                    :key="alert.id"
                    :label="alert.title"
                    :description="alert.service"
                  >
                    <template #startContent>
                      <StatusDot :variant="alert.severity === 'healthy' ? 'success' : alert.severity === 'warning' ? 'warning' : 'error'" :label="alert.severity" />
                    </template>
                    <template #endContent>
                      <Timestamp :value="alert.at" format="relative" color="secondary" />
                    </template>
                  </ListItem>
                </List>
              </VStack>
            </Card>
            <Card :padding="0">
              <List density="compact" has-dividers>
                <ListItem
                  v-for="row in rows"
                  :key="row.id"
                  :label="row.service"
                  :description="`${row.region} · ${row.instances} hosts · ${row.rpm} rpm`"
                >
                  <template #endContent>
                    <Text type="body" weight="semibold">
                      {{ row.p99 }} ms
                    </Text>
                  </template>
                </ListItem>
              </List>
            </Card>
          </VStack>
        </VStack>
      </LayoutContent>
    </template>
    <template v-if="!isNarrow" #end>
      <LayoutPanel :width="400" :padding="0" has-divider role="complementary" label="Alerts and service breakdown" is-scrollable>
        <VStack :gap="0">
          <VStack :gap="1" :padding="4" class="rail-header sticky-header">
            <HStack :gap="2" align="center">
              <Icon icon="i-heroicons-bell-alert" size="sm" :color="firingCount > 0 ? 'error' : 'secondary'" />
              <Heading :level="3">
                Active alerts
              </Heading>
              <Badge :label="`${firingCount} firing`" :variant="firingCount > 0 ? 'error' : 'neutral'" />
            </HStack>
            <Text type="supporting" color="secondary">
              {{ ALERTS.length }} in the last 24h
            </Text>
          </VStack>
          <Divider />
          <List density="compact" has-dividers>
            <ListItem v-for="alert in ALERTS" :key="alert.id" :label="alert.title" :description="alert.service">
              <template #startContent>
                <StatusDot :variant="alert.severity === 'critical' ? 'error' : 'warning'" :label="alert.severity" :is-pulsing="alert.state === 'firing' && alert.severity === 'critical'" />
              </template>
              <template #endContent>
                <Token size="sm" :color="alert.state === 'firing' ? 'red' : 'yellow'" :label="alert.state === 'firing' ? 'Firing' : 'Ack'" />
              </template>
            </ListItem>
          </List>
          <Divider />
          <VStack :gap="1" :padding="4" class="rail-header sticky-header">
            <Heading :level="3">
              Service breakdown
            </Heading>
            <Text type="supporting" color="secondary">
              {{ breakdownContext }}
            </Text>
          </VStack>
          <List density="compact" has-dividers>
            <ListItem v-for="row in rows" :key="row.id" :label="row.service" :description="`${row.region} · ${row.instances} hosts`">
              <template #endContent>
                <Text type="body" weight="semibold">
                  {{ row.p99 }} ms
                </Text>
              </template>
            </ListItem>
          </List>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.rail-header {
  background-color: var(--color-background-muted);
}
.sticky-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 1;
  background-color: var(--color-background-surface);
}
</style>
