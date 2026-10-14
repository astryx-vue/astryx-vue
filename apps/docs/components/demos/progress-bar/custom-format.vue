<script setup lang="ts">
import { ProgressBar } from '@astryx-vue/core/ProgressBar'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div style="width: 300px">
    <VStack :gap="1">
      <ProgressBar
        :value="3.2"
        :max="5"
        label="Disk usage"
        has-value-label
        :format-value-label="(value, max) => `${value} GB / ${max} GB`"
      />
      <Text type="supporting" color="secondary">
        1.8 GB remaining
      </Text>
    </VStack>
  </div>
</template>
