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
import { computed, h } from 'vue'

/* recharts is not available — charts use inline SVG with the same series data. */

const metrics = [
  { label: 'Monthly Visitors', value: '27.3 k', change: '+18.2%', positive: true, sparkline: [48, 46, 44, 42, 40, 18, 16, 38, 36, 34, 32, 30, 12, 10, 28, 26, 28, 32, 36, 14, 12, 40, 44, 48, 52, 56, 28, 24, 58, 62] },
  { label: 'Monthly Page Views', value: '48.2 k', change: '+12.5%', positive: true, sparkline: [36, 38, 35, 37, 36, 14, 12, 38, 36, 34, 37, 35, 12, 10, 36, 34, 36, 35, 38, 14, 12, 40, 44, 50, 54, 56, 26, 22, 58, 60] },
  { label: 'Avg. Session', value: '4.5 min', change: '-14.3%', positive: false, sparkline: [58, 56, 60, 58, 62, 30, 26, 60, 58, 62, 60, 58, 28, 24, 56, 54, 50, 46, 42, 18, 14, 38, 36, 34, 32, 30, 10, 8, 28, 26] },
  { label: 'Bounce Rate', value: '32.1%', change: '-8.7%', positive: true, sparkline: [52, 56, 50, 54, 58, 62, 60, 54, 52, 56, 50, 54, 60, 58, 50, 48, 46, 44, 40, 46, 44, 38, 36, 34, 36, 32, 38, 36, 30, 28] },
]

const regionData = [
  { label: 'NORAM', value: 38, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { label: 'EMEA', value: 28, color: 'var(--color-data-categorical-orange, #EB6E00)' },
  { label: 'APAC', value: 22, color: 'var(--color-data-categorical-green, #0B991F)' },
  { label: 'LATAM', value: 12, color: 'var(--color-data-categorical-purple, #6B1EFD)' },
]

const roleData = [
  { label: 'Engineering', value: 34, color: 'var(--color-data-categorical-blue, #0171E3)' },
  { label: 'Design', value: 18, color: 'var(--color-data-categorical-orange, #EB6E00)' },
  { label: 'Product', value: 22, color: 'var(--color-data-categorical-green, #0B991F)' },
  { label: 'Other', value: 26, color: 'var(--color-data-neutral, #8494A3)' },
]

interface PageRow extends Record<string, unknown> {
  id: string
  page: string
  views: number
  newUsers: string
  avgTime: string
  exits: string
}

const topPagesData: PageRow[] = [
  { id: '1', page: '/home', views: 8420, newUsers: '62.3%', avgTime: '3:42', exits: '18.5%' },
  { id: '2', page: '/products', views: 6150, newUsers: '45.1%', avgTime: '4:15', exits: '22.8%' },
  { id: '3', page: '/pricing', views: 4320, newUsers: '38.7%', avgTime: '2:58', exits: '31.2%' },
  { id: '4', page: '/docs', views: 3890, newUsers: '28.4%', avgTime: '5:22', exits: '12.1%' },
  { id: '5', page: '/blog', views: 2740, newUsers: '51.6%', avgTime: '3:08', exits: '24.3%' },
]

interface EventRow extends Record<string, unknown> {
  id: string
  event: string
  count: number
  users: number
  newUsers: number
}

const topEventsData: EventRow[] = [
  { id: '1', event: 'page_view', count: 18420, users: 12300, newUsers: 4920 },
  { id: '2', event: 'session_start', count: 14850, users: 9870, newUsers: 3950 },
  { id: '3', event: 'first_visit', count: 8230, users: 8230, newUsers: 8230 },
  { id: '4', event: 'user_engagement', count: 6120, users: 4510, newUsers: 1580 },
  { id: '5', event: 'click', count: 3540, users: 2680, newUsers: 940 },
]

const topEventsMaxCount = Math.max(...topEventsData.map(d => d.count))

const topPagesColumns: TableColumn<PageRow>[] = [
  { key: 'page', header: 'Page', width: proportional(2) },
  { key: 'views', header: 'Views', width: pixel(100), renderCell: row => h(Text, { type: 'body' }, () => row.views.toLocaleString()) },
  { key: 'newUsers', header: 'New Users', width: pixel(100) },
  { key: 'avgTime', header: 'Avg. Time', width: pixel(100) },
  { key: 'exits', header: 'Exit Rate', width: pixel(100) },
]

const topEventsColumns: TableColumn<EventRow>[] = [
  { key: 'event', header: 'Event', width: pixel(160) },
  {
    key: 'count',
    header: 'Count',
    width: proportional(1),
    renderCell: item => h(VStack, { gap: 1 }, () => [
      h(ProgressBar, { value: item.count, max: topEventsMaxCount, label: String(item.count), isLabelHidden: true }),
      h(Text, { type: 'supporting' }, () => item.count.toLocaleString()),
    ]),
  },
  { key: 'users', header: 'Users', width: pixel(120), renderCell: item => h(Text, { type: 'body' }, () => item.users.toLocaleString()) },
  { key: 'newUsers', header: 'New Users', width: pixel(120), renderCell: item => h(Text, { type: 'body' }, () => item.newUsers.toLocaleString()) },
]

function sparkPath(data: number[], width = 120, height = 40) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

const activeUsersSample = [116, 118, 109, 100, 93, 85, 75, 65, 56, 48, 52, 58, 72, 88, 102, 110, 115, 117, 119, 118, 116, 114, 112, 110]

const activeUsersPath = computed(() => sparkPath(activeUsersSample, 600, 280))
</script>

<template>
  <Layout height="fill">
    <LayoutContent :padding="6">
      <VStack :gap="6">
        <VStack :gap="6">
          <HStack :justify="'between'" :align="'center'">
            <Heading :level="3">Active users</Heading>
            <Button label="Reload" variant="secondary" size="md">
              <template #icon>
                <Icon icon="i-heroicons-arrow-path" size="sm" />
              </template>
            </Button>
          </HStack>
          <Card :padding="4">
            <svg class="line-chart" viewBox="0 0 600 280" preserveAspectRatio="none" aria-hidden="true">
              <path :d="activeUsersPath" fill="none" stroke="var(--color-data-categorical-blue, #0171E3)" stroke-width="2" />
            </svg>
            <HStack :gap="4" class="legend">
              <HStack :gap="2" :align="'center'">
                <Icon icon="i-heroicons-stop-solid" size="xsm" style="color: var(--color-data-categorical-blue, #0171E3)" />
                <Text type="supporting" color="secondary">All users</Text>
              </HStack>
            </HStack>
          </Card>
        </VStack>

        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Grid v-for="start in [0, 2]" :key="start" :columns="{ minWidth: 240, repeat: 'fit' }" :gap="4">
            <Card v-for="m in metrics.slice(start, start + 2)" :key="m.label">
              <VStack :gap="2">
                <Heading :level="4">{{ m.label }}</Heading>
                <HStack :gap="2" :align="'center'">
                  <Heading :level="2">{{ m.value }}</Heading>
                  <HStack :gap="1" :align="'center'">
                    <Icon
                      :icon="m.positive ? 'i-heroicons-arrow-up' : 'i-heroicons-arrow-down'"
                      size="xsm"
                      :color="m.positive ? 'success' : 'error'"
                    />
                    <Text type="body" color="secondary">{{ m.change }}</Text>
                  </HStack>
                </HStack>
                <Text type="supporting" color="secondary">Last 30 days vs. Previous</Text>
                <svg class="sparkline" viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
                  <path :d="sparkPath(m.sparkline)" fill="none" stroke="var(--color-data-categorical-blue, #0171E3)" stroke-width="1.5" />
                </svg>
              </VStack>
            </Card>
          </Grid>
        </Grid>

        <Divider />

        <HStack :justify="'between'" :align="'center'">
          <Heading :level="3">Demographics</Heading>
          <Button label="View more" variant="secondary" size="md" />
        </HStack>
        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Card v-for="(title, idx) in ['Region', 'Role']" :key="title">
            <VStack :gap="4">
              <Heading :level="4">{{ title }}</Heading>
              <div class="stacked-bar">
                <template v-for="(d, i) in (idx === 0 ? regionData : roleData)" :key="d.label">
                  <div class="stacked-bar__segment" :style="{ width: `${d.value}%`, background: d.color, borderRadius: i === 0 ? '4px 0 0 4px' : i === (idx === 0 ? regionData.length : roleData.length) - 1 ? '0 4px 4px 0' : '0' }" />
                </template>
              </div>
              <HStack :gap="4" wrap="wrap">
                <VStack v-for="d in (idx === 0 ? regionData : roleData)" :key="d.label" :gap="0">
                  <HStack :gap="2" :align="'center'">
                    <Icon icon="i-heroicons-stop-solid" size="xsm" :style="{ color: d.color }" />
                    <Text type="supporting">{{ d.label }}</Text>
                  </HStack>
                  <Text type="supporting" color="secondary">{{ d.value }}%</Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </Grid>

        <Divider />

        <HStack :justify="'between'" :align="'center'">
          <Heading :level="3">Engagement</Heading>
          <Button label="View more" variant="secondary" size="md" />
        </HStack>
        <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
          <Card>
            <VStack :gap="6">
              <HStack :justify="'between'" :align="'center'">
                <Heading :level="4">Top pages</Heading>
                <Link href="#">All pages</Link>
              </HStack>
              <Table :data="topPagesData" :columns="topPagesColumns" id-key="id" density="compact" dividers="rows" has-hover />
            </VStack>
          </Card>
          <Card>
            <VStack :gap="6">
              <HStack :justify="'between'" :align="'center'">
                <Heading :level="4">Top events</Heading>
                <Link href="#">All events</Link>
              </HStack>
              <Table :data="topEventsData" :columns="topEventsColumns" id-key="id" density="compact" dividers="rows" has-hover />
            </VStack>
          </Card>
        </Grid>
      </VStack>
    </LayoutContent>
  </Layout>
</template>

<style scoped>
.line-chart { width: 100%; height: 300px; display: block; }
.sparkline { width: 100%; height: 40px; display: block; }
.legend { margin-top: var(--spacing-3); }
.stacked-bar { display: flex; width: 100%; height: 24px; overflow: hidden; border-radius: 4px; }
.stacked-bar__segment { height: 100%; }
</style>
