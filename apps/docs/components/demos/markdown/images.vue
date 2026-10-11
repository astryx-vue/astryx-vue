<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  'Here is some text before the image.\n\n![A landscape photo](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=680&h=400&fit=crop&auto=format)\n\nText between two images.\n\n![A tall portrait photo](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop&auto=format)\n\nAnd here is a wide one:\n\n![Wide panoramic shot](https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=300&fit=crop&auto=format)\n\nFinal paragraph after all images.',
  'Here is some text before the image.\n\n![A landscape photo](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=680&h=400&fit=crop&auto=format)\n\nText between two images.\n\n![A tall portrait photo](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=600&fit=crop&auto=format)\n\nAnd here is a wide one:\n\n![Wide panoramic shot](https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=300&fit=crop&auto=format)\n\nFinal paragraph after all images.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
