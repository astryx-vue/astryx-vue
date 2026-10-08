<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="collapsible-preview">
    <VStack class="collapsible-preview__surface" :gap="4">
      <Collapsible trigger="Payment method" :default-is-open="false">
        <Text type="body" color="secondary">
          Card details are stored with the payment provider and are never shown
          in full again.
        </Text>
      </Collapsible>
      <Collapsible trigger="Invoice history" is-disabled>
        <Text type="body" color="secondary">
          This section is unavailable until the account finishes verification.
        </Text>
      </Collapsible>
    </VStack>
  </div>
</template>
