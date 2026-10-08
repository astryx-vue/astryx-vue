<script setup lang="ts">
import type { CardElevation } from '@astryx-vue/core/Card'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const elevations: CardElevation[] = ['none', 'low', 'med', 'high']
</script>

<template>
  <div class="card-preview__grid card-preview__grid--elevation">
    <Card
      v-for="elevation in elevations"
      :key="elevation"
      :elevation="elevation"
    >
      <VStack :gap="1">
        <Heading :level="4">
          {{ elevation }}
        </Heading>
        <Text type="supporting">
          Resting shadow
        </Text>
      </VStack>
    </Card>
  </div>
</template>
