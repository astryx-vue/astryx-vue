<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

function openProfile() {
  // The upstream example uses a browser alert so the click is visible.
  // eslint-disable-next-line no-alert
  window.alert('Opening Margot Schroder’s profile')
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
