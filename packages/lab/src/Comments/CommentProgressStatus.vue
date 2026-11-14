<script setup lang="ts">
import type { CommentProgress } from './types.js'
import { HStack, Link, Text, useAnnounce } from '@astryx-vue/core'
import { watch } from 'vue'

defineOptions({ name: 'AstryxCommentProgressStatus' })

const props = defineProps<{ progress: CommentProgress }>()
const announce = useAnnounce()

watch(() => props.progress.label, (label) => {
  if (label !== '')
    announce(label, 'polite')
}, { immediate: true })
</script>

<template>
  <HStack :gap="1" align="center" wrap="wrap" width="100%" data-comment-progress="shimmer">
    <Text type="body" color="secondary" class="astryx-comment-progress-label">
      {{ progress.label }}
    </Text>
    <Link v-if="progress.link != null" :href="progress.link.href" target="_blank" type="body">
      {{ progress.link.label }}
    </Link>
  </HStack>
</template>
