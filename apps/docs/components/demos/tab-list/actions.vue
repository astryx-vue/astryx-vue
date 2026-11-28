<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { useToast } from '@astryx-vue/core/Toast'
import { ref } from 'vue'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const value = ref('all')
</script>

<template>
  <TabList v-model:value="value" class="tab-list-preview__actions" has-divider size="lg">
    <Tab value="all">
      All items
    </Tab>
    <Tab value="active">
      Active
    </Tab>
    <Tab value="archived">
      Archived
    </Tab>
    <div class="tab-list-preview__end">
      <Button label="Filter" variant="ghost" size="lg" is-icon-only @click="demo('Filter')">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-filter" />
        </template>
      </Button>
      <Button label="New item" variant="primary" size="lg" @click="demo('New item')">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-add" />
        </template>
      </Button>
    </div>
  </TabList>
</template>
