<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="collapsible-preview">
    <VStack class="collapsible-preview__surface" :gap="4">
      <Collapsible trigger="Invoices">
        <Text type="body" color="secondary">
          The trailing chevron follows the label. It points down while the
          section is collapsed and turns up once it is open.
        </Text>
      </Collapsible>
      <Collapsible trigger="Payments" chevron-position="start">
        <Text type="body" color="secondary">
          A leading chevron points into the row while collapsed and turns down
          when the section opens, the pattern file browsers use.
        </Text>
      </Collapsible>
    </VStack>
  </div>
</template>
