<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Center } from '@astryx-vue/core/Center'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack } from '@astryx-vue/core/Stack'

const tools = [
  { label: 'Bold', icon: 'i-carbon-text-bold' },
  { label: 'Italic', icon: 'i-carbon-text-italic' },
  { label: 'Underline', icon: 'i-carbon-text-underline' },
  { label: 'List', icon: 'i-carbon-list' },
  { label: 'Link', icon: 'i-carbon-link' },
  { label: 'Image', icon: 'i-carbon-image' },
]
</script>

<template>
  <Card :padding="2" :width="520">
    <Center axis="horizontal" width="100%">
      <HStack align="center" :gap="0">
        <IconButton
          v-for="tool in tools"
          :key="tool.label"
          :label="tool.label"
          size="sm"
          variant="ghost"
        >
          <span class="css-icon css-icon--sm" :class="tool.icon" />
        </IconButton>
      </HStack>
    </Center>
  </Card>
</template>
