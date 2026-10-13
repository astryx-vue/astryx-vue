<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

const value = ref('inbox')
</script>

<template>
  <TabList v-model:value="value">
    <Tab value="inbox">
      Inbox
      <Badge variant="error">
        5
      </Badge>
    </Tab>
    <Tab value="sent">
      Sent
    </Tab>
    <Tab value="drafts">
      Drafts
      <Badge variant="neutral">
        2
      </Badge>
    </Tab>
  </TabList>
</template>
