<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="3">
    <Text type="body">
      Run <Code>npm install @astryxdesign/core</Code> to add the package.
    </Text>
    <Text type="body">
      Use the <Code>variant</Code> prop to switch between <Code>primary</Code>, <Code>secondary</Code>, and <Code>ghost</Code> styles.
    </Text>
  </Stack>
</template>
