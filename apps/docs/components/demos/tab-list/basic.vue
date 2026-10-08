<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('overview')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="overview">
      总览
    </Tab>
    <Tab value="props">
      属性
    </Tab>
    <Tab value="examples">
      示例
    </Tab>
  </TabList>
</template>
