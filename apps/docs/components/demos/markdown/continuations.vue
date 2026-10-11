<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'
import { computed } from 'vue'
import { useDemoText } from '../../demo-infra/useDemoText'

const { pick } = useDemoText()
const content = computed(() => pick(
  '## Wrapped container paragraphs\n\n> A quoted paragraph can wrap onto another source line\nwithout repeating the quote marker.\n>\n> A later paragraph can wrap too\nand remain in the same quote.\n\n- A list item can wrap the same way\nwithout repeating its indentation.\n\n- [ ] A task item also keeps\nits unindented continuation.\n\n> 1. > Nested quote text\ncontinues in the deepest open paragraph.\n\nThis paragraph follows all containers.',
  '## Wrapped container paragraphs\n\n> A quoted paragraph can wrap onto another source line\nwithout repeating the quote marker.\n>\n> A later paragraph can wrap too\nand remain in the same quote.\n\n- A list item can wrap the same way\nwithout repeating its indentation.\n\n- [ ] A task item also keeps\nits unindented continuation.\n\n> 1. > Nested quote text\ncontinues in the deepest open paragraph.\n\nThis paragraph follows all containers.',
))
</script>

<template>
  <Markdown :content="content" />
</template>
