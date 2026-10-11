<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
import { AvatarGroup, AvatarGroupOverflow } from '@astryx-vue/core/AvatarGroup'
</script>

<template>
  <AvatarGroup size="md">
    <Avatar name="Ana Thomas" />
    <Avatar name="Ben Lee" />
    <Avatar name="Carol Davis" />
    <Avatar name="Nam Tran" />
    <AvatarGroupOverflow :count="5" />
  </AvatarGroup>
</template>
