<script setup lang="ts">
import { HStack, IconButton, StackItem, TextInput } from '@astryx-vue/core'
import { computed, useTemplateRef } from 'vue'
import { useRichTextMessages } from './messages.js'

defineOptions({ name: 'AstryxRichTextLinkForm' })

const props = defineProps<{
  /** 输入框里正在填的网址。 */
  url: string
  /** 被拒绝的网址对应的提示，没有就是空。 */
  error: string
  /** 是在编辑已有的链接，「移除」才会出现。 */
  isEditing: boolean
  /** 调用方的控件尺寸，表单里的控件跟着它。 */
  size: 'sm' | 'md' | 'lg'
  /** 应用输入框里的网址；被拒绝时返回 false。 */
  onApply: () => boolean
}>()

const emit = defineEmits<{
  'update:url': [url: string]
  'remove': []
  'cancel': []
}>()

/** 这个按键属于输入法正在进行的拼字（Enter 是上屏，Escape 是取消拼字），不能当命令。 */
function isComposingKey(event: KeyboardEvent): boolean {
  return event.isComposing || event.keyCode === 229 || event.key === 'Process'
}

const t = useRichTextMessages()
const field = useTemplateRef<{ focus: () => void }>('field')

const applyLabel = computed(() => props.isEditing ? t('link.update') : t('link.add'))

function apply(): void {
  if (!props.onApply())
    field.value?.focus()
}

function onFieldKeydown(event: KeyboardEvent): void {
  // 应用之后焦点会回到编辑器，这次回车的后半截不能再在选中的文字上敲出一个换行。
  if (event.key === 'Enter' && !isComposingKey(event)) {
    event.preventDefault()
    apply()
  }
}

function onFormKeydown(event: KeyboardEvent): void {
  // 输入法拼字时的 Escape 归输入法。
  if (event.key !== 'Escape' || isComposingKey(event))
    return
  // 在这里认领，外层浮层的 Escape 处理就会让开；取消还会把选区还给编辑器。
  event.preventDefault()
  emit('cancel')
}
</script>

<template>
  <HStack :gap="1" align="start" @keydown="onFormKeydown">
    <StackItem size="fill">
      <TextInput
        ref="field"
        :model-value="url"
        :label="t('link.url')"
        is-label-hidden
        :size="size"
        width="100%"
        auto-complete="url"
        input-mode="url"
        :has-spell-check="false"
        :placeholder="t('link.urlPlaceholder')"
        :status="error ? { type: 'error', message: error } : undefined"
        status-variant="detached"
        @update:model-value="emit('update:url', $event)"
        @keydown="onFieldKeydown"
      />
    </StackItem>
    <IconButton :label="applyLabel" icon="check" variant="ghost" :size="size" :tooltip="applyLabel" @click="apply" />
    <IconButton v-if="isEditing" :label="t('link.remove')" variant="ghost" :size="size" :tooltip="t('link.remove')" @click="emit('remove')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 13l2-2a5 5 0 0 0-7-7l-2 2M6 11l-2 2a5 5 0 0 0 7 7l2-2M8 2v3M2 8h3M16 22v-3M22 16h-3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </IconButton>
    <IconButton :label="t('link.cancel')" icon="close" variant="ghost" :size="size" :tooltip="t('link.cancel')" @click="emit('cancel')" />
  </HStack>
</template>
