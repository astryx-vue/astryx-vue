<script setup lang="ts">
import { useImageMode } from '@astryx-vue/core'
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { VStack } from '@astryx-vue/core/Stack'
import { Switch } from '@astryx-vue/core/Switch'
import { Text } from '@astryx-vue/core/Text'
import { MediaTheme } from '@astryx-vue/core/Theme'
import { computed, ref } from 'vue'

const NIGHT_PHOTO = '/template-assets/moody-scene-horizontal-1.png'
const BEACH_PHOTO = '/template-assets/light-scene-horizontal-1.png'
const CAPTION_REGION = { x: 0, y: 0, width: 1, height: 0.3 }

const isBeach = ref(false)
const src = computed(() => isBeach.value ? BEACH_PHOTO : NIGHT_PHOTO)
const mode = useImageMode(src, { region: CAPTION_REGION, threshold: 0.4, fallback: 'dark' })
</script>

<template>
  <VStack :gap="3">
    <AspectRatio :ratio="3 / 2" class="photo-caption">
      <img
        class="photo-caption__image"
        :src="src"
        :alt="isBeach ? 'A beach under a pale sky' : 'Snowy peaks at night'"
      >
      <div class="photo-caption__overlay">
        <MediaTheme :mode="mode ?? 'off'">
          <VStack :gap="1">
            <Text type="body" weight="bold">
              {{ isBeach ? 'Afternoon at the beach' : 'Night in the mountains' }}
            </Text>
            <Text type="supporting">
              Sky behind the caption: {{ mode }}
            </Text>
          </VStack>
        </MediaTheme>
      </div>
    </AspectRatio>
    <Switch v-model="isBeach" label="Beach photo" />
  </VStack>
</template>

<style scoped>
.photo-caption {
  width: 360px;
  max-width: 100%;
  overflow: hidden;
  border-radius: var(--astryx-radius-container, 0.75rem);
}

.photo-caption__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-caption__overlay {
  position: absolute;
  inset: 0 0 auto;
  padding: 16px;
}
</style>
