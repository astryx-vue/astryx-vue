<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('md')
</script>

<template>
  <div class="tab-list-preview__stack">
    <TabList v-model:value="value" size="sm">
      <Tab value="sm">
        Small
      </Tab>
      <Tab value="md">
        Medium
      </Tab>
      <Tab value="lg">
        Large
      </Tab>
    </TabList>
  </div>
</template>
