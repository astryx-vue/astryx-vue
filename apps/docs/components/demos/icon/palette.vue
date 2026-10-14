<script setup lang="ts">
import type { IconColor } from '@astryx-vue/core/Icon'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const colors = [
  'blue',
  'red',
  'green',
  'gray',
  'cyan',
  'teal',
  'yellow',
  'orange',
  'pink',
  'purple',
] as const satisfies readonly IconColor[]
</script>

<template>
  <HStack :gap="4" wrap="wrap">
    <VStack v-for="color in colors" :key="color" :gap="1" h-align="center">
      <Icon name="carbon:search" :color="color" />
      <Text type="supporting">
        {{ color }}
      </Text>
    </VStack>
  </HStack>
</template>
