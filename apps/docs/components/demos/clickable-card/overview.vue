<script setup lang="ts">
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <ClickableCard label="Settings" href="#" :width="320">
    <Stack direction="vertical" :gap="2">
      <Heading :level="4">
        Settings
      </Heading>
      <Text type="body" color="secondary">
        Click anywhere on this card to navigate. Nested buttons and links work
        independently.
      </Text>
    </Stack>
  </ClickableCard>
</template>
