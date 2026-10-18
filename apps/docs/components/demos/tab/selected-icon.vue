<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('favorites')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="favorites">
      <template #icon>
        <span class="css-icon css-icon--sm i-carbon-star" />
      </template>
      <template #selectedIcon>
        <span class="css-icon css-icon--sm i-carbon-star-filled" />
      </template>
      Favorites
    </Tab>
    <Tab value="recent">
      Recent
    </Tab>
  </TabList>
</template>
