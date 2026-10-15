<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="2" style="width: 100%; max-width: 360px">
    <Heading :level="2" :accessibility-level="1" justify="center">
      Quarterly review
    </Heading>
    <Heading :level="3" has-strikethrough justify="start">
      Draft agenda
    </Heading>
    <Text as="p" justify="center" text-wrap="balance">
      The visual size stays on the page. The outline level is what assistive technology reads.
    </Text>
  </VStack>
</template>
