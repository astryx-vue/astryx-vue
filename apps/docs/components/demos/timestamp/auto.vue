<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { Timestamp } from '@astryx-vue/core/Timestamp'
import { onMounted, ref } from 'vue'

// 相对时间以读者打开页面的时刻为准。服务端渲染没有这个时刻，挂载后再取，
// 否则构建时写进 HTML 的时间和浏览器算出来的对不上。
const now = ref<number>()
onMounted(() => {
  now.value = Date.now() / 1000
})
</script>

<template>
  <Stack direction="vertical" :gap="4">
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ 'Recent — renders as relative' }}
      </Text>
      <Stack v-if="now !== undefined" align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp :value="now - 300" format="auto" color="primary" />
        <Timestamp :value="now - 7200" format="auto" color="primary" />
        <Timestamp :value="now - 86400" format="auto" color="primary" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="1">
      <Text type="supporting" color="secondary">
        {{ 'Older than 7 days — renders as date_time' }}
      </Text>
      <Stack align="center" direction="horizontal" :gap="4" wrap="wrap">
        <Timestamp value="2025-01-15T09:30:00Z" format="auto" color="primary" />
        <Timestamp value="2024-06-01T14:00:00Z" format="auto" color="primary" />
      </Stack>
    </Stack>
  </Stack>
</template>
