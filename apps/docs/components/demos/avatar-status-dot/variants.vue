<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack align="center" :gap="4">
    <Avatar name="Ana Silva" size="xl">
      <template #status>
        <AvatarStatusDot variant="success" label="Online" />
      </template>
    </Avatar>
    <Avatar name="Ben Okafor" size="xl">
      <template #status>
        <AvatarStatusDot variant="neutral" label="Away" />
      </template>
    </Avatar>
    <Avatar name="Cleo Marsh" size="xl">
      <template #status>
        <AvatarStatusDot variant="error" label="Do not disturb" />
      </template>
    </Avatar>
  </HStack>
</template>
