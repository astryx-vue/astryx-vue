<script setup lang="ts">
import { Icon, useSemanticIcon } from '@astryx-vue/core/Icon'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { defineTheme, Theme, useTheme } from '@astryx-vue/core/Theme'
import { defineComponent, h } from 'vue'

const statusIconTheme = defineTheme({
  name: 'status-icons-docs',
  icons: {
    success: 'heroicons:check-badge-20-solid',
    warning: 'heroicons:exclamation-circle-20-solid',
    error: 'heroicons:no-symbol-20-solid',
  },
})

const statuses = [
  { icon: 'success', label: 'Passed' },
  { icon: 'warning', label: 'Flaky' },
  { icon: 'error', label: 'Failed' },
] as const

// A custom row that asks the nearest theme which drawing each status uses.
const StatusRow = defineComponent(() => {
  const ids = statuses.map(status => useSemanticIcon(status.icon))
  return () => h(HStack, { gap: 4 }, () => statuses.map((status, index) =>
    h(HStack, { key: status.icon, gap: 1, align: 'center' }, () => [
      h(Icon, { name: ids[index]!.value }),
      h(Text, { type: 'body' }, () => status.label),
    ])))
})

const { mode } = useTheme()
</script>

<template>
  <VStack :gap="4">
    <VStack :gap="2">
      <Text type="supporting" color="secondary">
        Current theme
      </Text>
      <StatusRow />
    </VStack>
    <Theme :theme="statusIconTheme" :mode="mode">
      <VStack :gap="2">
        <Text type="supporting" color="secondary">
          Theme with its own status icons
        </Text>
        <StatusRow />
      </VStack>
    </Theme>
  </VStack>
</template>
