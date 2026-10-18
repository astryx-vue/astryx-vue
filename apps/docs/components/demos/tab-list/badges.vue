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
        <Badge variant="error">
          5
        </Badge>
      </template>
      Inbox
    </Tab>
    <Tab value="sent">
      Sent
    </Tab>
    <Tab value="drafts">
      <template #endContent>
        <Badge variant="neutral">
          2
        </Badge>
      </template>
      Drafts
    </Tab>
  </TabList>
</template>
