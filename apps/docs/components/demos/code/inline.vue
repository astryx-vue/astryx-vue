<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Text type="body" style="max-width: 400px">
    Use <Code>useState</Code>for local state and <Code>useEffect</Code>for side effects. If you need shared state across components, consider <Code>useContext</Code>or a state management library.
  </Text>
</template>
