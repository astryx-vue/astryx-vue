<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'

const showToast = useToast()

// 演示：换成真正打开资料页的调用。用 toast 而不是 alert，被屏蔽对话框的框架里点击也有回应。
function openProfile() {
  showToast({ body: 'Demo: Margot Schroder’s profile would open here' })
}
</script>

<template>
  <Stack align="start" direction="horizontal" :gap="6">
    <Stack direction="vertical" :gap="2" h-align="center">
      <Avatar
        src="/template-assets/DATA-Itai-Jordaan.png"
        name="Itai Jordaan"
        size="xl"
        href="https://example.com/people/itai-jordaan"
      />
      <Text type="supporting" color="secondary">
        Link (href)
      </Text>
    </Stack>
    <Stack direction="vertical" :gap="2" h-align="center">
      <Avatar
        src="/template-assets/DATA-Margot-Schroder.png"
        name="Margot Schroder"
        size="xl"
        @click="openProfile"
      />
      <Text type="supporting" color="secondary">
        Button (onClick)
      </Text>
    </Stack>
  </Stack>
</template>
