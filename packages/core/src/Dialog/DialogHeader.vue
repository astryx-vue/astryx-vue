<script setup lang="ts">
import type { DialogHeaderProps } from './types.js'
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, useAttrs, useId } from 'vue'
import IconButton from '../IconButton/IconButton.vue'
import { useLayoutArea } from '../Layout/context.js'
import { useComponentMessages } from '../locale/context.js'
import { dialogMessages } from '../locale/messages/dialog.js'
import { DIALOG_CONTEXT_KEY } from './context.js'
import '../../styles/dialog-header.css'

defineOptions({ name: 'AstryxDialogHeader', inheritAttrs: false })
const props = withDefaults(defineProps<DialogHeaderProps>(), {
  subtitle: undefined,
  hasCloseButton: undefined,
  closeButtonLabel: undefined,
  endContentEdgeCompensation: undefined,
  hasDivider: false,
})
const emit = defineEmits<{ openChange: [isOpen: boolean] }>()
const slots = defineSlots<{
  title?: () => unknown
  subtitle?: () => unknown
  startContent?: () => unknown
  endContent?: () => unknown
}>()
const attrs = useAttrs()
const messages = useComponentMessages({ dialog: dialogMessages })

// 放在 Layout 的 header 槽里时，自己当一个带内边距的页头区域（原版的 DialogHeader 就是 LayoutHeader）。
const layoutArea = useLayoutArea()
const inLayoutHeader = computed(() => layoutArea.value === 'header')

const dialog = inject(DIALOG_CONTEXT_KEY, null)
const fallbackTitleId = `astryx-dialog-header-title-${useId()}`
const titleId = computed(() => dialog?.titleId ?? fallbackTitleId)
const defaultFocusAttr = computed(() => (dialog?.isInline.value ? undefined : ''))
const showSubtitle = computed(() => slots.subtitle != null || (props.subtitle != null && props.subtitle !== ''))
// 原版：传了 onOpenChange 就渲染关闭按钮。显式传 hasCloseButton 时以传入值为准（DrawerHeader 用它关掉按钮）。
const hasOpenChangeListener = getCurrentInstance()?.vnode.props?.onOpenChange != null
const showClose = computed(() => props.hasCloseButton ?? hasOpenChangeListener)
const closeLabel = computed(() => props.closeButtonLabel ?? messages.value.dialog.close)

const compensateBlock = computed(() => {
  const axis = props.endContentEdgeCompensation
  if (axis == null)
    return showClose.value
  return axis === 'block' || axis === 'all'
})
const compensateInline = computed(() => {
  const axis = props.endContentEdgeCompensation
  if (axis == null)
    return showClose.value
  return axis === 'inline' || axis === 'all'
})

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
  <div v-bind="rootAttrs()" class="astryx-dialog-header" :class="{ 'astryx-dialog-header--divider': hasDivider }" :data-layout-header="inLayoutHeader || undefined">
    <div v-if="slots.startContent" class="astryx-dialog-header__actions astryx-dialog-header-start-content">
      <slot name="startContent" />
    </div>
    <div class="astryx-dialog-header__title-block astryx-dialog-header-title-block">
      <div
        :id="titleId"
        role="heading"
        aria-level="2"
        class="astryx-dialog-header__title"
        tabindex="-1"
        :data-dialog-default-focus="defaultFocusAttr"
      >
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <span v-if="showSubtitle" class="astryx-dialog-header__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </span>
    </div>
    <div
      v-if="slots.endContent || showClose"
      class="astryx-dialog-header__actions astryx-dialog-header-end-content"
      :class="{
        'astryx-dialog-header__actions--compensate-block': compensateBlock,
        'astryx-dialog-header__actions--compensate-inline': compensateInline,
      }"
    >
      <slot name="endContent" />
      <IconButton
        v-if="showClose"
        class="astryx-dialog-header__close"
        variant="ghost"
        :label="closeLabel"
        @click="emit('openChange', false)"
      >
        <svg
          class="astryx-dialog-header__close-icon astryx-dialog-header-close-icon"
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
