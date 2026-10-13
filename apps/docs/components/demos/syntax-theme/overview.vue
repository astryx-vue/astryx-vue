<script setup lang="ts">
import { CodeBlock, oneDarkPro, SyntaxTheme } from '@astryx-vue/core/Code'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'

const sampleCode = `async function save() {
  await api.update(values);
  toast.show('Saved');
}`
</script>

<template>
  <SyntaxTheme :theme="oneDarkPro">
    <Stack direction="vertical" :gap="2" width="360px" max-width="100%">
      <Text type="supporting" weight="bold" color="secondary">
        One Dark Pro preset
      </Text>
      <CodeBlock :code="sampleCode" language="tsx" width="100%" />
    </Stack>
  </SyntaxTheme>
</template>
