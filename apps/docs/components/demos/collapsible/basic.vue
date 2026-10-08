<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="collapsible-preview">
    <VStack class="collapsible-preview__surface" :gap="4">
      <Collapsible trigger="Shipping">
        <Text type="body" color="secondary">
          Orders leave the Rotterdam warehouse within one business day, and the
          tracking number is emailed as soon as the parcel is scanned.
        </Text>
      </Collapsible>
      <Collapsible trigger="Returns" :default-is-open="false">
        <Text type="body" color="secondary">
          Anything unopened can go back within 30 days. Print the label from the
          order page and drop the parcel at any pickup point.
        </Text>
      </Collapsible>
    </VStack>
  </div>
</template>
