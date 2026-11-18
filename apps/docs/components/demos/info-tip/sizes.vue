<script setup lang="ts">
import { InfoTip } from '@astryx-vue/core/InfoTip'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="input-preview-grid">
    <HStack :gap="4" align="center">
      <HStack v-for="size in (['xsm', 'sm', 'md', 'lg'] as const)" :key="size" :gap="1" align="center">
        <Text type="label">
          {{ size }}
        </Text>
        <InfoTip :size="size" :label="`About ${size}`" content="Editors can change this field; viewers cannot." />
      </HStack>
    </HStack>
  </div>
</template>
