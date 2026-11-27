<script setup lang="ts">
import { Card } from '@astryx-vue/core/Card'
import { Icon } from '@astryx-vue/core/Icon'
import { IconButton } from '@astryx-vue/core/IconButton'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { useToast } from '@astryx-vue/core/Toast'
import { VisuallyHidden } from '@astryx-vue/core/VisuallyHidden'

const toast = useToast()

function demo(label: string): void {
  toast({ body: `Demo: ${label} would run here` })
}

const actions = [
  { label: 'Download', icon: 'i-heroicons-arrow-down-tray' },
  { label: 'Share', icon: 'i-heroicons-share' },
  { label: 'Delete', icon: 'i-heroicons-trash' },
] as const
</script>

<template>
  <VStack :gap="5" h-align="center">
    <HStack align="stretch" :gap="6" wrap="wrap" h-align="center">
      <Card variant="muted">
        <VStack :gap="4" h-align="center">
          <Text type="supporting" color="secondary">
            What you see
          </Text>
          <HStack :gap="2">
            <IconButton
              v-for="action in actions"
              :key="action.label"
              :label="action.label"
              variant="ghost"
              @click="demo(action.label)"
            >
              <Icon :icon="action.icon" />
            </IconButton>
          </HStack>
        </VStack>
      </Card>

      <Card variant="muted">
        <VStack :gap="4" h-align="start">
          <HStack align="center" :gap="2">
            <Icon icon="i-heroicons-speaker-wave-solid" size="sm" />
            <Text type="supporting" color="secondary">
              What a screen reader hears
            </Text>
          </HStack>
          <VStack :gap="2">
            <Text v-for="action in actions" :key="action.label" type="body">
              {{ action.label }}, button
            </Text>
          </VStack>
        </VStack>
      </Card>
    </HStack>

    <!-- A real live region: silent to sighted users, announced by AT. -->
    <VisuallyHidden as="div" aria-live="polite">
      Actions available: Download, Share, Delete.
    </VisuallyHidden>
  </VStack>
</template>
