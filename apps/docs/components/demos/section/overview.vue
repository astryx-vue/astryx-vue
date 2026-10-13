<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="section-overview">
    <Section :padding="3" variant="section">
      <Text type="body" weight="semibold">
        Section
      </Text>
    </Section>
    <Section :padding="3" variant="muted">
      <Text type="body" weight="semibold">
        Muted
      </Text>
    </Section>
  </div>
</template>
