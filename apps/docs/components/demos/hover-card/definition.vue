<script setup lang="ts">
import { HoverCard } from '@astryx-vue/core/HoverCard'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Text type="body">
    The component uses a
    <HoverCard placement="above">
      focus trap
      <template #content>
        <VStack :gap="1" style="max-width: 200px">
          <Text type="label">
            Focus trap
          </Text>
          <Text type="body" color="secondary">
            A pattern that keeps keyboard focus inside a container, preventing it from moving to elements outside. Used in dialogs and modals to ensure accessibility.
          </Text>
        </VStack>
      </template>
    </HoverCard>
    to keep keyboard navigation inside the
    <HoverCard placement="above">
      modal dialog
      <template #content>
        <VStack :gap="1" style="max-width: 200px">
          <Text type="label">
            Modal dialog
          </Text>
          <Text type="body" color="secondary">
            An overlay that blocks interaction with the rest of the page until the user responds. Uses the native HTML dialog element for built-in accessibility and backdrop support.
          </Text>
        </VStack>
      </template>
    </HoverCard>.
  </Text>
</template>
