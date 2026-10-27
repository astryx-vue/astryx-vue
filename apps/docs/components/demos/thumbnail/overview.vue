<script setup lang="ts">
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { SNOWY_PEAKS } from './images'
</script>

<template>
  <Thumbnail
    :src="SNOWY_PEAKS"
    alt="Snowy mountain peaks"
    label="snowy-peaks.jpg"
  />
</template>
