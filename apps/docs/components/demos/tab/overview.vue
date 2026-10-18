<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      <template #endContent>
        <Badge variant="info">
          3
        </Badge>
      </template>
      Inbox
    </Tab>
  </TabList>
</template>
