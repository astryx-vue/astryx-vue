<script setup lang="ts">
import type { BottomSheetHeight } from '@astryx-vue/core/BottomSheet'
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const descriptions: Record<BottomSheetHeight, string> = {
  hug: 'Hug fits short, bounded content.',
  capped: 'Capped starts at a comfortable mid-height for lists and filters.',
  tall: 'Tall reserves most of the viewport for long or changing content.',
}

const height = ref<BottomSheetHeight | null>(null)
</script>

<template>
  <HStack :gap="2" wrap="wrap">
    <Button label="Open hug" @click="height = 'hug'" />
    <Button label="Open capped" @click="height = 'capped'" />
    <Button label="Open tall" @click="height = 'tall'" />
  </HStack>
  <BottomSheet
    :height="height ?? 'hug'"
    :is-open="height != null"
    :label="`${height ?? 'Hug'} height`"
    @update:is-open="open => { if (!open) height = null }"
  >
    <VStack :gap="4">
      <Heading :level="3">
        {{ height ?? 'Hug' }} height
      </Heading>
      <Divider />
      <Text type="body">
        {{ descriptions[height ?? 'hug'] }}
      </Text>
      <Button label="Close" @click="height = null" />
    </VStack>
  </BottomSheet>
</template>
