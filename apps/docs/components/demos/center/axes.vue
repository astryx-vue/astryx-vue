<script setup lang="ts">
import type { CenterAxis } from '@astryx-vue/core/Center'
import { Center } from '@astryx-vue/core/Center'
import { HStack } from '@astryx-vue/core/Stack'

const axes: { axis: CenterAxis, caption: string }[] = [
  { axis: 'both', caption: 'axis="both"' },
  { axis: 'horizontal', caption: 'axis="horizontal"' },
  { axis: 'vertical', caption: 'axis="vertical"' },
]
</script>

<template>
  <HStack class="center-preview__examples" :gap="4" wrap="wrap">
    <div v-for="item in axes" :key="item.axis" class="center-preview__example">
      <Center class="center-preview__stage" :axis="item.axis" :height="120" :padding="2">
        <span class="center-preview__chip">Content</span>
      </Center>
      <span class="center-preview__caption">{{ item.caption }}</span>
    </div>
  </HStack>
</template>
