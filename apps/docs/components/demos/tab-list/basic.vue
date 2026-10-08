<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      Overview
    </Tab>
    <Tab value="props">
      Props
    </Tab>
    <Tab value="examples">
      Examples
    </Tab>
  </TabList>
</template>
