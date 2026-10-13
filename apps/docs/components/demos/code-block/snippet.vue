<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'
import { VStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <VStack :gap="4" width="100%" :max-width="400">
    <CodeBlock code="npm install @astryxdesign/core" language="bash" has-copy-button width="100%" />
    <CodeBlock code="yarn add @astryxdesign/theme-neutral" language="bash" has-copy-button width="100%" />
  </VStack>
</template>
