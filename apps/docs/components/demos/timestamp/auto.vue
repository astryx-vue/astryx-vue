<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
import { useDemoText } from '../../demo-infra/useDemoText'

const now = Date.now() / 1000
const { pick } = useDemoText()
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('较近的时间显示成相对时间', 'Recent — renders as relative') }}
      </Text>
      <Stack v-align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="now - 300" format="auto" color="primary" />
        <Timestamp :value="now - 7200" format="auto" color="primary" />
        <Timestamp :value="now - 86400" format="auto" color="primary" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('超过 7 天显示成日期和时间', 'Older than 7 days — renders as date_time') }}
      </Text>
      <Stack v-align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp value="2025-01-15T09:30:00Z" format="auto" color="primary" />
        <Timestamp value="2024-06-01T14:00:00Z" format="auto" color="primary" />
      </Stack>
    </Stack>
  </Stack>
</template>
