<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'

const now = Date.now() / 1000
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Text type="supporting" color="secondary">
      {{ 'Relative timestamps (hover for full date)' }}
    </Text>
    <Stack direction="vertical" :gap="2">
      <Timestamp :value="now - 5" format="relative" color="primary" />
      <Timestamp :value="now - 120" format="relative" color="primary" />
      <Timestamp :value="now - 3600" format="relative" color="primary" />
      <Timestamp :value="now - 86400" format="relative" color="primary" />
      <Timestamp :value="now - 259200" format="relative" color="primary" />
      <Timestamp :value="now - 90 * 86400" format="relative" color="primary" />
    </Stack>
  </Stack>
</template>
