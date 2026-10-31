<script setup lang="ts">
import type { EditorState } from 'lexical'
import { RichTextEditor, RichTextEditorToolbar } from '@astryx-vue/richtext'
import { ref } from 'vue'

const editor = ref<{ getMarkdown: () => string, clear: () => void }>()
const markdown = ref('')
const count = ref(0)

function onChange(_state: EditorState): void {
  count.value += 1
  markdown.value = editor.value?.getMarkdown() ?? ''
}
</script>

<template>
  <div>
    <RichTextEditor ref="editor" label="Release notes" placeholder="改一改，下面会跟着变" :min-height="140" @change="onChange">
      <template #toolbar>
        <RichTextEditorToolbar />
      </template>
    </RichTextEditor>
    <p class="richtext-demo-hint">
      内容变化 {{ count }} 次。<button type="button" class="richtext-demo-button" @click="editor?.clear()">
        清空
      </button>
    </p>
    <pre class="richtext-demo-output">{{ markdown }}</pre>
  </div>
</template>
