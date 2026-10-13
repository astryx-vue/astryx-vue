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
  insetBlockStart: '16px',
  insetInlineStart: '16px',
  maxWidth: '250px',
  padding: '16px',
  background: 'rgba(255,255,255,0.82)',
  borderRadius: 'var(--astryx-radius-container, 0.75rem)',
  boxShadow: 'var(--astryx-shadow-med, 0 8px 24px rgb(0 0 0 / 12%))',
}
</script>

<template>
  <AspectRatio :ratio="16 / 9" :style="frame">
    <img
      alt="Bright room"
      src="/template-assets/light-home-square-1.png"
      style="width: 100%; height: 100%; object-fit: cover"
    >
    <div :style="scrim">
      <MediaTheme mode="light">
        <Stack direction="vertical" :gap="2">
          <Text type="body" weight="bold">
            Bright media surface
          </Text>
          <Text type="supporting" color="secondary">
            Use mode="light" when content sits on a light card or scrim.
          </Text>
          <Button label="Open" variant="ghost" size="sm" />
        </Stack>
      </MediaTheme>
    </div>
  </AspectRatio>
</template>
