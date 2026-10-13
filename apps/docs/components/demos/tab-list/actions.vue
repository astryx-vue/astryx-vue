<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tab, TabList } from '@astryx-vue/core/TabList'
import { ref } from 'vue'

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
      <Button label="Filter" variant="ghost" size="lg" is-icon-only>
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-filter" />
        </template>
      </Button>
      <Button label="New item" variant="primary" size="lg">
        <template #icon>
          <span class="css-icon css-icon--sm i-carbon-add" />
        </template>
      </Button>
    </div>
  </TabList>
</template>
