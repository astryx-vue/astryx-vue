<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
import { useDemoText } from '../../demo-infra/useDemoText'

const DATE = '2026-02-19T17:00:00Z'
const { pick } = useDemoText()
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('面向读者，并带上时区', 'User-facing with timezone') }}
      </Text>
      <Stack v-align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="DATE" format="date_time" is-timezone-shown color="primary" />
        <Timestamp :value="DATE" format="time" is-timezone-shown color="primary" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('系统格式保持机器可读，不会追加时区', 'System formats stay machine-readable — never suffixed with a zone') }}
      </Text>
      <Stack v-align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="DATE" format="system_date_time" type="code" color="primary" />
        <Timestamp :value="DATE" format="system_time" type="code" color="primary" />
      </Stack>
    </Stack>
  </Stack>
</template>
