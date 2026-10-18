<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('production')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="production">
      <template #endContent>
        <StatusDot label="Healthy" variant="success" />
      </template>
      Production
    </Tab>
    <Tab value="staging">
      <template #endContent>
        <StatusDot label="Degraded" variant="warning" />
      </template>
      Staging
    </Tab>
    <Tab value="development">
      Development
    </Tab>
  </TabList>
</template>
