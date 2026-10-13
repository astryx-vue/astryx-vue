<script setup lang="ts">
import type { Extension } from '@codemirror/state'
import { vue } from '@codemirror/lang-vue'
import { EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const host = ref<HTMLElement | null>(null)
let view: EditorView | null = null
let applying = false

onMounted(() => {
  if (!host.value)
    return
  view = new EditorView({
    parent: host.value,
    state: EditorState.create({
      doc: props.modelValue,
      extensions: editorExtensions(),
    }),
  })
})

onBeforeUnmount(() => {
  view?.destroy()
  view = null
})

watch(() => props.modelValue, (value) => {
  if (!view || value === view.state.doc.toString())
    return
  applying = true
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: value },
  })
  applying = false
})

watch(() => props.active, (active) => {
  if (active)
    view?.requestMeasure()
})

function editorExtensions(): Extension[] {
  return [
    basicSetup,
    vue(),
    EditorView.lineWrapping,
    EditorState.tabSize.of(2),
    EditorView.theme({
      '&': { height: '100%', backgroundColor: '#f4f5f7', color: '#1c1e21' },
      '.cm-scroller': { fontFamily: 'var(--astryx-font-family-code)' },
      '.cm-content': { padding: '8px 0 24px' },
      '.cm-gutters': { backgroundColor: '#f4f5f7', color: '#9aa1ab', borderRight: 'none' },
      '.cm-activeLine': { backgroundColor: 'rgb(0 0 0 / 3%)' },
      '.cm-activeLineGutter': { backgroundColor: 'transparent' },
    }),
    EditorView.contentAttributes.of({ 'aria-label': props.label }),
    EditorView.updateListener.of((update) => {
      if (applying || !update.docChanged)
        return
      emit('update:modelValue', update.state.doc.toString())
    }),
  ]
}
</script>

<template>
  <div ref="host" class="playground-editor" />
</template>

<style scoped>
.playground-editor {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.playground-editor :deep(.cm-editor) {
  height: 100%;
  background: transparent;
}

.playground-editor :deep(.cm-scroller) {
  font-family: var(--astryx-font-family-code);
  font-size: 13px;
  line-height: 1.55;
}
</style>
