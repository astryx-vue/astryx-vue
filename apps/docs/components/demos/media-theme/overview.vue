<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { MediaTheme } from '@astryx-vue/core/Theme'

const stage: CSSProperties = {
  width: '360px',
  maxWidth: '100%',
  minHeight: '230px',
  display: 'flex',
  alignItems: 'flex-end',
  padding: '16px',
  backgroundImage: 'linear-gradient(180deg, rgba(10,19,23,0.05) 0%, rgba(10,19,23,0.82) 100%), url(/template-assets/light-scene-horizontal-1.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: 'var(--astryx-radius-container, 0.75rem)',
  boxShadow: 'var(--astryx-shadow-med, 0 8px 24px rgb(0 0 0 / 18%))',
}
</script>

<template>
  <div :style="stage">
    <MediaTheme mode="dark">
      <Stack direction="vertical" :gap="3">
        <Stack direction="horizontal" :gap="2" align="center">
          <span aria-hidden="true" class="i-carbon-information" style="width: 1.25rem; height: 1.25rem" />
          <Text type="body" weight="bold">
            Media overlay
          </Text>
          <Badge>Live</Badge>
        </Stack>
        <Text type="supporting" color="secondary">
          Text, icons, badges, and button variants inherit legible colors on top of the dark image treatment.
        </Text>
        <Stack direction="horizontal" :gap="2" wrap="wrap">
          <Button label="Primary" variant="primary" size="sm" />
          <Button label="Secondary" variant="secondary" size="sm" />
          <Button label="Ghost" variant="ghost" size="sm" />
        </Stack>
      </Stack>
    </MediaTheme>
  </div>
</template>
