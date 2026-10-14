<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Popover } from '@astryx-vue/core/Popover'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { reactive, ref } from 'vue'

const isOpen = ref(false)
const filters = reactive({
  active: true,
  archived: false,
  drafts: true,
  shared: false,
})

function reset() {
  filters.active = true
  filters.archived = false
  filters.drafts = true
  filters.shared = false
}
</script>

<template>
  <Popover
    :is-open="isOpen"
    placement="below"
    label="Filter"
    :width="240"
    @open-change="isOpen = $event"
  >
    <Button label="Filter" />
    <template #content>
      <VStack :gap="3">
        <Heading :level="4">
          Filter by status
        </Heading>
        <Divider />
        <CheckboxInput v-model="filters.active" label="Active" />
        <CheckboxInput v-model="filters.archived" label="Archived" />
        <CheckboxInput v-model="filters.drafts" label="Drafts" />
        <CheckboxInput v-model="filters.shared" label="Shared with me" />
        <Divider />
        <HStack h-align="end" :gap="2">
          <Button label="Apply" variant="primary" @click="isOpen = false" />
          <Button label="Reset" variant="ghost" @click="reset" />
        </HStack>
      </VStack>
    </template>
  </Popover>
</template>
