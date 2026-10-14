<script setup lang="ts">
import { Code } from '@astryx-vue/core/Code'
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Heading :level="3">
      Heading with <Code size="inherit">inline code</Code>
    </Heading>
    <Text type="body">
      Body text with <Code size="inherit">inline code</Code>
    </Text>
    <Text type="supporting">
      Supporting text with <Code size="inherit">inline code</Code>
    </Text>
    <Text type="label">
      Label text with <Code size="inherit">inline code</Code>
    </Text>
  </VStack>
</template>
