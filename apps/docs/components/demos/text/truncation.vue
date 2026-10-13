<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'

const longText = 'The design system provides a consistent set of typography tokens, spacing scales, and color palettes that ensure every surface in the product feels cohesive regardless of which team built it.'
const lines = [
  { maxLines: 1, label: '1 line' },
  { maxLines: 2, label: '2 lines' },
  { maxLines: 3, label: '3 lines' },
]
</script>

<template>
  <div class="text-preview__clamp">
    <div v-for="item in lines" :key="item.maxLines">
      <Text type="supporting" color="secondary" display="block">
        {{ item.label }}
      </Text>
      <div class="text-preview__box">
        <Text type="body" :max-lines="item.maxLines">
          {{ longText }}
        </Text>
      </div>
    </div>
  </div>
</template>
