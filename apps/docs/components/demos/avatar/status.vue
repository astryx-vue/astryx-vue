<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack align="center" direction="horizontal" :gap="4">
    <Avatar src="/template-assets/DATA-Itai-Jordaan.png" name="Itai Jordaan" size="xl">
      <template #status>
        <AvatarStatusDot variant="success" label="Online" />
      </template>
    </Avatar>
    <Avatar src="/template-assets/DATA-Margot-Schroder.png" name="Margot Schroder" size="xl">
      <template #status>
        <AvatarStatusDot variant="neutral" label="Offline" />
      </template>
    </Avatar>
    <Avatar src="/template-assets/DATA-Pablo-Morales.png" name="Pablo Morales" size="xl">
      <template #status>
        <AvatarStatusDot variant="error" label="Busy" />
      </template>
    </Avatar>
  </Stack>
</template>
