<script setup lang="ts">
import { BottomSheet } from '@astryx-vue/core/BottomSheet'
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const isOpen = ref(false)
const backgroundClicks = ref(0)
</script>

<template>
  <Section :padding="4">
    <VStack :gap="3">
      <Heading :level="3">
        Nearby places
      </Heading>
      <Text type="body">
        Background interactions: {{ backgroundClicks }}
      </Text>
      <Button label="Interact with page" variant="secondary" @click="backgroundClicks += 1" />
      <Button label="Show place details" @click="isOpen = true" />
    </VStack>
    <BottomSheet
      v-model:is-open="isOpen"
      :has-scrim="false"
      height="hug"
      label="Place details"
    >
      <VStack :gap="4">
        <Heading :level="3">
          Central Park
        </Heading>
        <Divider />
        <Text type="body">
          The page remains visible and interactive behind this sheet.
        </Text>
        <Button label="Close details" @click="isOpen = false" />
      </VStack>
    </BottomSheet>
  </Section>
</template>
