<script setup lang="ts">
import { Avatar, AvatarStatusDot } from '@astryx-vue/core/Avatar'
</script>

<template>
  <div class="avatar-preview__row">
    <Avatar name="Ana Thomas">
      <template #status>
        <AvatarStatusDot variant="success" />
      </template>
    </Avatar>
    <Avatar name="Ben Lee">
      <template #status>
        <AvatarStatusDot variant="warning" />
      </template>
    </Avatar>
    <Avatar name="Carol Davis">
      <template #status>
        <AvatarStatusDot variant="error" />
      </template>
    </Avatar>
    <Avatar name="Nam Tran">
      <template #status>
        <AvatarStatusDot variant="neutral" />
      </template>
    </Avatar>
  </div>
</template>
