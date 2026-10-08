<script setup lang="ts">
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('account')
</script>

<template>
  <TabList v-model:value="value" has-divider>
    <Tab value="account">
      Account
    </Tab>
    <Tab value="security">
      Security
    </Tab>
    <Tab value="notifications">
      Notifications
    </Tab>
  </TabList>
</template>
