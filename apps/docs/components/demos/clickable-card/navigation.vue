<script setup lang="ts">
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <ClickableCard href="#" label="Settings" :width="320">
    <VStack :gap="2">
      <Heading :level="4">
        Settings
      </Heading>
      <Text color="secondary" type="body">
        Click anywhere on this card to navigate. Nested buttons and links work independently.
      </Text>
    </VStack>
  </ClickableCard>
</template>
