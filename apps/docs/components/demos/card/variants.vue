<script setup lang="ts">
import type { CardVariant } from '@astryx-vue/core/Card'
import { Card } from '@astryx-vue/core/Card'
import { Text } from '@astryx-vue/core/Text'

const variants: CardVariant[] = ['default', 'transparent', 'muted', 'blue', 'cyan', 'gray', 'green', 'orange', 'pink', 'purple', 'red', 'teal', 'yellow']
</script>

<template>
  <div class="card-preview__grid">
    <Card
      v-for="variant in variants"
      :key="variant"
      :min-height="80"
      :variant="variant"
    >
      <Text type="label">
        {{ variant }}
      </Text>
    </Card>
  </div>
</template>
