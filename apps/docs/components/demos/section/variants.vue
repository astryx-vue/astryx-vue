<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="6">
    <Section :padding="5" variant="section">
      <VStack :gap="1">
        <Text type="body" weight="bold">
          Section
        </Text>
        <Text color="secondary" type="supporting">
          White background.
        </Text>
      </VStack>
    </Section>
    <Section :padding="5" variant="muted">
      <VStack :gap="1">
        <Text type="body" weight="bold">
          Wash
        </Text>
        <Text color="secondary" type="supporting">
          Gray background.
        </Text>
      </VStack>
    </Section>
    <Section :padding="5" variant="transparent">
      <VStack :gap="1">
        <Text type="body" weight="bold">
          Transparent
        </Text>
        <Text color="secondary" type="supporting">
          No background, shows the color behind it.
        </Text>
      </VStack>
    </Section>
  </VStack>
</template>
