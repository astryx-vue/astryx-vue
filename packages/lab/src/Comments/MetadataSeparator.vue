<script setup lang="ts">
import { Text } from '@astryx-vue/core'

defineOptions({ name: 'AstryxCommentMetadataSeparator' })

withDefaults(defineProps<{
  type?: 'body' | 'supporting'
}>(), {
  type: 'body',
})
</script>

<template>
  <Text as="span" :type="type" color="secondary" aria-hidden="true">
    ·
  </Text>
</template>
