<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
import { Text } from '@astryx-vue/core/Text'

const metrics = [
  { label: 'Revenue', value: '$48,290' },
  { label: 'Active Users', value: '12,841' },
  { label: 'Conversion', value: '3.2%' },
  { label: 'Avg Response', value: '245ms' },
]
</script>

<template>
  <Grid :columns="4" :gap="4" width="100%" style="max-width: 500px">
    <GridSpan :columns="2" :rows="2">
      <Card>
        <Text display="block" type="label">
          Weekly Traffic
        </Text>
        <Text display="block" type="supporting">
          Page views and unique visitors over the last 7 days
        </Text>
      </Card>
    </GridSpan>
    <Card v-for="metric in metrics" :key="metric.label">
      <Text display="block" type="supporting">
        {{ metric.label }}
      </Text>
      <Text display="block" type="label">
        {{ metric.value }}
      </Text>
    </Card>
    <GridSpan columns="full">
      <Card>
        <Text display="block" type="label">
          Recent Activity
        </Text>
        <Text display="block" type="supporting">
          Latest events across all projects
        </Text>
      </Card>
    </GridSpan>
  </Grid>
</template>
