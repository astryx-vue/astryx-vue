<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <Avatar name="Ana Silva" size="xl">
      <template #status>
        <AvatarStatusDot label="Approved">
          <template #icon>
            <Icon icon="i-carbon-checkmark-filled" />
          </template>
        </AvatarStatusDot>
      </template>
    </Avatar>
    <Avatar name="Ben Okafor" size="xl">
      <template #status>
        <AvatarStatusDot variant="neutral" label="Paused">
          <template #icon>
            <Icon icon="i-carbon-pause-filled" />
          </template>
        </AvatarStatusDot>
      </template>
    </Avatar>
    <Avatar name="Cleo Marsh" size="xl">
      <template #status>
        <AvatarStatusDot variant="error" label="Blocked">
          <template #icon>
            <Icon icon="i-carbon-close-filled" />
          </template>
        </AvatarStatusDot>
      </template>
    </Avatar>
  </HStack>
</template>
