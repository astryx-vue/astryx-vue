<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <Avatar name="Online User" :size="128">
      <template #status>
        <AvatarStatusDot variant="success" label="Online" />
      </template>
    </Avatar>
    <Avatar name="Away User" :size="128">
      <template #status>
        <AvatarStatusDot variant="neutral" label="Away" />
      </template>
    </Avatar>
    <Avatar name="Busy User" :size="128">
      <template #status>
        <AvatarStatusDot variant="error" label="Busy" />
      </template>
    </Avatar>
  </HStack>
</template>
