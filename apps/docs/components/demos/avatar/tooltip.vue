<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="5">
    <Stack direction="vertical" :gap="2">
      <Text type="supporting" color="secondary">
        Hover or focus to reveal each name
      </Text>
      <Stack align="center" direction="horizontal" :gap="4">
        <Avatar src="/template-assets/DATA-Ana-Thomas.png" name="Ana Thomas" size="xl" />
        <Avatar src="/template-assets/DATA-Drew-Young.png" name="Drew Young" size="xl" />
        <Avatar src="/template-assets/DATA-Jihoo-Song.png" name="Jihoo Song" size="xl" />
      </Stack>
    </Stack>
    <Stack direction="vertical" :gap="2">
      <Text type="supporting" color="secondary">
        Custom tooltip text
      </Text>
      <Avatar
        src="/template-assets/DATA-Itai-Jordaan.png"
        name="Itai Jordaan"
        size="xl"
        tooltip="Itai Jordaan · Engineering Lead"
      />
    </Stack>
  </Stack>
</template>
