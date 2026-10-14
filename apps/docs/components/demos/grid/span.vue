<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid, GridSpan } from '@astryx-vue/core/Grid'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const stats = [
  { label: 'Components', value: '54 available' },
  { label: 'Templates', value: '28 available' },
  { label: 'Tokens', value: '120 defined' },
  { label: 'Themes', value: '6 published' },
  { label: 'Icons', value: '312 available' },
  { label: 'Patterns', value: '18 documented' },
  { label: 'Contributors', value: '42 active' },
]
</script>

<template>
  <Grid :columns="3" :gap="4" width="100%" style="max-width: 500px">
    <GridSpan :rows="2">
      <Card variant="cyan">
        <VStack :gap="1">
          <Text display="block" type="label">
            Featured Release
          </Text>
          <Text display="block" type="supporting">
            Astryx 4.0 is now available with new layout primitives, refreshed tokens, and improved theming support across the system.
          </Text>
        </VStack>
      </Card>
    </GridSpan>
    <Card v-for="stat in stats" :key="stat.label">
      <Text display="block" type="label">
        {{ stat.label }}
      </Text>
      <Text display="block" type="supporting">
        {{ stat.value }}
      </Text>
    </Card>
    <GridSpan columns="full">
      <Card variant="cyan">
        <VStack :gap="1">
          <Text display="block" type="label">
            Community Showcase
          </Text>
          <Text display="block" type="supporting">
            See how teams are building with Astryx across the organization
          </Text>
        </VStack>
      </Card>
    </GridSpan>
  </Grid>
</template>
