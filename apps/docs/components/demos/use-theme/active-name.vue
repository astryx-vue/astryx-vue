<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Text } from '@astryx-vue/core/Text'
import { defineTheme, Theme, useTheme } from '@astryx-vue/core/Theme'
import { defineComponent, h } from 'vue'

const harborTheme = defineTheme({
  name: 'harbor',
  tokens: {
    '--color-accent': ['#1D4ED8', '#93C5FD'],
    '--color-background-card': ['#FFFFFF', '#0F172A'],
    '--color-text-primary': ['#0F172A', '#E2E8F0'],
  },
})

// Reads only the name of the nearest theme; outside any Theme it is `neutral`.
const ThemeName = defineComponent(() => {
  const { name } = useTheme()
  return () => h(Text, { type: 'body' }, () => name.value)
})
</script>

<template>
  <Theme :theme="harborTheme">
    <Card :padding="4" :width="280">
      <ThemeName />
    </Card>
  </Theme>
</template>
