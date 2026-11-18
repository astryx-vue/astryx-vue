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
  <Stack direction="vertical" :gap="3">
    <Text type="supporting" color="secondary">
      {{ 'Relative timestamps (hover for full date)' }}
    </Text>
    <Stack v-if="now !== undefined" direction="vertical" :gap="2">
      <Timestamp :value="now - 5" format="relative" color="primary" />
      <Timestamp :value="now - 120" format="relative" color="primary" />
      <Timestamp :value="now - 3600" format="relative" color="primary" />
      <Timestamp :value="now - 86400" format="relative" color="primary" />
      <Timestamp :value="now - 259200" format="relative" color="primary" />
      <Timestamp :value="now - 90 * 86400" format="relative" color="primary" />
    </Stack>
  </Stack>
</template>
