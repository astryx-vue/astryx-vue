<script setup lang="ts">
import { Tab, TabList, TabMenu } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('settings')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      Overview
    </Tab>
    <Tab value="activity">
      Activity
    </Tab>
    <TabMenu
      label="More"
      :options="[
        { value: 'settings', label: 'Settings' },
        { value: 'integrations', label: 'Integrations' },
        { value: 'billing', label: 'Billing' },
      ]"
    />
  </TabList>
</template>
