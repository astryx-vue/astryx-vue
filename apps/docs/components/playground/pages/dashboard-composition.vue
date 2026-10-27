<script setup lang="ts">
import type { TableColumn } from '@astryx-vue/core'
import { h, ref } from 'vue'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  DropdownMenu,
  Grid,
  GridSpan,
  Heading,
  HStack,
  Icon,
  Layout,
  LayoutContent,
  Link,
  List,
  ListItem,
  Table,
  Text,
  VStack,
  proportional,
} from '@astryx-vue/core'
import { PlaygroundAreaChart, PlaygroundResponsive, PlaygroundSparkline } from '@astryx-vue/playground-charts'

interface StockRow extends Record<string, unknown> {
  id: string
  ticker: string
  price: string
  dailyPts: number
  dailyPct: number
  weekChg: number
  spark: number[]
}

function genSpark(
  seed: number,
  start: number,
  end: number,
  volatility: number,
  N: number = 96,
): number[] {
  let s = seed >>> 0;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const points: number[] = [];
  let drift = 0;
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const trend = start + (end - start) * t;
    // Multiple overlaid waves at different frequencies for session-like rhythm
    // plus high-frequency chop.
    const wave =
      Math.sin(t * Math.PI * 2.3 + seed * 0.13) * volatility * 1.4 +
      Math.sin(t * Math.PI * 5.7 + seed * 0.41) * volatility * 0.9 +
      Math.sin(t * Math.PI * 13.1 + seed * 0.07) * volatility * 0.5;
    // Loosely-correlated random walk so adjacent ticks jitter rather than glide.
    drift = drift * 0.55 + (rand() - 0.5) * volatility * 2.2;
    // Occasional sharper spike to mimic news-driven moves.
    const spike = rand() < 0.04 ? (rand() - 0.5) * volatility * 4 : 0;
    points.push(trend + wave + drift + spike);
  }
  return points;
}

const portfolioData = (() => {
  const anchors: Array<[number, number]> = [
    [0, 230000],
    [14, 238000],
    [28, 245000],
    [42, 250000],
    [56, 245000],
    [70, 258000],
    [84, 252000],
    [98, 260000],
    [112, 255000],
    [126, 245000],
    [140, 222000],
    [154, 218000],
    [168, 225000],
    [182, 232000],
    [196, 225000],
    [210, 235000],
    [224, 240000],
    [238, 245000],
    [252, 235000],
    [266, 248000],
    [280, 255000],
    [294, 260000],
    [308, 268000],
    [322, 275000],
    [336, 278000],
    [350, 285000],
    [364, 288000],
    [378, 290000],
    [392, 292000],
    [406, 294200],
  ];
  const totalDays = anchors[anchors.length - 1][0];
  const monthPerDay = 12 / totalDays;
  const out: Array<{month: number; label: string; value: number}> = [];
  let ai = 0;
  for (let day = 0; day <= totalDays; day++) {
    while (ai < anchors.length - 2 && day >= anchors[ai + 1][0]) {
      ai++;
    }
    const [d0, v0] = anchors[ai];
    const [d1, v1] = anchors[ai + 1];
    const t = (day - d0) / (d1 - d0);
    const base = v0 + (v1 - v0) * t;
    const seed = Math.sin(day * 12.9898 + 78.233) * 43758.5453;
    const noise = (seed - Math.floor(seed) - 0.5) * 3600;
    out.push({
      month: day * monthPerDay,
      label: `Day ${day + 1}`,
      value: Math.round(base + noise),
    });
  }
  return out;
})();

const xAxisTicks = [0, 3, 6, 9, 12]
const xAxisLabels: Record<number, string> = { 0: 'Oct', 3: 'Jan', 6: 'Apr', 9: 'Jul', 12: 'Oct' }

const metrics = [
  {value: '$294,200', change: '+14.8%', label: 'Total value'},
  {value: '14.8%', change: '+2.1%', label: 'Annual return'},
  {value: '2.8%', change: '$2,060/qtr', label: 'Dividend yield'},
  {value: '23', change: '+4 YTD', label: 'Total asset holdings'},
];

const topAssets = [
  {ticker: 'AAPL', name: 'Apple Inc.', value: '$87,200', change: '+18.4%'},
  {ticker: 'MSFT', name: 'Microsoft Corp.', value: '$72,500', change: '+14.7%'},
  {ticker: 'NVDA', name: 'NVIDIA Corp.', value: '$63,800', change: '+31.2%'},
  {
    ticker: 'VTI',
    name: 'Vanguard Total Stock',
    value: '$58,400',
    change: '+11.3%',
  },
  {
    ticker: 'BND',
    name: 'Vanguard Total Bond',
    value: '$45,600',
    change: '+4.2%',
  },
];

const marketIndices = [
  {
    name: 'Dow Jones',
    ticker: 'DJI',
    price: '43,821.67',
    change: '+0.42%',
    positive: true,
    spark: genSpark(1337, 78, 84, 3.2),
  },
  {
    name: 'NASDAQ',
    ticker: 'IXIC',
    price: '18,942.18',
    change: '-0.50%',
    positive: false,
    spark: genSpark(2042, 86, 78, 3.8),
  },
  {
    name: 'S&P 500',
    ticker: 'SPX',
    price: '5,918.33',
    change: '+0.21%',
    positive: true,
    spark: genSpark(3155, 71, 75, 2.8),
  },
  {
    name: 'NYSE Composite',
    ticker: 'NYA',
    price: '19,752.41',
    change: '-0.20%',
    positive: false,
    spark: genSpark(4287, 70, 65, 3.0),
  },
  {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    price: '$177.39',
    change: '+0.93%',
    positive: true,
    spark: genSpark(5519, 60, 67, 3.6),
  },
  {
    name: 'Intel Corp.',
    ticker: 'INTC',
    price: '$50.38',
    change: '+4.89%',
    positive: true,
    spark: genSpark(6701, 40, 51, 2.6),
  },
  {
    name: 'Nokia Corp.',
    ticker: 'NOK',
    price: '$8.82',
    change: '+6.65%',
    positive: true,
    spark: genSpark(7823, 30, 41, 2.4),
  },
  {
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    price: '$360.59',
    change: '-5.42%',
    positive: false,
    spark: genSpark(8945, 90, 76, 4.2),
  },
];

const trendingStocks: StockRow[] = [
  {
    id: '1',
    ticker: 'AAPL',
    price: '$188.72',
    dailyPts: 1.35,
    dailyPct: 0.72,
    weekChg: 22.4,
    spark: genSpark(11023, 60, 70, 2.6, 48),
  },
  {
    id: '2',
    ticker: 'MSFT',
    price: '$415.6',
    dailyPts: 3.2,
    dailyPct: 0.78,
    weekChg: 18.6,
    spark: genSpark(12591, 55, 65, 2.4, 48),
  },
  {
    id: '3',
    ticker: 'NVDA',
    price: '$177.39',
    dailyPts: 1.65,
    dailyPct: 0.93,
    weekChg: 45.2,
    spark: genSpark(13744, 40, 68, 3.8, 48),
  },
  {
    id: '4',
    ticker: 'AMZN',
    price: '$186.5',
    dailyPts: -0.8,
    dailyPct: -0.43,
    weekChg: 15.3,
    spark: genSpark(14882, 70, 63, 2.5, 48),
  },
  {
    id: '5',
    ticker: 'GOOGL',
    price: '$155.72',
    dailyPts: 2.1,
    dailyPct: 1.37,
    weekChg: 12.8,
    spark: genSpark(15967, 50, 60, 2.7, 48),
  },
  {
    id: '6',
    ticker: 'META',
    price: '$505.3',
    dailyPts: 4.5,
    dailyPct: 0.9,
    weekChg: 35.1,
    spark: genSpark(17105, 45, 61, 3.0, 48),
  },
  {
    id: '7',
    ticker: 'TSLA',
    price: '$360.59',
    dailyPts: -20.67,
    dailyPct: -5.42,
    weekChg: -8.3,
    spark: genSpark(18249, 90, 64, 4.4, 48),
  },
  {
    id: '8',
    ticker: 'INTC',
    price: '$50.38',
    dailyPts: 2.35,
    dailyPct: 4.89,
    weekChg: -12.5,
    spark: genSpark(19388, 65, 57, 2.8, 48),
  },
  {
    id: '9',
    ticker: 'AMD',
    price: '$162.45',
    dailyPts: -1.2,
    dailyPct: -0.73,
    weekChg: 28.7,
    spark: genSpark(20471, 50, 63, 2.9, 48),
  },
  {
    id: '10',
    ticker: 'NFLX',
    price: '$628.9',
    dailyPts: 5.4,
    dailyPct: 0.87,
    weekChg: 42.1,
    spark: genSpark(21556, 42, 58, 2.6, 48),
  },
];

const trendingColumns: TableColumn<StockRow>[] = [
  { key: 'ticker', header: 'Ticker', width: proportional(1), renderCell: row => h(Text, { type: 'body', weight: 'bold' }, () => row.ticker) },
  { key: 'price', header: 'Price', width: proportional(1) },
  { key: 'dailyPts', header: 'Daily Chg (pts)', width: proportional(1), renderCell: row => h(Badge, { variant: row.dailyPts >= 0 ? 'green' : 'red', label: (row.dailyPts >= 0 ? '+' : '') + row.dailyPts.toFixed(2) }) },
  { key: 'dailyPct', header: 'Daily Chg (%)', width: proportional(1), renderCell: row => h(Badge, { variant: row.dailyPct >= 0 ? 'green' : 'red', label: (row.dailyPct >= 0 ? '+' : '') + row.dailyPct.toFixed(2) + '%' }) },
  { key: 'weekChg', header: '52W Chg (%)', width: proportional(1), renderCell: row => h(Badge, { variant: row.weekChg >= 0 ? 'green' : 'red', label: (row.weekChg >= 0 ? '+' : '') + row.weekChg.toFixed(1) + '%' }) },
  { key: 'spark', header: '24h Trend', width: proportional(1), renderCell: row => h(PlaygroundSparkline, { data: row.spark, color: row.dailyPct >= 0 ? 'var(--astryx-color-data-categorical-green, #0B991F)' : 'var(--astryx-color-data-categorical-red, #F5394F)', height: 24, strokeWidth: 1, isMeasured: true, padTop: 2, padBottom: 2 }) },
]

const timeRange = ref('1 year')
</script>

<template>
  <Layout height="fill">
    <template #default>
      <LayoutContent :padding="6">
        <VStack :gap="6">
          <HStack justify="between" align="center">
            <Heading :level="1">My Portfolio</Heading>
            <DropdownMenu
              :button="{ label: timeRange, variant: 'secondary', size: 'lg' }"
              has-chevron
              :items="[
                { label: '1 month', onClick: () => timeRange = '1 month' },
                { label: '3 months', onClick: () => timeRange = '3 months' },
                { label: '6 months', onClick: () => timeRange = '6 months' },
                { label: '1 year', onClick: () => timeRange = '1 year' },
                { label: '5 years', onClick: () => timeRange = '5 years' },
                { label: 'All time', onClick: () => timeRange = 'All time' },
              ]"
            />
          </HStack>

          <Grid :columns="{ minWidth: 280, repeat: 'fit' }" :gap="4">
            <Grid v-for="group in [0, 1]" :key="group" :columns="{ minWidth: 280, repeat: 'fit' }" :gap="4">
              <Card v-for="m in metrics.slice(group * 2, group * 2 + 2)" :key="m.label">
                <VStack :gap="1">
                  <HStack :gap="3" align="center">
                    <Text type="display-3" weight="bold">{{ m.value }}</Text>
                    <HStack :gap="1" align="center">
                      <Icon :icon="!m.change.startsWith('-') ? 'arrowUp' : 'arrowDown'" size="xsm" :color="!m.change.startsWith('-') ? 'success' : 'error'" />
                      <Text type="body" color="secondary">{{ m.change }}</Text>
                    </HStack>
                  </HStack>
                  <Text type="body" color="secondary">{{ m.label }}</Text>
                </VStack>
              </Card>
            </Grid>
          </Grid>

          <Grid :columns="{ minWidth: 280, max: 4 }" :gap="4">
            <GridSpan :columns="3">
              <Card>
                <VStack :gap="4">
                  <HStack justify="between" align="center">
                    <Heading :level="3">Portfolio Value</Heading>
                    <Link href="#">View details</Link>
                  </HStack>
                  <PlaygroundResponsive :height="340">
                    <PlaygroundAreaChart
                      :data="portfolioData"
                      x-key="month"
                      y-key="value"
                      color="var(--astryx-color-data-categorical-green, #0B991F)"
                      :height="340"
                      :y-domain="[200000, 320000]"
                      :y-ticks="[200000, 240000, 280000, 320000]"
                      :pad="{ top: 10, right: 10, bottom: 35, left: 50 }"
                      center-ticks
                      :x-domain="[0, 12]"
                      :x-ticks="xAxisTicks"
                      :x-tick-format="(v: number) => xAxisLabels[v] ?? ''"
                      :y-tick-format="(v: number) => `$${(v / 1000).toFixed(0)}k`"
                    />
                  </PlaygroundResponsive>
                </VStack>
              </Card>
            </GridSpan>
            <GridSpan :columns="1">
              <Card>
                <VStack :gap="4">
                  <HStack justify="between" align="center">
                    <Heading :level="3">Top Assets</Heading>
                    <Link href="#">View all</Link>
                  </HStack>
                  <List density="spacious">
                    <ListItem
                      v-for="asset in topAssets"
                      :key="asset.ticker"
                      :label="asset.ticker"
                      :description="asset.name"
                      href="#"
                    >
                      <template #startContent>
                        <Avatar :name="asset.ticker" size="md" />
                      </template>
                      <template #endContent>
                        <VStack :gap="0" justify="end">
                          <Text type="body">{{ asset.value }}</Text>
                          <Badge :label="asset.change" :variant="asset.change.startsWith('-') ? 'red' : 'green'" />
                        </VStack>
                      </template>
                    </ListItem>
                  </List>
                </VStack>
              </Card>
            </GridSpan>
          </Grid>

          <Divider />

          <HStack justify="between" align="start">
            <VStack :gap="1">
              <Heading :level="1">Market Today</Heading>
              <Text type="body" color="secondary">Past 24 hours</Text>
            </VStack>
            <Button label="View more" variant="secondary" size="lg" />
          </HStack>

          <Grid :columns="{ minWidth: 320, repeat: 'fit' }" :gap="4">
            <Card v-for="m in marketIndices" :key="m.ticker">
              <VStack :gap="4">
                <VStack :gap="0">
                  <Heading :level="3">{{ m.name }}</Heading>
                  <Text type="supporting" color="secondary">{{ m.ticker }}</Text>
                </VStack>
                <PlaygroundSparkline :data="m.spark" :color="m.positive ? 'var(--astryx-color-data-categorical-green, #0B991F)' : 'var(--astryx-color-data-categorical-red, #F5394F)'" is-measured :pad-top="2" :pad-bottom="2" />
                <HStack :gap="3" align="center">
                  <Text type="display-3" weight="bold">{{ m.price }}</Text>
                  <HStack :gap="1" align="center">
                    <Icon :icon="m.positive ? 'arrowUp' : 'arrowDown'" size="xsm" :color="m.positive ? 'success' : 'error'" />
                    <Text type="body" color="secondary">{{ m.change }}</Text>
                  </HStack>
                </HStack>
              </VStack>
            </Card>
          </Grid>

          <Card>
            <VStack :gap="4">
              <Heading :level="3">Trending Stocks</Heading>
              <Table :data="trendingStocks" :columns="trendingColumns" id-key="id" has-hover dividers="rows" />
            </VStack>
          </Card>
        </VStack>
      </LayoutContent>
    </template>
  </Layout>
</template>
