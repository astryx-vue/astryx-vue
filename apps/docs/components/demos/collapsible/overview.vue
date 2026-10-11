<script setup lang="ts">
import { Collapsible } from '@astryx-vue/core/Collapsible'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <div class="collapsible-preview__surface">
    <Collapsible trigger="Shipping">
      <Text type="body" color="secondary">
        Orders leave the warehouse within one business day.
      </Text>
    </Collapsible>
  </div>
</template>
