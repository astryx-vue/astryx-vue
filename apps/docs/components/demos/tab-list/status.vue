<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('production')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="production">
      Production
      <StatusDot label="Healthy" variant="success" />
    </Tab>
    <Tab value="staging">
      Staging
      <StatusDot label="Degraded" variant="warning" />
    </Tab>
    <Tab value="development">
      Development
    </Tab>
  </TabList>
</template>
