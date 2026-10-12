<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
import { useDemoText } from '../../demo-infra/useDemoText'

const now = Date.now() / 1000
const { pick } = useDemoText()
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Text type="supporting" color="secondary">
      {{ pick('相对时间，悬停可以看完整日期', 'Relative timestamps (hover for full date)') }}
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
