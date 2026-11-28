<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { useToast } from '@astryx-vue/core/Toast'
import { Toolbar } from '@astryx-vue/core/Toolbar'
import { ref } from 'vue'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const tab = ref('overview')
</script>

<template>
  <Card width="min(100%, 32rem)">
    <Toolbar :dividers="['bottom']" label="Section navigation">
      <template #start>
        <TabList v-model:value="tab" role="tablist">
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
        <Button is-icon-only label="New item" @click="demo('New item')">
          <template #icon>
            <span class="i-carbon-add" />
          </template>
        </Button>
      </template>
    </Toolbar>
  </Card>
</template>
