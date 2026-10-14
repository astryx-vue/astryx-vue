<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'

const DATE = '2026-02-19T17:00:00Z'
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ 'User-facing formats' }}
      </Text>
      <Stack align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="DATE" format="date" color="primary" />
        <Timestamp :value="DATE" format="date_long" color="primary" />
        <Timestamp :value="DATE" format="date_weekday" color="primary" />
        <Timestamp :value="DATE" format="date_time" color="primary" />
        <Timestamp :value="DATE" format="time" color="primary" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ 'System formats (logs and dev tools)' }}
      </Text>
      <Stack align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="DATE" format="system_date" type="code" color="primary" />
        <Timestamp :value="DATE" format="system_date_time" type="code" color="primary" />
        <Timestamp :value="DATE" format="system_time" type="code" color="primary" />
      </Stack>
    </Stack>
  </Stack>
</template>
