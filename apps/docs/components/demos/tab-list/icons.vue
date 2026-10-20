<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('home')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="home">
      <template #icon>
        <span class="css-icon css-icon--sm i-carbon-home" />
      </template>
      Home
    </Tab>
    <Tab value="settings">
      <template #icon>
        <span class="css-icon css-icon--sm i-carbon-settings" />
      </template>
      Settings
    </Tab>
  </TabList>
</template>
