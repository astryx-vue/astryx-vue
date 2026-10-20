<script setup lang="ts">
import type { ChatComposerEmits, ChatComposerInputControl, ChatComposerProps, ChatComposerSlots } from './types.js'
import { computed, provide, ref, useSlots, useTemplateRef } from 'vue'
import { isKeyboardModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import ChatComposerInput from './ChatComposerInput.vue'
import ChatSendButton from './ChatSendButton.vue'
import { chatComposerContextKey } from './context.js'
import '../../styles/chat.css'

defineOptions({ name: 'AstryxChatComposer', inheritAttrs: false })

const props = withDefaults(defineProps<ChatComposerProps>(), {
  density: 'balanced',
  elevation: 'low',
  statusPosition: 'bottom',
})
const emit = defineEmits<ChatComposerEmits>()
defineSlots<ChatComposerSlots>()
const slots = useSlots()
const messages = useAstryxMessages()
const root = useTemplateRef<HTMLDivElement>('root')
const body = useTemplateRef<HTMLDivElement>('body')
const localValue = ref('')
const controlled = props.modelValue !== undefined
const inputControl = ref<ChatComposerInputControl | null>(null)
const keyboardFocus = ref(false)

trackInteractionModality()

const value = computed(() => controlled ? (props.modelValue ?? '') : localValue.value)
const disabled = computed(() => props.isDisabled ?? false)
const stopShown = computed(() => props.isStopShown ?? false)
const placeholder = computed(() => props.placeholder ?? messages.value.chat.placeholder)
const canSend = computed(() => value.value.trim().length > 0 && !disabled.value)
const hasHeader = computed(() => slots.headerActions != null || slots.headerContext != null)

const editorSelector = 'textarea, [contenteditable="true"], [role="textbox"], input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], input[type="password"]'

function setValue(next: string): void {
  if (!controlled)
    localValue.value = next
  emit('update:modelValue', next)
  emit('change', next)
}

function submit(raw: string): void {
  const trimmed = raw.trim()
  if (!trimmed || disabled.value)
    return
  emit('submit', trimmed)
  setValue('')
}

function stop(): void {
  emit('stop')
}

function onBodyClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Element))
    return
  if (target.closest('button, a, [role="button"], [contenteditable="true"], [data-astryx-token]'))
    return
  if (inputControl.value) {
    inputControl.value.focus()
    return
  }
  body.value?.querySelector<HTMLElement>('[contenteditable="true"], textarea')?.focus()
}

function onPointerDown(): void {
  keyboardFocus.value = false
}

function onFocusIn(event: FocusEvent): void {
  const target = event.target
  keyboardFocus.value = target instanceof HTMLElement
    && target.matches(editorSelector)
    && isKeyboardModality()
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget
  if (!(next instanceof Node) || !event.currentTarget || !(event.currentTarget as Node).contains(next))
    keyboardFocus.value = false
}

provide(chatComposerContextKey, {
  value,
  placeholder,
  isDisabled: disabled,
  isStopShown: stopShown,
  canSend,
  onChange: setValue,
  onSubmit: submit,
  onStop: stop,
  inputControl,
})

defineExpose({ element: root })
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    class="astryx-chat-composer"
    :data-disabled="disabled ? '' : undefined"
    :data-density="density"
  >
    <div
      v-if="status && statusPosition === 'top'"
      class="astryx-chat-composer__status"
      data-place="top"
      :data-type="status.type"
      :role="status.type === 'error' ? 'alert' : 'status'"
    >
      <Icon :icon="status.type === 'error' ? 'error' : 'warning'" size="md" :color="status.type === 'error' ? 'error' : 'warning'" />
      <span>{{ status.message }}</span>
    </div>

    <slot name="drawer" />

    <!-- 点空白处只是把焦点交给编辑器；键盘用户直接 Tab 到输入框。 -->
    <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -->
    <div
      ref="body"
      class="astryx-chat-composer__body"
      :data-density="density"
      :data-elevation="elevation"
      :data-keyboard-focus="keyboardFocus ? '' : undefined"
      @click="onBodyClick"
      @pointerdown="onPointerDown"
      @focusin="onFocusIn"
      @focusout="onFocusOut"
    >
      <div v-if="hasHeader" class="astryx-chat-composer__header">
        <div class="astryx-chat-composer__header-start">
          <slot name="headerActions" />
        </div>
        <div class="astryx-chat-composer__header-end">
          <slot name="headerContext" />
        </div>
      </div>

      <div class="astryx-chat-composer__input">
        <slot name="input">
          <ChatComposerInput />
        </slot>
      </div>

      <div class="astryx-chat-composer__footer">
        <div class="astryx-chat-composer__footer-start">
          <slot name="footerActions" />
        </div>
        <div
          class="astryx-chat-composer__footer-end"
          :data-interruptible="disabled && stopShown ? '' : undefined"
        >
          <slot name="sendActions" />
          <slot name="sendButton">
            <ChatSendButton />
          </slot>
        </div>
      </div>
    </div>

    <div
      v-if="status && statusPosition === 'bottom'"
      class="astryx-chat-composer__status"
      data-place="bottom"
      :data-type="status.type"
      :role="status.type === 'error' ? 'alert' : 'status'"
    >
      <Icon :icon="status.type === 'error' ? 'error' : 'warning'" size="md" :color="status.type === 'error' ? 'error' : 'warning'" />
      <span>{{ status.message }}</span>
    </div>
  </div>
</template>
