<script setup lang="ts">
import type * as Monaco from 'monaco-editor'
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { loadMonaco, monacoEditorOptions } from './monacoSetup'

const props = defineProps<{
  modelValue: string
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const host = ref<HTMLElement | null>(null)
const editor = shallowRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
let applying = false

onMounted(async () => {
  if (!host.value)
    return
  const monaco = await loadMonaco()
  const instance = monaco.editor.create(host.value, {
    ...monacoEditorOptions,
    value: props.modelValue,
    language: 'html',
    theme: 'github-light',
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
