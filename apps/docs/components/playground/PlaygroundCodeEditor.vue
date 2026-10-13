<script setup lang="ts">
import type { Extension } from '@codemirror/state'
import { vue } from '@codemirror/lang-vue'
import { Compartment, EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { basicSetup, EditorView } from 'codemirror'
import { useData } from 'vitepress'
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
const { isDark } = useData()
const themeCompartment = new Compartment()
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

watch(isDark, (dark) => {
  view?.dispatch({
    effects: themeCompartment.reconfigure(dark ? oneDark : []),
  })
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
    themeCompartment.of(isDark.value ? oneDark : []),
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
