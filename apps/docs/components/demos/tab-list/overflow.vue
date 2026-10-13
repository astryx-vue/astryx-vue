<script setup lang="ts">
import { Tab, TabList, TabMenu } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('home')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="home">
      Home
    </Tab>
    <Tab value="projects">
      Projects
    </Tab>
    <TabMenu
      label="More"
      :options="[
        { value: 'analytics', label: 'Analytics' },
        { value: 'reports', label: 'Reports' },
        { value: 'billing', label: 'Billing' },
      ]"
    />
  </TabList>
</template>
