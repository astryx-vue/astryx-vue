<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('home')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="home" label="Home" />
    <Tab value="projects" label="Projects" />
    <Tab value="settings" label="Settings" />
  </TabList>
</template>
