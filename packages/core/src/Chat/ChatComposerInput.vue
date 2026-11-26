<script setup lang="ts">
import type { ChatComposerInputEmits, ChatComposerInputHandle, ChatComposerInputProps, ChatComposerToken } from './types.js'
import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
import { withholdCallerHandlers } from '../utils/disabledInteraction.js'
import { isImeKeyEvent } from '../utils/ime.js'
import ChatPastedTextToken from './ChatPastedTextToken.vue'
import ChatTokenContent from './ChatTokenContent.vue'
import ChatTriggerMenu from './ChatTriggerMenu.vue'
import { useChatComposerContext } from './context.js'
import { hasEmitListener, propPassedChecker, wasPropPassed } from './events.js'
import { getSelectionRangeInside, insertTextAtCursor, placeCaretAtEnd, restoreSelectionRange } from './selection.js'
import { composerHasChip, serializeComposer } from './serialize.js'
import { isCustomToken } from './tokens.js'
import { useChatComposerTokens } from './useChatComposerTokens.js'
import { PASTE_TOKEN_THRESHOLD, useChatPasteAsToken } from './useChatPasteAsToken.js'
import { useComposerHistory } from './useComposerHistory.js'
import { useTriggerMenu } from './useTriggerMenu.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatComposerInput', inheritAttrs: false })

const props = withDefaults(defineProps<ChatComposerInputProps>(), {
  maxRows: 8,
  debounceMs: 150,
  hasHistory: true,
  enterKeyHint: 'send',
})
const emit = defineEmits<ChatComposerInputEmits>()

const LINE_HEIGHT = 22
const messages = useComponentMessages({ chat: chatMessages })
const attrs = useAttrs()
const composer = useChatComposerContext()
const editableRef = useTemplateRef<HTMLDivElement>('editable')
const self = ref<ChatComposerInputHandle | null>(null)
const isEmpty = ref(true)
const pendingEcho = ref<string | undefined>(undefined)
const emitVersion = ref(0)

const submitListened = hasEmitListener('submit')
const isDisabledPassed = propPassedChecker('isDisabled')
const disabled = computed(() => {
  const own = props.isDisabled
  return isDisabledPassed() ? Boolean(own) : (composer?.isDisabled.value ?? false)
})
const placeholder = computed(() => props.placeholder ?? composer?.placeholder.value ?? messages.value.chat.placeholder)
const label = computed(() => props.label ?? messages.value.chat.inputLabel)
const sourceValue = computed(() => props.modelValue !== undefined ? props.modelValue : composer?.value.value)
// 禁用时保留聚焦和失焦的观察，其余调用方的回调（含捕获阶段）不再触发。
function rootAttrs(): Record<string, unknown> {
  return withholdCallerHandlers(attrs, disabled.value)
}
const maxHeight = computed(() => `${props.maxRows * LINE_HEIGHT}px`)
const triggers = computed(() => props.triggers)
const debounce = computed(() => props.debounceMs)
const historyEnabled = computed(() => props.hasHistory)

function readValue(): string {
  return serializeComposer(editableRef.value ?? document.createElement('div'))
}

const tokens = useChatComposerTokens({
  editable: editableRef,
  onEmitChange: () => publish(readValue()),
})

function publish(next: string): void {
  if (disabled.value)
    return
  pendingEcho.value = next
  const editable = editableRef.value
  const chips = editable ? composerHasChip(editable) : false
  const trimmedEmpty = next.trim().length === 0 && !chips
  const value = trimmedEmpty ? '' : next
  pendingEcho.value = value
  isEmpty.value = trimmedEmpty
  emitVersion.value += 1
  if (props.modelValue !== undefined) {
    emit('update:modelValue', value)
    emit('change', value)
  }
  else {
    composer?.onChange(value)
    emit('update:modelValue', value)
    emit('change', value)
  }
  tokens.cleanupPortals()
}

const defaultPaste = useChatPasteAsToken({ input: self })
const pastePassed = wasPropPassed('pasteAsToken')
const pasteAsToken = computed(() => {
  // `false` is a Boolean in the prop type, so an omitted value arrives as false.
  if (!pastePassed)
    return defaultPaste
  return props.pasteAsToken === false ? null : (props.pasteAsToken ?? defaultPaste)
})

function focusEditable(): void {
  const editable = editableRef.value
  if (!editable)
    return
  const existing = getSelectionRangeInside(editable)
  editable.focus()
  if (existing) {
    restoreSelectionRange(existing)
    return
  }
  placeCaretAtEnd(editable)
}

function focusAtEnd(): void {
  const editable = editableRef.value
  if (!editable)
    return
  editable.focus()
  placeCaretAtEnd(editable)
}

const history = useComposerHistory({
  enabled: historyEnabled,
  editable: editableRef,
  onRecall: () => publish(readValue()),
})

const menu = useTriggerMenu({
  triggers,
  editable: editableRef,
  debounceMs: debounce,
  defaultLoadingText: computed(() => messages.value.chat.searching),
  onInsertToken: (token) => {
    tokens.insertToken(token)
  },
  onInsertText: (text) => {
    const editable = editableRef.value
    if (editable)
      insertTextAtCursor(editable, text)
  },
  onEmitChange: () => publish(readValue()),
})

function insertText(text: string): void {
  const editable = editableRef.value
  if (!editable || disabled.value)
    return
  insertTextAtCursor(editable, text)
  publish(readValue())
  menu.handleInput()
}

const handle: ChatComposerInputHandle = {
  insertToken: (token) => {
    if (disabled.value)
      return undefined
    const id = tokens.insertToken(token)
    if (id)
      publish(readValue())
    return id
  },
  expandToken: (id) => {
    if (!disabled.value)
      tokens.expandToken(id)
  },
  insertText,
  focus: focusEditable,
  getValue: readValue,
}
self.value = handle

const menuOpen = computed(() => menu.isMenuVisible.value && !disabled.value)
const isCombobox = computed(() => menu.hasTriggers.value)
const activeDescendant = computed(() => {
  if (!menuOpen.value || menu.state.highlightedIndex < 0)
    return undefined
  return `${menu.listboxId}-option-${menu.state.highlightedIndex}`
})

const menuLabel = computed(() => menu.state.activeTrigger?.menuLabel ?? messages.value.chat.suggestions)
const loadingText = computed(() => menu.state.activeTrigger?.loadingText ?? messages.value.chat.searching)
const emptyContent = computed(() => {
  const value = menu.state.activeTrigger?.emptySearchText
  if (value === '')
    return ''
  if (value == null)
    return messages.value.chat.noResults
  return value
})

function submitValue(text: string): void {
  if (submitListened || !composer)
    emit('submit', text)
  else
    composer.onSubmit(text)
}

function onInput(): void {
  if (disabled.value)
    return
  publish(readValue())
  menu.handleInput()
}

// 编辑区里的按压不会关菜单，但点击可能把光标挪出查询：在新光标处重新判断一次触发。
function onEditorClick(): void {
  if (!disabled.value && menu.state.isActive)
    menu.handleInput()
}

function onKeyDown(event: KeyboardEvent): void {
  if (disabled.value) {
    // 原生选择、复制和 Tab 照常；其余按键不动草稿。
    if (event.key === 'Enter' || event.key === ' ')
      event.preventDefault()
    return
  }
  if (menu.handleKeyDown(event))
    return
  emit('keydown', event)
  if (event.defaultPrevented)
    return
  if (tokens.handleKeyDown(event))
    return
  if (event.key === 'Enter' && !event.shiftKey) {
    if (isImeKeyEvent(event))
      return
    event.preventDefault()
    const editable = editableRef.value
    if (!editable)
      return
    const text = serializeComposer(editable).trim()
    if (!text)
      return
    history.remember(text)
    submitValue(text)
    tokens.clearPortals()
    editable.textContent = ''
    isEmpty.value = true
    menu.reset()
    publish('')
    return
  }
  history.onKeyDown(event)
}

function onPaste(event: ClipboardEvent): void {
  const editable = editableRef.value
  if (!editable)
    return
  if (disabled.value) {
    event.preventDefault()
    return
  }
  const files = Array.from(event.clipboardData?.files ?? [])
  if (files.length > 0) {
    event.preventDefault()
    emit('files', files)
    return
  }
  if (tokens.handlePaste(event))
    return
  event.preventDefault()
  const text = event.clipboardData?.getData('text/plain') ?? ''
  const version = emitVersion.value
  if (props.pasteAction?.(event, text)) {
    if (emitVersion.value === version)
      publish(readValue())
    return
  }
  // 默认的粘贴成令牌走句柄插入，句柄已经发布过变化。
  const tokenVersion = emitVersion.value
  if (pasteAsToken.value?.onPaste(text)) {
    if (emitVersion.value === tokenVersion)
      publish(readValue())
    return
  }
  insertTextAtCursor(editable, text)
  publish(readValue())
}

function onDragOver(event: DragEvent): void {
  if (Array.from(event.dataTransfer?.types ?? []).includes('Files'))
    event.preventDefault()
}

function onDrop(event: DragEvent): void {
  if (disabled.value) {
    event.preventDefault()
    return
  }
  const files = Array.from(event.dataTransfer?.files ?? [])
  if (files.length === 0)
    return
  event.preventDefault()
  emit('files', files)
}

const visiblePortals = computed(() => tokens.portals.value.filter(portal => portal.span.isConnected))

function showPastedPreview(token: ChatComposerToken): boolean {
  return !isCustomToken(token) && pasteAsToken.value != null && token.value.length > PASTE_TOKEN_THRESHOLD
}

watch(sourceValue, (next) => {
  const editable = editableRef.value
  if (next === undefined || !editable)
    return
  if (next === pendingEcho.value) {
    pendingEcho.value = undefined
    return
  }
  if (serializeComposer(editable) !== next) {
    pendingEcho.value = undefined
    const focused = document.activeElement === editable
    tokens.clearPortals()
    editable.textContent = next
    if (focused)
      placeCaretAtEnd(editable)
    isEmpty.value = next.length === 0
    menu.handleInput()
  }
  else {
    pendingEcho.value = undefined
  }
})

// 禁用时收起菜单；reset 同时取消还在途中的搜索，迟到的结果不会在禁用或重新启用后再把建议打开。
watch(disabled, (isDisabled) => {
  if (isDisabled && menu.state.isActive)
    menu.reset()
})

onMounted(() => {
  if (composer)
    composer.inputControl.value = { focus: focusAtEnd }
  const next = sourceValue.value
  const editable = editableRef.value
  if (editable && next && serializeComposer(editable) !== next) {
    editable.textContent = next
    isEmpty.value = next.length === 0
  }
})

onBeforeUnmount(() => {
  if (composer?.inputControl.value?.focus === focusAtEnd)
    composer.inputControl.value = null
})

defineExpose(handle)
</script>

<template>
  <div
    v-bind="rootAttrs()"
    class="astryx-chat-composer-input"
    :data-disabled="disabled ? '' : undefined"
  >
    <div v-if="isEmpty" class="astryx-chat-composer-input__placeholder" aria-hidden="true">
      {{ placeholder }}
    </div>
    <!-- contenteditable 就是输入控件；角色和 aria 从脚本绑上。 -->
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -->
    <div
      ref="editable"
      class="astryx-chat-composer-input__editable"
      :style="{ maxHeight }"
      :aria-label="label"
      tabindex="0"
      :contenteditable="disabled ? 'false' : 'true'"
      :enterkeyhint="enterKeyHint"
      :aria-disabled="disabled ? 'true' : undefined"
      :role="isCombobox ? 'combobox' : 'textbox'"
      :aria-multiline="isCombobox ? undefined : 'true'"
      :aria-expanded="isCombobox ? menuOpen : undefined"
      :aria-controls="isCombobox && menuOpen ? menu.listboxId : undefined"
      :aria-activedescendant="isCombobox && menuOpen ? activeDescendant : undefined"
      :aria-haspopup="isCombobox ? 'listbox' : undefined"
      @input="onInput"
      @click="onEditorClick"
      @keydown="onKeyDown"
      @paste="onPaste"
      @dragover="onDragOver"
      @drop="onDrop"
    />
    <ChatTriggerMenu
      :open="menuOpen"
      :anchor="menu.anchor.value"
      :editor="editableRef"
      :listbox-id="menu.listboxId"
      :label="menuLabel"
      :items="menu.state.items"
      :highlighted-index="menu.state.highlightedIndex"
      :loading="menu.state.isLoading"
      :loading-text="loadingText"
      :empty="emptyContent"
      :keyboard-move="menu.keyboardMove.value"
      :render-item="menu.state.activeTrigger?.renderItem"
      @select="menu.selectItem"
      @hover="menu.highlightOnHover"
      @dismiss="menu.reset"
    />
    <Teleport
      v-for="portal in visiblePortals"
      :key="portal.id"
      :to="portal.span"
    >
      <ChatPastedTextToken
        v-if="showPastedPreview(portal.token)"
        :text="portal.token.value"
        @expand="tokens.expandToken(portal.id)"
      />
      <ChatTokenContent v-else :token="portal.token" />
    </Teleport>
  </div>
</template>
