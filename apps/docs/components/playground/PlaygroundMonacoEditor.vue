<script setup lang="ts">
import type * as Monaco from 'monaco-editor'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { loadMonaco, monacoEditorOptions } from './monacoSetup'

const props = defineProps<{
  modelValue: string
  label: string
  active: boolean
  colorMode: 'light' | 'dark'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const host = ref<HTMLElement | null>(null)
const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
let monacoApi: typeof Monaco | null = null
let applying = false

function editorTheme(mode: 'light' | 'dark'): string {
  return mode === 'dark' ? 'github-dark' : 'github-light'
}

onMounted(async () => {
  if (!host.value)
    return
  const monaco = await loadMonaco()
  monacoApi = monaco
  const instance = monaco.editor.create(host.value, {
    ...monacoEditorOptions,
    value: props.modelValue,
    language: 'html',
    theme: editorTheme(props.colorMode),
    ariaLabel: props.label,
  })
  instance.onDidChangeModelContent(() => {
    if (applying)
      return
    emit('update:modelValue', instance.getValue())
  })
  editor.value = instance
})

onBeforeUnmount(() => {
  editor.value?.dispose()
  editor.value = null
})

watch(() => props.modelValue, (value) => {
  const instance = editor.value
  if (!instance || value === instance.getValue())
    return
  applying = true
  instance.setValue(value)
  applying = false
})

watch(() => props.active, (active) => {
  if (active)
    editor.value?.focus()
})

watch(() => props.colorMode, (mode) => {
  monacoApi?.editor.setTheme(editorTheme(mode))
})

function formatDocument(): void {
  void editor.value?.getAction('editor.action.formatDocument')?.run()
}

defineExpose({ formatDocument })
</script>

<template>
  <div ref="host" class="playground-monaco" />
</template>

<style scoped>
.playground-monaco {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}
</style>
