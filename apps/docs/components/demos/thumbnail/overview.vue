<script setup lang="ts">
import { provideAstryxLocale } from '@astryx-vue/core/locale'
import { Thumbnail } from '@astryx-vue/core/Thumbnail'
import { SNOWY_PEAKS } from './images'

provideAstryxLocale('en')
</script>

<template>
  <Thumbnail
    :src="SNOWY_PEAKS"
    alt="Snowy mountain peaks"
    label="snowy-peaks.jpg"
  />
</template>
