<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const sections = [
  'Overview',
  'Activity',
  'Members',
  'Projects',
  'Milestones',
  'Releases',
  'Integrations',
  'Billing',
  'Security',
  'Audit log',
  'Settings',
]
const value = ref('Releases')
</script>

<template>
  <div style="max-width: 360px; width: 100%">
    <TabList v-model:value="value" has-divider>
      <Tab v-for="section in sections" :key="section" :value="section">
        {{ section }}
      </Tab>
    </TabList>
  </div>
</template>
