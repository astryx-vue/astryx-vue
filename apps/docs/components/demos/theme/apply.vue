<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineTheme, Theme } from '@astryx-vue/core/Theme'

const forestTheme = defineTheme({
  name: 'forest-docs',
  tokens: {
    '--color-accent': ['#15803D', '#86EFAC'],
    '--color-background-card': ['#FFFFFF', '#0F3D24'],
    '--color-text-primary': ['#052E16', '#DCFCE7'],
    '--color-text-secondary': ['#166534', '#BBF7D0'],
    '--color-border': ['#BBF7D0', '#15803D66'],
  },
})
</script>

<template>
  <Section variant="muted" :padding="4" :max-width="420">
    <Theme :theme="forestTheme">
      <Card :padding="4" width="100%">
        <Stack direction="vertical" :gap="3">
          <Heading :level="4">
            Forest workspace
          </Heading>
          <Text type="body" color="secondary">
            Wrap any subtree to apply a theme locally.
          </Text>
          <Button label="Create project" variant="primary" />
        </Stack>
      </Card>
    </Theme>
  </Section>
</template>
