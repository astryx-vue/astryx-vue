<script setup lang="ts">
import type { CommentComposerEmits, CommentComposerProps, CommentComposerSlots } from './types.js'
import { useTranslator } from '@astryx-vue/core'
import { computed, getCurrentInstance, useTemplateRef } from 'vue'
import CommentComposerBase from './CommentComposerBase.vue'

defineOptions({ name: 'AstryxCommentComposer', inheritAttrs: false })

const props = withDefaults(defineProps<CommentComposerProps>(), {
  isSubmitting: false,
  highlightColor: 'yellow',
  hasEmojiPicker: true,
})
const emit = defineEmits<CommentComposerEmits>()
defineSlots<CommentComposerSlots>()
const { t } = useTranslator()
const root = useTemplateRef<{ element?: { value?: HTMLElement | null } }>('base')
const instance = getCurrentInstance()

function hasListener(camelName: string): boolean {
  const vnodeProps = instance?.vnode.props
  if (vnodeProps == null)
    return false
  const key = `on${camelName.charAt(0).toUpperCase()}${camelName.slice(1)}`
  return vnodeProps[key] != null
}

const draft = computed(() => props.modelValue ?? props.value ?? '')
const placeholder = computed(() => props.placeholder ?? t('@astryx.commentComposer.placeholder'))
const context = computed(() =>
  props.anchor != null ? { kind: 'comment' as const, anchor: props.anchor } : { kind: 'comment' as const },
)

function onChange(value: string): void {
  emit('update:modelValue', value)
  emit('change', value)
}

defineExpose({ element: computed(() => root.value?.element ?? root.value) })
</script>

<template>
  <CommentComposerBase
    ref="base"
    :value="draft"
    :placeholder="placeholder"
    :label="label"
    :is-submitting="isSubmitting"
    :error="error"
    :context="context"
    :anchor="anchor"
    :highlight-color="highlightColor"
    :on-upload-images="onUploadImages"
    :triggers="triggers"
    :agent-commands="agentCommands"
    :has-emoji-picker="hasEmojiPicker"
    :has-retry="hasListener('retry')"
    :has-anchor-dismiss="hasListener('anchorDismiss')"
    v-bind="$attrs"
    @change="onChange"
    @submit="emit('submit', $event)"
    @retry="emit('retry')"
    @anchor-dismiss="emit('anchorDismiss')"
  >
    <template v-if="$slots.controls" #controls>
      <slot name="controls" />
    </template>
    <template v-if="$slots.composer" #composer="slotProps">
      <slot name="composer" v-bind="slotProps" />
    </template>
  </CommentComposerBase>
</template>
