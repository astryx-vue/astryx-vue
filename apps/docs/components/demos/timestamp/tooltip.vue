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
        {{ pick('本地时间和 UTC，悬停对比', 'Local + UTC — hover to compare') }}
      </Text>
      <Timestamp
        :value="DATE"
        format="relative"
        color="primary"
        :tooltip-entries="[
          { format: 'date_time', label: 'Local' },
          { timezoneID: 'UTC', format: 'date_time', label: 'UTC' },
        ]"
      />
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('事件发生时区和读者所在时区并排', 'Incident origin zone alongside the reader’s') }}
      </Text>
      <Timestamp
        :value="DATE"
        format="date_time"
        color="primary"
        :tooltip-entries="[
          { format: 'date_time', label: 'Local' },
          { timezoneID: 'America/Los_Angeles', format: 'date_time', label: 'Origin' },
        ]"
      />
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ pick('一行给人读，一行给机器读', 'Friendly line plus a machine-precise line') }}
      </Text>
      <Timestamp
        :value="DATE"
        format="date_time"
        color="primary"
        :tooltip-entries="[
          { format: 'full' },
          { format: 'system_date_time', label: 'ISO' },
        ]"
      />
    </Stack>
  </Stack>
</template>
