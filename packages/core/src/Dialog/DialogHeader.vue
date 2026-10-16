<script setup lang="ts">
import type { DialogHeaderProps } from './types.js'
import { computed, inject, onBeforeUnmount, onMounted, useAttrs, useId } from 'vue'
import IconButton from '../IconButton/IconButton.vue'
import { DIALOG_CONTEXT_KEY } from './context.js'
import '../../styles/dialog-header.css'

defineOptions({ name: 'AstryxDialogHeader', inheritAttrs: false })
const props = withDefaults(defineProps<DialogHeaderProps>(), {
  subtitle: undefined,
  hasDivider: false,
  hasCloseButton: false,
  closeButtonLabel: 'Close',
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const slots = defineSlots<{
  startContent?: () => unknown
  endContent?: () => unknown
}>()
const attrs = useAttrs()

const dialog = inject(DIALOG_CONTEXT_KEY, null)
const fallbackTitleId = `astryx-dialog-header-title-${useId()}`
const titleId = computed(() => dialog?.titleId ?? fallbackTitleId)
const defaultFocusAttr = computed(() => (dialog?.isInline.value ? undefined : ''))
const hasSubtitle = computed(() => props.subtitle != null && props.subtitle !== '')

onMounted(() => {
  dialog?.registerTitle(true)
})

onBeforeUnmount(() => {
  dialog?.registerTitle(false)
})

function rootAttrs(): Record<string, unknown> {
  return attrs
}
</script>

<template>
  <div v-bind="rootAttrs()" class="astryx-dialog-header" :data-divider="hasDivider || undefined">
    <div v-if="slots.startContent" class="astryx-dialog-header__actions">
      <slot name="startContent" />
    </div>
    <div class="astryx-dialog-header__title-block">
      <div
        :id="titleId"
        role="heading"
        aria-level="2"
        class="astryx-dialog-header__title"
        tabindex="-1"
        :data-dialog-default-focus="defaultFocusAttr"
      >
        {{ title }}
      </div>
      <span v-if="hasSubtitle" class="astryx-dialog-header__subtitle">{{ subtitle }}</span>
    </div>
    <div
      v-if="slots.endContent || hasCloseButton"
      class="astryx-dialog-header__actions"
      :class="{ 'astryx-dialog-header__actions--compensated': hasCloseButton }"
    >
      <slot name="endContent" />
      <IconButton
        v-if="hasCloseButton"
        class="astryx-dialog-header__close"
        variant="ghost"
        :label="closeButtonLabel"
        @click="emit('openChange', false)"
      >
        <svg
          class="astryx-dialog-header__close-icon"
          viewBox="0 0 20 20"
          width="20"
          height="20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </IconButton>
    </div>
  </div>
</template>
