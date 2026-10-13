<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('home')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="home">
      <span class="css-icon css-icon--sm i-carbon-home" />
      Home
    </Tab>
    <Tab value="settings">
      <span class="css-icon css-icon--sm i-carbon-settings" />
      Settings
    </Tab>
  </TabList>
</template>
