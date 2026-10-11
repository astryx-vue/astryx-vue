<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { Toolbar } from '@astryx-vue/core/Toolbar'
import { ref } from 'vue'

const tab = ref('overview')
</script>

<template>
  <Card width="min(100%, 32rem)">
    <Toolbar :dividers="['bottom']" label="Section navigation">
      <template #start>
        <TabList v-model:value="tab">
          <Tab value="overview">
            Overview
          </Tab>
          <Tab value="analytics">
            Analytics
          </Tab>
          <Tab value="settings">
            Settings
          </Tab>
        </TabList>
      </template>
      <template #end>
        <Button is-icon-only label="New item">
          <template #icon>
            <span class="i-carbon-add" />
          </template>
        </Button>
      </template>
    </Toolbar>
  </Card>
</template>
