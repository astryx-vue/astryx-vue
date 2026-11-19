<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Card :width="320">
    <Stack direction="vertical" :gap="2">
      <Heading :level="4">
        Card title
      </Heading>
      <Text type="body" color="secondary">
        Cards group related content with a border and background. Use them for profiles, settings panels, or data summaries.
      </Text>
    </Stack>
  </Card>
</template>
