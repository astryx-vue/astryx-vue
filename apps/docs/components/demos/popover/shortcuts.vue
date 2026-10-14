<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Divider } from '@astryx-vue/core/Divider'
import { Heading } from '@astryx-vue/core/Heading'
import { Popover } from '@astryx-vue/core/Popover'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const shortcuts = [
  { key: '⌘K', action: 'Command palette' },
  { key: '⌘/', action: 'Toggle sidebar' },
  { key: '⌘.', action: 'Quick actions' },
]
</script>

<template>
  <Popover placement="below" label="Keyboard shortcuts" :width="260">
    <Button label="Shortcuts" />
    <template #content>
      <VStack :gap="2">
        <Heading :level="4">
          Keyboard shortcuts
        </Heading>
        <Divider />
        <HStack v-for="shortcut in shortcuts" :key="shortcut.key" :gap="3">
          <Text type="body" weight="bold">
            {{ shortcut.key }}
          </Text>
          <Text type="body">
            {{ shortcut.action }}
          </Text>
        </HStack>
      </VStack>
    </template>
  </Popover>
</template>
