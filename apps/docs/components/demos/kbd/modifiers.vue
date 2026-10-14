<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'
import { HStack, VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <HStack :gap="4">
      <Kbd keys="mod+k" />
      <Kbd keys="shift+enter" />
      <Kbd keys="ctrl+c" />
      <Kbd keys="alt+tab" />
    </HStack>
    <HStack :gap="4">
      <Kbd keys="mod+shift+z" />
      <Kbd keys="ctrl+alt+delete" />
      <Kbd keys="mod+shift+p" />
    </HStack>
    <HStack :gap="4">
      <Text type="body">
        Special keys and aliases:
      </Text>
      <Kbd keys="escape" />
      <Kbd keys="esc" />
      <Kbd keys="enter" />
      <Kbd keys="return" />
      <Kbd keys="backspace" />
      <Kbd keys="tab" />
      <Kbd keys="space" />
    </HStack>
  </VStack>
</template>
