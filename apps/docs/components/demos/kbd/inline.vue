<script setup lang="ts">
import { Kbd } from '@astryx-vue/core/Kbd'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Text type="body">
      Press <Kbd keys="mod+k" /> to open the command palette.
    </Text>
    <Text type="body">
      Use <Kbd keys="mod+shift+p" /> to access all commands.
    </Text>
    <Text type="body">
      Press <Kbd keys="escape" /> to close the dialog.
    </Text>
    <Text type="body">
      Navigate with <Kbd keys="up" /> and <Kbd keys="down" /> arrow keys, then press <Kbd keys="enter" /> to select.
    </Text>
  </VStack>
</template>
