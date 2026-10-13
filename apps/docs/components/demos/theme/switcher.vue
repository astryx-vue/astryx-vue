<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { Selector } from '@astryx-vue/core/Selector'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'
import { computed, ref } from 'vue'

const warmTheme = defineTheme({
  name: 'warm-docs',
  tokens: {
    '--color-accent': ['#D97706', '#FBBF24'],
    '--color-background-surface': ['#FFF7ED', '#1F1300'],
    '--color-background-card': ['#FFFBEB', '#2A1A05'],
    '--color-text-primary': ['#3B2F15', '#FEF3C7'],
    '--color-text-secondary': ['#92400E', '#FCD34D'],
    '--color-border': ['#FED7AA', '#92400E66'],
    '--radius-container': '20px',
  },
})

const forestTheme = defineTheme({
  name: 'forest-docs',
  tokens: {
    '--color-accent': ['#15803D', '#86EFAC'],
    '--color-background-surface': ['#F0FDF4', '#052E16'],
    '--color-background-card': ['#FFFFFF', '#0F3D24'],
    '--color-text-primary': ['#052E16', '#DCFCE7'],
    '--color-text-secondary': ['#166534', '#BBF7D0'],
    '--color-border': ['#BBF7D0', '#15803D66'],
    '--radius-container': '8px',
  },
})

const themes = {
  Warm: warmTheme,
  Forest: forestTheme,
}

const themeName = ref<'Warm' | 'Forest'>('Warm')
const theme = computed(() => themes[themeName.value])
const options = [
  { value: 'Warm', label: 'Warm' },
  { value: 'Forest', label: 'Forest' },
]
</script>

<template>
  <Section variant="muted" :padding="4" :max-width="420">
    <Stack direction="vertical" :gap="3">
      <Selector v-model="themeName" label="Theme" :options="options" />
      <Theme :theme="theme">
        <Card :padding="4" width="100%">
          <Stack direction="vertical" :gap="3">
            <Heading :level="4">
              {{ themeName }} preview
            </Heading>
            <Text type="body" color="secondary">
              Switching the theme object updates all tokens and component styles below the provider.
            </Text>
            <Button label="Save changes" variant="primary" />
          </Stack>
        </Card>
      </Theme>
    </Stack>
  </Section>
</template>
