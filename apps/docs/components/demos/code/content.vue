<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Text type="body">
      Variable: <Code>const count = 0</Code>
    </Text>
    <Text type="body">
      Terminal: <Code>yarn build --watch</Code>
    </Text>
    <Text type="body">
      CSS property: <Code>border-radius: 8px</Code>
    </Text>
    <Text type="body">
      File path: <Code>packages/core/src/CodeBlock/Code.tsx</Code>
    </Text>
    <Text type="body">
      Keyboard shortcut: <Code>Ctrl+Shift+P</Code>
    </Text>
  </VStack>
</template>
