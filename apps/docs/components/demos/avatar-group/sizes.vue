<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <div class="avatar-group-preview__stack">
    <AvatarGroup size="sm">
      <Avatar name="Ana Thomas" />
      <Avatar name="Ben Lee" />
      <Avatar name="Carol Davis" />
      <AvatarGroupOverflow :count="2" />
    </AvatarGroup>
    <AvatarGroup size="md">
      <Avatar name="Ana Thomas" />
      <Avatar name="Ben Lee" />
      <Avatar name="Carol Davis" />
      <AvatarGroupOverflow :count="2" />
    </AvatarGroup>
    <AvatarGroup size="lg">
      <Avatar name="Ana Thomas" />
      <Avatar name="Ben Lee" />
      <Avatar name="Carol Davis" />
      <AvatarGroupOverflow :count="2" />
    </AvatarGroup>
  </div>
</template>
