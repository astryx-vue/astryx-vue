<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
import { Stack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Stack direction="horizontal" :gap="4" align="center">
    <Avatar src="/template-assets/DATA-Ana-Thomas.png" name="Ana Thomas" size="xl">
      <template #status>
        <AvatarStatusDot variant="success" label="Online" />
      </template>
    </Avatar>
    <Avatar src="/template-assets/DATA-Drew-Young.png" name="Drew Young" size="xl" />
    <Avatar src="/template-assets/DATA-Jihoo-Song.png" name="Jihoo Song" size="xl" />
    <Avatar src="/template-assets/DATA-Nam-Tran.png" name="Nam Tran" size="xl">
      <template #status>
        <AvatarStatusDot variant="error" label="Busy" />
      </template>
    </Avatar>
  </Stack>
</template>
