<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { Badge } from '@astryx-vue/core/Badge'
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { MediaTheme } from '@astryx-vue/core/Theme'
import { useToast } from '@astryx-vue/core/Toast'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

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
          <Icon icon="info" size="md" />
          <Text type="body" weight="bold">
            Media overlay
          </Text>
          <Badge label="Live" />
        </Stack>
        <Text type="supporting" color="secondary">
          Text, icons, badges, and button variants inherit legible colors on top of the dark image treatment.
        </Text>
        <Stack direction="horizontal" :gap="2" wrap="wrap">
          <Button label="Primary" variant="primary" size="sm" @click="demo('Primary')" />
          <Button label="Secondary" variant="secondary" size="sm" @click="demo('Secondary')" />
          <Button label="Ghost" variant="ghost" size="sm" @click="demo('Ghost')" />
        </Stack>
      </Stack>
    </MediaTheme>
  </div>
</template>
