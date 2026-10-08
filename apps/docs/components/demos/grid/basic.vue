<script setup lang="ts">
import { Grid } from '@astryx-vue/core/Grid'

const metrics = [
  { label: 'Active users', value: '12,480' },
  { label: 'Sessions', value: '31,204' },
  { label: 'Retention', value: '68%' },
  { label: 'Avg. session', value: '4m 12s' },
  { label: 'Conversion', value: '3.4%' },
  { label: 'Revenue', value: '$48.2k' },
]
</script>

<template>
  <Grid class="grid-preview__grid" :columns="{ minWidth: 132 }" :gap="3">
    <div v-for="metric in metrics" :key="metric.label" class="grid-preview__tile">
      <span class="grid-preview__label">{{ metric.label }}</span>
      <span class="grid-preview__value">{{ metric.value }}</span>
    </div>
  </Grid>
</template>
