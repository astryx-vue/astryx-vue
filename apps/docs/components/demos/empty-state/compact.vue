<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
import { Icon } from '@astryx-vue/core/Icon'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <EmptyState
    title="No notifications"
    description="You're all caught up. New notifications will appear here."
    is-compact
  >
    <template #icon>
      <Icon icon="i-heroicons-inbox" size="lg" />
    </template>
    <template #actions>
      <HStack :gap="2">
        <Button label="Settings" variant="secondary" size="sm" />
        <Button label="Refresh" variant="primary" size="sm" />
      </HStack>
    </template>
  </EmptyState>
</template>
