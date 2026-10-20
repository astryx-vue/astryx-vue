<script setup lang="ts">
import { MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { HStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <HStack align="center" :gap="3">
    <MobileNavToggle v-model:is-open="open" label="Open menu" />
    <Text weight="bold">
      Page title
    </Text>
  </HStack>
</template>
