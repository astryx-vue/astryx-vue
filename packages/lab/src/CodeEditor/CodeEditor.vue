<script setup lang="ts">
import type { TokenLine } from '@astryx-vue/core'
import type { CodeEditorEmits, CodeEditorProps } from './types.js'
import { applyHighlightRangesFlat, SYNC_TOKENIZE_THRESHOLD, tokenize, tokenizeAsync, VisuallyHidden } from '@astryx-vue/core'
import { computed, nextTick, onBeforeUnmount, ref, useId, useTemplateRef, watch } from 'vue'
import { caretTextOffset, insertAtCaret, outdentCurrentLine, setCaretAtTextOffset } from './keyboard.js'
import '../../styles/code-editor.css'

defineOptions({ name: 'AstryxCodeEditor' })
const props = withDefaults(defineProps<CodeEditorProps>(), {
  language: 'plaintext',
  size: 'md',
  escapeHint: 'Press Escape then Tab to move focus out of the editor.',
})
const emit = defineEmits<CodeEditorEmits>()
const editor = useTemplateRef<HTMLElement>('editor')
const focused = ref(false)
const composing = ref(false)
const tabMovesFocus = ref(false)
const hintId = `astryx-code-editor-${useId()}-escape`
const lines = computed(() => props.value.split('\n'))
const showPlaceholder = computed(() => props.value === '' && Boolean(props.placeholder))
const containerStyle = computed(() => props.maxHeight == null
  ? undefined
  : { maxHeight: typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight })

const AUTO_CLOSE_PAIRS: Record<string, string> = { '(': ')', '[': ']', '{': '}', '"': '"', '\'': '\'', '`': '`' }
const MODE_NEUTRAL_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'])
let highlightCleanup: (() => void) | undefined
let highlightAbort: AbortController | undefined

function hasHighlightAPI(): boolean {
  return typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined'
}

function paint(tokens: TokenLine[], element: HTMLElement): void {
  highlightCleanup?.()
  highlightCleanup = tokens.length === 0 ? undefined : applyHighlightRangesFlat(element, tokens)
}

function paintCurrent(): void {
  const element = editor.value
  if (!element || !hasHighlightAPI())
    return
  highlightAbort?.abort()
  highlightCleanup?.()
  highlightCleanup = undefined
  const custom = props.tokenizer
  if (props.value.length >= SYNC_TOKENIZE_THRESHOLD && custom == null) {
    const controller = new AbortController()
    highlightAbort = controller
    void tokenizeAsync(props.value, props.language, controller.signal).then((tokens) => {
      if (!controller.signal.aborted && editor.value === element)
        paint(tokens, element)
    })
    return
  }
  paint((custom ?? tokenize)(props.value, props.language), element)
}

watch([() => props.value, () => props.language, () => props.tokenizer], () => {
  void nextTick(paintCurrent)
}, { immediate: true, flush: 'post' })

watch(() => props.value, (value) => {
  const element = editor.value
  if (element && element.textContent !== value)
    element.textContent = value
}, { flush: 'post' })

onBeforeUnmount(() => {
  highlightAbort?.abort()
  highlightCleanup?.()
})

function commit(): void {
  emit('change', editor.value?.textContent ?? '')
}

function onInput(): void {
  if (!composing.value)
    commit()
}

function onKeydown(event: KeyboardEvent): void {
  if (props.isReadOnly)
    return
  if (event.key === 'Escape') {
    if (!event.defaultPrevented)
      tabMovesFocus.value = true
    return
  }
  const element = editor.value
  if (!element)
    return

  if (event.key === 'Tab') {
    if (tabMovesFocus.value) {
      tabMovesFocus.value = false
      return
    }
    event.preventDefault()
    if (event.shiftKey) {
      const result = outdentCurrentLine(element)
      if (result == null)
        return
      element.textContent = result.value
      setCaretAtTextOffset(element, result.caret)
    }
    else {
      insertAtCaret(element, '  ')
    }
    commit()
    return
  }

  if (!MODE_NEUTRAL_KEYS.has(event.key))
    tabMovesFocus.value = false

  if (event.key === 'Enter') {
    event.preventDefault()
    const offset = caretTextOffset(element)
    if (offset == null)
      return
    const before = (element.textContent ?? '').slice(0, offset)
    const line = before.slice(before.lastIndexOf('\n') + 1)
    const indent = line.match(/^\s*/)?.[0] ?? ''
    insertAtCaret(element, `\n${indent}`)
    commit()
    return
  }

  const close = AUTO_CLOSE_PAIRS[event.key]
  if (close) {
    const selection = element.ownerDocument.defaultView?.getSelection()
    if (!selection || selection.rangeCount === 0 || !selection.getRangeAt(0).collapsed)
      return
    event.preventDefault()
    insertAtCaret(element, `${event.key}${close}`)
    const offset = caretTextOffset(element)
    if (offset != null)
      setCaretAtTextOffset(element, offset - close.length)
    commit()
  }
}
</script>

<template>
  <div
    class="astryx-code-editor"
    :class="{ 'is-focused': focused }"
    :data-size="size"
    :data-language="language"
  >
    <div class="astryx-code-editor__container" :style="containerStyle">
      <div v-if="hasLineNumbers" class="astryx-code-editor__gutter" aria-hidden="true">
        <div v-for="(_, index) in lines" :key="index">
          {{ index + 1 }}
        </div>
      </div>
      <div class="astryx-code-editor__body">
        <div v-if="showPlaceholder" class="astryx-code-editor__placeholder" aria-hidden="true">
          {{ placeholder }}
        </div>
        <code
          ref="editor"
          class="astryx-code-editor__input"
          :contenteditable="isReadOnly ? 'false' : 'plaintext-only'"
          tabindex="0"
          role="textbox"
          aria-multiline="true"
          :aria-label="label"
          :aria-readonly="isReadOnly || undefined"
          :aria-describedby="isReadOnly ? undefined : hintId"
          spellcheck="false"
          @input="onInput"
          @keydown="onKeydown"
          @focus="focused = true"
          @blur="focused = false; tabMovesFocus = false"
          @compositionstart="composing = true"
          @compositionend="composing = false; onInput()"
        >{{ value }}</code>
        <VisuallyHidden v-if="!isReadOnly" :id="hintId">
          {{ escapeHint }}
        </VisuallyHidden>
      </div>
    </div>
  </div>
</template>
