<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Grid } from '@astryx-vue/core/Grid'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const levels = [
  { elevation: 'none' as const, caption: 'Flat — sits on the page (default)' },
  { elevation: 'low' as const, caption: 'Low — lifts off slightly' },
  { elevation: 'med' as const, caption: 'Med — clearly raised' },
  { elevation: 'high' as const, caption: 'High — floats well above' },
]
</script>

<template>
  <Grid :columns="2" :gap="4" :width="520">
    <Card v-for="level in levels" :key="level.elevation" :elevation="level.elevation">
      <Stack direction="vertical" :gap="1">
        <Heading :level="4">
          elevation="{{ level.elevation }}"
        </Heading>
        <Text type="supporting" color="secondary">
          {{ level.caption }}
        </Text>
      </Stack>
    </Card>
  </Grid>
</template>
