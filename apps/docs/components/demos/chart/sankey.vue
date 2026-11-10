<script setup lang="ts">
import { SankeyChart, SankeyGrid, SankeyLabel, SankeyLink, SankeyNode } from '@astryx-vue/charts'

const nodes = [
  { id: 'search', label: 'Search', value: 45 },
  { id: 'direct', label: 'Direct', value: 35 },
  { id: 'social', label: 'Social', value: 20 },
  { id: 'product', label: 'Product', value: 60 },
  { id: 'docs', label: 'Docs', value: 40 },
  { id: 'activated', label: 'Activated', value: 55 },
  { id: 'dropped', label: 'Dropped', value: 45 },
]

const links = [
  { source: 'search', target: 'product', value: 28 },
  { source: 'search', target: 'docs', value: 17 },
  { source: 'direct', target: 'product', value: 22 },
  { source: 'direct', target: 'docs', value: 13 },
  { source: 'social', target: 'product', value: 10 },
  { source: 'social', target: 'docs', value: 10 },
  { source: 'product', target: 'activated', value: 38 },
  { source: 'product', target: 'dropped', value: 22 },
  { source: 'docs', target: 'activated', value: 17 },
  { source: 'docs', target: 'dropped', value: 23 },
]

const columns = [
  { ids: ['search', 'direct', 'social'], label: 'Acquisition' },
  { ids: ['product', 'docs'], label: 'Engagement' },
  { ids: ['activated', 'dropped'], label: 'Outcome' },
]
</script>

<template>
  <SankeyChart
    :nodes="nodes"
    :links="links"
    :columns="columns"
    :width="720"
    :height="340"
    :min-column-width="220"
    label="Visitor activation flow"
  >
    <SankeyGrid />
    <SankeyLink :opacity="0.72" />
    <SankeyNode />
    <SankeyLabel />
  </SankeyChart>
</template>
