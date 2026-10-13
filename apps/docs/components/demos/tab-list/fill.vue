<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('home')
</script>

<template>
  <div class="tab-list-preview__width">
    <TabList v-model:value="value" has-divider layout="fill">
      <Tab value="home">
        Home
      </Tab>
      <Tab value="projects">
        Projects
      </Tab>
      <Tab value="settings">
        Settings
      </Tab>
    </TabList>
  </div>
</template>
