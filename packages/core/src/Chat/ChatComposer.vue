<script setup lang="ts">
import type { ChatComposerEmits, ChatComposerInputControl, ChatComposerProps, ChatComposerSlots } from './types.js'
import { computed, provide, ref, useSlots, useTemplateRef } from 'vue'
import { useAnnounceRenderedText } from '../composables/internal/announceRenderedText.js'
import { isKeyboardModality, trackInteractionModality } from '../composables/internal/interactionModality.js'
import Icon from '../Icon/Icon.vue'
import { isInLayerSurface } from '../layer/layerSurfacePress.js'
import { useComponentMessages } from '../locale/context.js'
import { chatMessages } from '../locale/messages/chat.js'
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
const messages = useComponentMessages({ chat: chatMessages })
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

const statusRef = useTemplateRef<HTMLDivElement>('status')

// 状态条挂载时就带着文字，和文字一起出生的 live region 不一定能读到，
// 所以由共用的「渲染文字播报」念条里渲染出来的内容：错误 assertive，警告 polite，
// 每次出现念一次；页面加载完成之前就已显示的状态保持安静。换类型算新的一次，清除后重新待命。
useAnnounceRenderedText(statusRef, () => Boolean(props.status?.message), {
  skipFirstRender: true,
  key: () => props.status?.type ?? '',
  politeness: () => props.status?.type === 'error' ? 'assertive' : 'polite',
})

const editorSelector = 'textarea, [contenteditable="true"], [role="textbox"], [role="combobox"][contenteditable], input:not([type]), input[type="text"], input[type="search"], input[type="email"], input[type="url"], input[type="tel"], input[type="password"]'

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
  // 打开着的 Tooltip、HoverCard 里的点击属于气泡自己，不算正文的空白处。
  if (body.value != null && isInLayerSurface(target, body.value))
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
      ref="status"
      class="astryx-chat-composer__status"
      data-place="top"
      :data-type="status.type"
    >
      <Icon :icon="status.type === 'error' ? 'error' : 'warning'" size="md" color="inherit" />
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
      ref="status"
      class="astryx-chat-composer__status"
      data-place="bottom"
      :data-type="status.type"
    >
      <Icon :icon="status.type === 'error' ? 'error' : 'warning'" size="md" color="inherit" />
      <span>{{ status.message }}</span>
    </div>
  </div>
</template>
