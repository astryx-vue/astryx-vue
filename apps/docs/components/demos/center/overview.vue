<script setup lang="ts">
import { Center } from '@astryx-vue/core/Center'
import { Heading } from '@astryx-vue/core/Heading'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Center axis="both" width="100%" :height="240">
    <Stack direction="vertical" :gap="2" h-align="center">
      <Heading :level="4">
        Centered content
      </Heading>
      <Text type="body" color="secondary">
        Horizontally and vertically aligned.
      </Text>
    </Stack>
  </Center>
</template>
