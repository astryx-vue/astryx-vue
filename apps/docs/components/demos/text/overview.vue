<script setup lang="ts">
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="2">
    <Text type="body">
      Body: The bulk of content
    </Text>
    <Text type="large">
      Large: Emphasized content
    </Text>
    <Text type="label">
      Label: Form and chart labels
    </Text>
    <Text type="supporting">
      Supporting: Helper text
    </Text>
    <Text type="code">
      Code: const x = 42;
    </Text>
  </Stack>
</template>
