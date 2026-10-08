<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Link } from '@astryx-vue/core/Link'
import { Overlay } from '@astryx-vue/core/Overlay'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack class="overlay-preview__stack" :gap="3">
    <Overlay class="overlay-preview__frame" show-on="hover">
      <div class="overlay-preview__media">
        <Link
          class="overlay-preview__media-label"
          color="inherit"
          has-underline
          href="#season-highlights"
        >
          Season highlights
        </Link>
      </div>
      <template #content>
        <Button label="Watch reel" size="sm" variant="secondary" />
      </template>
    </Overlay>
    <p class="overlay-preview__hint">
      Hover the tile, or focus the link inside it, to reveal the overlay.
    </p>
  </VStack>
</template>
