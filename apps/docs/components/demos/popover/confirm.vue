<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Popover } from '@astryx-vue/core/Popover'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Popover
    :is-open="isOpen"
    placement="below"
    label="Confirm deletion"
    :width="300"
    @open-change="isOpen = $event"
  >
    <Button label="Delete project" variant="destructive" />
    <template #content>
      <VStack :gap="3">
        <Heading :level="4">
          Delete project?
        </Heading>
        <Text type="body">
          This will permanently delete the project and all its data. This action cannot be undone.
        </Text>
        <HStack h-align="end" :gap="2">
          <Button label="Delete" variant="destructive" @click="isOpen = false" />
          <Button label="Cancel" variant="ghost" @click="isOpen = false" />
        </HStack>
      </VStack>
    </template>
  </Popover>
</template>
