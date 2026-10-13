<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { AspectRatio } from '@astryx-vue/core/AspectRatio'
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { MediaTheme } from '@astryx-vue/core/Theme'

const frame: CSSProperties = {
  width: '360px',
  maxWidth: '100%',
  borderRadius: 'var(--astryx-radius-container, 0.75rem)',
}

const scrim: CSSProperties = {
  position: 'absolute',
  insetInline: 0,
  insetBlockEnd: 0,
  padding: '16px',
  background: 'linear-gradient(180deg, transparent, rgba(10,19,23,0.78))',
}
</script>

<template>
  <AspectRatio :ratio="16 / 9" :style="frame">
    <img
      alt="Landscape"
      src="/template-assets/light-scene-horizontal-1.png"
      style="width: 100%; height: 100%; object-fit: cover"
    >
    <div :style="scrim">
      <MediaTheme mode="dark">
        <Stack direction="vertical" :gap="2">
          <Text type="body" weight="bold">
            Product launch livestream
          </Text>
          <Text type="supporting" color="secondary">
            MediaTheme keeps overlay text and controls readable without hard-coded color overrides.
          </Text>
          <Stack direction="horizontal" :gap="2" wrap="wrap">
            <Button label="Watch" variant="primary" size="sm" />
            <Button label="Details" variant="secondary" size="sm" />
          </Stack>
        </Stack>
      </MediaTheme>
    </div>
  </AspectRatio>
</template>
