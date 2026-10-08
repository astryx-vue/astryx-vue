<script setup lang="ts">
import type { SpacingStep } from '@astryx-vue/core/Stack'
import { Card } from '@astryx-vue/core/Card'
import { Text } from '@astryx-vue/core/Text'

const steps: SpacingStep[] = [2, 4, 6, 8]
</script>

<template>
  <div class="card-preview__grid card-preview__grid--padding">
    <Card
      v-for="step in steps"
      :key="step"
      :padding="step"
    >
      <div class="card-preview__fill">
        <Text type="supporting">
          padding={{ step }}
        </Text>
      </div>
    </Card>
  </div>
</template>
