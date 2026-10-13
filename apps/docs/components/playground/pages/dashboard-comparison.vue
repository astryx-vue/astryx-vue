<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import {
  Badge,
  Button,
  Card,
  DateRangeInput,
  Divider,
  Grid,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  LayoutHeader,
  pixel,
  ProgressBar,
  proportional,
  Selector,
  Table,
  Text,
  VStack,
} from '@astryx-vue/core'
import { h, ref } from 'vue'

/* recharts replaced with SVG sparklines; stylex grid rules use scoped CSS. */

interface Metric {
  key: string
  label: string
  value: string
  higherIsBetter: boolean
  deltas: { dd: number, ww: number, mm: number, yy: number }
  spark: number[]
}

const OVERVIEW_METRICS: Metric[] = [
  { key: 'active-users', label: 'Active users', value: '1.28M', higherIsBetter: true, deltas: { dd: 0.4, ww: 2.1, mm: 6.4, yy: 18.2 }, spark: [40, 42, 41, 44, 46, 45, 48, 50, 49, 52, 54, 53, 55, 57, 56, 58, 60, 59, 61, 63] },
  { key: 'sessions', label: 'Sessions', value: '3.42M', higherIsBetter: true, deltas: { dd: -0.2, ww: 1.4, mm: 4.8, yy: 12.6 }, spark: [50, 48, 49, 47, 46, 48, 50, 49, 51, 52, 50, 53, 54, 55, 53, 56, 57, 58, 59, 60] },
  { key: 'bounce', label: 'Bounce rate', value: '38.2%', higherIsBetter: false, deltas: { dd: -0.6, ww: -1.2, mm: -2.4, yy: -5.1 }, spark: [62, 60, 58, 57, 55, 54, 52, 50, 49, 48, 46, 45, 44, 43, 42, 41, 40, 39, 38, 37] },
  { key: 'retention', label: 'Day-7 retention', value: '41.6%', higherIsBetter: true, deltas: { dd: 0.1, ww: 0.8, mm: 2.2, yy: 6.3 }, spark: [30, 31, 32, 33, 32, 34, 35, 36, 35, 37, 38, 39, 38, 40, 41, 40, 42, 41, 43, 42] },
]

const AGE_DATA = [
  { label: '18–24', value: 26, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { label: '25–34', value: 34, color: 'var(--color-data-categorical-teal, #08A3A3)' },
  { label: '35–44', value: 21, color: 'var(--color-data-categorical-green, #0B991F)' },
  { label: '45–54', value: 12, color: 'var(--color-data-categorical-orange, #EB6E00)' },
  { label: '55+', value: 7, color: 'var(--color-data-neutral, #8494A3)' },
]

const GENDER_DATA = [
  { label: 'Women', value: 48, color: 'var(--color-data-categorical-purple, #6B1EFD)' },
  { label: 'Men', value: 46, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { label: 'Non-binary', value: 4, color: 'var(--color-data-categorical-teal, #08A3A3)' },
  { label: 'Prefer not to say', value: 2, color: 'var(--color-data-neutral, #8494A3)' },
]

const DEVICE_DATA = [
  { label: 'Mobile', value: 52, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { label: 'Desktop', value: 38, color: 'var(--color-data-categorical-orange, #EB6E00)' },
  { label: 'Tablet', value: 10, color: 'var(--color-data-categorical-green, #0B991F)' },
]

interface AcqRow extends Record<string, unknown> {
  id: string
  channel: string
  users: number
  share: number
  cvr: number
}

const ACQUISITION: AcqRow[] = [
  { id: '1', channel: 'Organic search', users: 482000, share: 38, cvr: 4.2 },
  { id: '2', channel: 'Paid social', users: 214000, share: 17, cvr: 2.8 },
  { id: '3', channel: 'Email', users: 168000, share: 13, cvr: 6.1 },
  { id: '4', channel: 'Referral', users: 142000, share: 11, cvr: 5.4 },
  { id: '5', channel: 'Direct', users: 264000, share: 21, cvr: 3.9 },
]

const range = ref({ start: '2026-03-01', end: '2026-03-30' })
const segment = ref('all')
const device = ref('all')

const SEGMENT_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'new', label: 'New users' },
  { value: 'returning', label: 'Returning' },
]

const DEVICE_OPTIONS = [
  { value: 'all', label: 'All devices' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'tablet', label: 'Tablet' },
]

const acquisitionColumns: TableColumn<AcqRow>[] = [
  { key: 'channel', header: 'Channel', width: proportional(2) },
  { key: 'users', header: 'Users', width: pixel(120), renderCell: row => h(Text, { type: 'body' }, () => row.users.toLocaleString()) },
  { key: 'share', header: 'Share', width: pixel(100), renderCell: row => h(Text, { type: 'body' }, () => `${row.share}%`) },
  {
    key: 'cvr',
    header: 'CVR',
    width: proportional(1),
    renderCell: row => h(ProgressBar, { value: row.cvr, max: 10, label: `${row.cvr}%`, isLabelHidden: true }),
  },
]

function sparkPath(data: number[]) {
  const w = 100
  const h = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')
}

function deltaColor(delta: number, higherIsBetter: boolean) {
  const good = higherIsBetter ? delta >= 0 : delta <= 0
  return good ? 'success' : 'error'
}
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider :padding="6">
        <VStack :gap="4">
          <Heading :level="2">User analytics</Heading>
          <HStack :gap="3" wrap="wrap" :align="'center'">
            <DateRangeInput v-model="range" label="Date range" is-label-hidden />
            <Selector v-model="segment" label="Segment" is-label-hidden :options="SEGMENT_OPTIONS" />
            <Selector v-model="device" label="Device" is-label-hidden :options="DEVICE_OPTIONS" />
            <Button label="Export" variant="secondary">
              <template #icon><Icon icon="i-heroicons-arrow-down-tray" size="sm" /></template>
            </Button>
          </HStack>
        </VStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6">
      <VStack :gap="10">
        <VStack :gap="6">
          <HStack :gap="2" :align="'center'">
            <Icon icon="i-heroicons-users" size="sm" color="secondary" />
            <VStack :gap="0">
              <Heading :level="3">Key metrics</Heading>
              <Text type="supporting" color="secondary">Change vs. prior day, week, month, and year</Text>
            </VStack>
          </HStack>
          <Grid :columns="{ minWidth: 240, repeat: 'fit' }" :gap="3" class="metrics-grid">
            <Card v-for="metric in OVERVIEW_METRICS" :key="metric.key" :padding="4">
              <VStack :gap="2">
                <Text type="supporting" color="secondary">{{ metric.label }}</Text>
                <Heading :level="2">{{ metric.value }}</Heading>
                <HStack :gap="2" wrap="wrap">
                  <Badge v-for="(delta, key) in metric.deltas" :key="key" :label="`${key}: ${delta > 0 ? '+' : ''}${delta}%`" :variant="deltaColor(delta, metric.higherIsBetter) === 'success' ? 'green' : 'red'" />
                </HStack>
                <svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
                  <path :d="sparkPath(metric.spark)" fill="none" stroke="var(--color-data-categorical-blue)" stroke-width="1.5" />
                </svg>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <HStack :gap="2" :align="'center'">
            <Icon icon="i-heroicons-cursor-arrow-rays" size="sm" color="secondary" />
            <VStack :gap="0">
              <Heading :level="3">Devices</Heading>
              <Text type="supporting" color="secondary">Daily active users (thousands)</Text>
            </VStack>
          </HStack>
          <Card :padding="6">
            <Text type="label">Daily active users by device type</Text>
            <svg class="trend-chart" viewBox="0 0 400 120" aria-hidden="true">
              <path d="M0,80 L50,70 L100,75 L150,60 L200,55 L250,50 L300,45 L350,40 L400,35" fill="none" stroke="var(--color-data-categorical-blue)" stroke-width="2" />
            </svg>
          </Card>
        </VStack>

        <Divider />

        <VStack :gap="6">
          <Heading :level="3">Audience demographics</Heading>
          <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
            <Card v-for="(data, title) in { Age: AGE_DATA, Gender: GENDER_DATA, Device: DEVICE_DATA }" :key="title" :padding="4">
              <VStack :gap="3">
                <Heading :level="4">{{ title }}</Heading>
                <div class="breakdown-bar">
                  <div v-for="seg in data" :key="seg.label" class="breakdown-bar__seg" :style="{ width: `${seg.value}%`, background: seg.color }" />
                </div>
                <HStack :gap="3" wrap="wrap">
                  <Text v-for="seg in data" :key="seg.label" type="supporting">{{ seg.label }} {{ seg.value }}%</Text>
                </HStack>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <Heading :level="3">Acquisition channels</Heading>
          <Card>
            <Table :data="ACQUISITION" :columns="acquisitionColumns" id-key="id" density="balanced" dividers="rows" has-hover />
          </Card>
        </VStack>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.metrics-grid { align-items: stretch; }
.spark { width: 100%; height: 32px; display: block; }
.trend-chart { width: 100%; height: 120px; margin-top: var(--spacing-4); }
.breakdown-bar { display: flex; width: 100%; height: 12px; border-radius: 4px; overflow: hidden; }
.breakdown-bar__seg { height: 100%; }
</style>
