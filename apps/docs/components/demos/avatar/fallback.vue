<script setup lang="ts">
import { Avatar } from '@astryx-vue/core/Avatar'
</script>

<template>
  <div class="avatar-preview__row">
    <Avatar src="https://example.com/missing.png" name="Ana Thomas" />
    <Avatar name="Ana Thomas" />
    <Avatar />
  </div>
</template>
