<script setup lang="ts">
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
  LayoutPanel,
  ProgressBar,
  Selector,
  Text,
  useMediaQuery,
  VStack,
} from '@astryx-vue/core'
import { computed, ref } from 'vue'

const isNarrow = useMediaQuery('(max-width: 1024px)')
const period = ref('q1')

const PERIOD_OPTIONS = [
  { value: 'q1', label: 'Q1 2026' },
  { value: 'q2', label: 'Q2 2026' },
  { value: 'q3', label: 'Q3 2026' },
]

interface Kpi {
  key: string
  label: string
  value: string
  delta: { WoW: number, MoM: number, QoQ: number }
  higherIsBetter: boolean
}

const KPIS: Kpi[] = [
  { key: 'revenue', label: 'Net revenue', value: '$4.82M', delta: { WoW: 2.4, MoM: 6.1, QoQ: 14.3 }, higherIsBetter: true },
  { key: 'arr', label: 'ARR', value: '$58.1M', delta: { WoW: 1.1, MoM: 3.8, QoQ: 11.2 }, higherIsBetter: true },
  { key: 'nps', label: 'NPS', value: '62', delta: { WoW: 0.5, MoM: 1.2, QoQ: 4.0 }, higherIsBetter: true },
  { key: 'churn', label: 'Logo churn', value: '1.8%', delta: { WoW: -0.1, MoM: -0.3, QoQ: -0.6 }, higherIsBetter: false },
]

interface Okr {
  objective: string
  owner: string
  actual: number
  target: number
  unit: string
}

const OKRS: Okr[] = [
  { objective: 'Reach $60M ARR', owner: 'Dana Whitfield · CRO', actual: 58.1, target: 60, unit: 'M' },
  { objective: 'Expand into 3 new enterprise verticals', owner: 'Marcus Lin · VP Sales', actual: 2, target: 3, unit: '' },
  { objective: 'Ship self-serve analytics to GA', owner: 'Priya Shah · VP Product', actual: 85, target: 100, unit: '%' },
]

const TRENDS = [
  { key: 'revenue', label: 'Net revenue', series: [3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.5, 4.82] },
  { key: 'users', label: 'Active accounts', series: [920, 940, 960, 980, 1000, 1020, 1050, 1080] },
  { key: 'nps', label: 'NPS', series: [54, 55, 56, 57, 58, 59, 60, 62] },
  { key: 'support', label: 'Tickets resolved <24h', series: [78, 80, 82, 84, 85, 86, 88, 90] },
]

const okrSummary = computed(() => `${OKRS.filter(o => o.actual >= o.target).length} of ${OKRS.length} on track`)

function trendPath(values: number[]) {
  const w = 200
  const h = 60
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  return values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - ((v - min) / range) * h
    return `${i === 0 ? 'M' : 'L'}${x},${y}`
  }).join(' ')
}
</script>

<template>
  <Layout height="fill">
    <template #header>
      <LayoutHeader has-divider :padding="6">
        <HStack :justify="'between'" :align="'center'" wrap="wrap" :gap="4">
          <Heading :level="2">Executive scorecard</Heading>
          <HStack :gap="2" :align="'center'">
            <Selector v-model="period" label="Period" is-label-hidden :options="PERIOD_OPTIONS" />
            <Button label="Export" variant="secondary">
              <template #icon><Icon icon="i-heroicons-arrow-down-tray" size="sm" /></template>
            </Button>
          </HStack>
        </HStack>
      </LayoutHeader>
    </template>

    <LayoutContent :padding="6" class="content-pad">
      <VStack :gap="10">
        <VStack v-if="isNarrow" :gap="6">
          <Heading :level="3">What changed &amp; why</Heading>
          <Card :padding="4">
            <Text type="body" color="secondary">
              Revenue grew 6.1% MoM driven by enterprise expansion in healthcare and fintech. NPS improved after the onboarding redesign shipped in February.
            </Text>
          </Card>
        </VStack>

        <VStack :gap="6">
          <Heading :level="3">Scorecards</Heading>
          <Grid :gap="2" class="scorecard-grid">
            <Card v-for="kpi in KPIS" :key="kpi.key" :padding="4">
              <VStack :gap="1">
                <Text type="supporting" color="secondary">{{ kpi.label }}</Text>
                <Heading :level="2">{{ kpi.value }}</Heading>
                <Text type="supporting">WoW {{ kpi.delta.WoW }}% · MoM {{ kpi.delta.MoM }}% · QoQ {{ kpi.delta.QoQ }}%</Text>
              </VStack>
            </Card>
          </Grid>
        </VStack>

        <VStack :gap="6">
          <Heading :level="3">Goal attainment</Heading>
          <Text type="supporting" color="secondary">{{ okrSummary }}</Text>
          <Card :padding="6">
            <VStack :gap="6">
              <template v-for="(okr, i) in OKRS" :key="okr.objective">
                <Divider v-if="i > 0" />
                <VStack :gap="2">
                  <Heading :level="4">{{ okr.objective }}</Heading>
                  <Text type="supporting" color="secondary">{{ okr.owner }}</Text>
                  <ProgressBar :value="okr.actual" :max="okr.target" :label="`${okr.actual}${okr.unit} / ${okr.target}${okr.unit}`" />
                </VStack>
              </template>
            </VStack>
          </Card>
        </VStack>

        <VStack :gap="6">
          <Heading :level="3">Trends</Heading>
          <Grid :columns="{ minWidth: 330, repeat: 'fit' }" :gap="3">
            <Card v-for="trend in TRENDS" :key="trend.key" :padding="4">
              <VStack :gap="2">
                <Text type="label">{{ trend.label }}</Text>
                <svg class="trend" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                  <path :d="trendPath(trend.series)" fill="none" stroke="var(--astryx-color-data-categorical-blue)" stroke-width="2" />
                </svg>
              </VStack>
            </Card>
          </Grid>
        </VStack>
      </VStack>
    </LayoutContent>

    <template v-if="!isNarrow" #end>
      <LayoutPanel :width="400" :padding="6" has-divider role="complementary" label="What changed and why">
        <VStack :gap="6">
          <Heading :level="3">What changed &amp; why</Heading>
          <Text type="body" color="secondary">
            Revenue grew 6.1% MoM driven by enterprise expansion in healthcare and fintech. NPS improved after the onboarding redesign shipped in February. Logo churn ticked down as success outreach reduced early-stage cancellations.
          </Text>
        </VStack>
      </LayoutPanel>
    </template>
  </Layout>
</template>

<style scoped>
.scorecard-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
.trend { width: 100%; height: 60px; display: block; }
.content-pad { padding-bottom: var(--astryx-spacing-10); }
</style>
