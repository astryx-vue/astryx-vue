<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const cards = [
  { title: 'Getting Started', description: 'Learn the basics of the platform.' },
  { title: 'Components', description: 'Browse the full component library.' },
  { title: 'Design Tokens', description: 'Colors, spacing, and typography.' },
  { title: 'Theming', description: 'Customize the look and feel.' },
  { title: 'Accessibility', description: 'Build inclusive experiences.' },
  { title: 'Patterns', description: 'Common UI composition patterns.' },
]
</script>

<template>
  <Grid :columns="{ minWidth: 180 }" :gap="5" width="100%" style="max-width: 400px">
    <Card v-for="card in cards" :key="card.title">
      <VStack :gap="1">
        <Text display="block" type="label">
          {{ card.title }}
        </Text>
        <Text display="block" type="supporting">
          {{ card.description }}
        </Text>
      </VStack>
    </Card>
  </Grid>
</template>
