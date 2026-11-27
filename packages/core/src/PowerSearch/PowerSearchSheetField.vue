<script setup lang="ts">
/**
 * PowerSearch 底部弹层呈现里的字段：沿用行内字段的框和主题挂点，里面是只展示的筛选标签和一个触发器，
 * 触发器是字段里唯一的 Tab 停靠点（上游 PowerSearch 的 sheet trigger）。
 *
 * 点框里任何地方（末尾内容里的控件除外，纯展示的状态图标照样算）都打开弹层流程。触发器的名字是
 * 标签加上框里看得到的一切：占位文字，或者各个筛选标签。没有条件时占位文字太长会以省略号收尾。
 * 弹层流程从按下挂到退场播完、焦点回到触发器。
 */
import type { Component } from 'vue'
import type { PowerSearchMessages } from '../locale/messages/power-search.js'
import type { PowerSearchLookup } from './config.js'
import type { DraftReport } from './sheetDraftEdits.js'
import type { PowerSearchComponents, PowerSearchConfig, PowerSearchFilter, PowerSearchItem, PowerSearchSize, PowerSearchTokenProps } from './types.js'
import { ref, useTemplateRef, watch } from 'vue'
import PowerSearchBottomSheet from './PowerSearchBottomSheet.vue'
import PowerSearchFilterToken from './PowerSearchFilterToken.vue'
import '../../styles/power-search-sheet.css'

defineOptions({ name: 'AstryxPowerSearchSheetField', inheritAttrs: false })

const props = defineProps<{
  config: PowerSearchConfig
  lookup: PowerSearchLookup
  filters: readonly PowerSearchFilter[]
  inputId: string
  labelId: string
  describedBy?: string
  placeholder: string
  size: PowerSearchSize
  isDisabled: boolean
  /** 禁用但有禁用说明：触发器仍可聚焦，好让人读到说明。 */
  isFocusableWhenDisabled?: boolean
  isReadOnly: boolean
  hasClear: boolean
  controlClass: unknown
  controlStyle: unknown
  statusIcon?: Component | null
  statusIconProps?: Record<string, unknown>
  displayCount?: string | null
  messages: PowerSearchMessages
  locale: string
  timeZone?: string
  maxTokenLength: number
  maxOperatorMenuItems?: number
  saveLabel?: string
  components?: PowerSearchComponents
  search: (query: string) => PowerSearchItem[]
  tokenComponent: (filter: PowerSearchFilter) => Component | undefined
}>()

const emit = defineEmits<{
  commit: Parameters<DraftReport>
  motionComplete: [motion: 'entering' | 'exiting']
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

defineSlots<{
  icon?: () => unknown
  end?: () => unknown
  token?: (props: PowerSearchTokenProps) => unknown
}>()

const isOpen = defineModel<boolean>('isOpen', { required: true })

const boxRef = useTemplateRef<HTMLElement>('boxRef')
const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef')
const laneRef = useTemplateRef<HTMLElement>('laneRef')
const statusIconRef = useTemplateRef<HTMLElement>('statusIconRef')
const contentId = `${props.inputId}-content`

/** 弹层流程从按下挂到退场播完；平时字段只有触发器，没有关着的对话框和行。 */
const isSheetMounted = ref(false)

watch(isOpen, (open) => {
  if (open)
    isSheetMounted.value = true
}, { immediate: true })

// 字段被禁用时弹层不能开着，重新启用也不会自己再打开。
watch(() => props.isDisabled, (disabled) => {
  if (disabled && isOpen.value)
    isOpen.value = false
})

function open(): void {
  if (props.isDisabled)
    return
  triggerRef.value?.focus({ preventScroll: true })
  isOpen.value = true
}

function onMotionComplete(motion: 'entering' | 'exiting'): void {
  if (motion === 'exiting' && !isOpen.value)
    isSheetMounted.value = false
  emit('motionComplete', motion)
}

function onBoxClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof Element))
    return
  const box = boxRef.value
  const interactive = target.closest('button, a, input, select, textarea, [tabindex]')
  const isOnPlainStatusIcon = statusIconRef.value?.contains(target) === true && (interactive == null || !box?.contains(interactive))
  if (triggerRef.value?.contains(target) || (laneRef.value?.contains(target) && !isOnPlainStatusIcon))
    return
  open()
}

function isOutside(event: FocusEvent): boolean {
  const related = event.relatedTarget
  return !(related instanceof Node) || boxRef.value?.contains(related) !== true
}

function onFocusIn(event: FocusEvent): void {
  if (isOutside(event) && !isSheetMounted.value)
    emit('focus', event)
}

function onFocusOut(event: FocusEvent): void {
  if (isOutside(event) && !isOpen.value)
    emit('blur', event)
}

defineExpose({
  element: boxRef,
  focus: (options?: FocusOptions) => triggerRef.value?.focus(options),
  blur: () => triggerRef.value?.blur(),
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处和标签只是转给触发器；键盘直接操作触发器。 -->
  <div
    ref="boxRef"
    class="astryx-power-search-control astryx-power-search-sheet-field"
    :class="[controlClass, { 'is-disabled': isDisabled, 'has-tokens': filters.length > 0, 'is-open': isOpen }]"
    :style="controlStyle as never"
    :aria-disabled="isDisabled || undefined"
    @click="onBoxClick"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <div :id="contentId" class="astryx-power-search-sheet-field__content">
      <span v-if="$slots.icon" class="astryx-power-search-icon" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span v-for="(filter, index) in filters" :key="`${filter.field}-${filter.operator}-${index}`" class="astryx-power-search-token">
        <PowerSearchFilterToken
          :config="config"
          :lookup="lookup"
          :filter="filter"
          :max-length="maxTokenLength"
          :messages="messages"
          :locale="locale"
          :time-zone="timeZone"
          :size="size"
          :disabled="isDisabled"
          :custom="tokenComponent(filter)"
          display-only
        >
          <template v-if="$slots.token" #token="tokenProps">
            <slot name="token" v-bind="tokenProps" />
          </template>
        </PowerSearchFilterToken>
      </span>
      <button
        v-bind="$attrs"
        :id="inputId"
        ref="triggerRef"
        type="button"
        class="astryx-power-search-sheet-trigger"
        :class="{ 'has-tokens': filters.length > 0 }"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        :disabled="isDisabled && !isFocusableWhenDisabled"
        :aria-disabled="isDisabled || undefined"
        :aria-labelledby="`${labelId} ${contentId}`"
        :aria-describedby="describedBy"
        @click="open"
      >
        <span v-if="filters.length === 0" class="astryx-power-search-sheet-trigger__placeholder">{{ placeholder }}</span>
      </button>
    </div>
    <span v-if="displayCount || $slots.end || statusIcon" ref="laneRef" class="astryx-power-search-end astryx-power-search-sheet-field__end">
      <span v-if="displayCount" class="astryx-power-search-count">{{ displayCount }}</span>
      <slot name="end" />
      <span ref="statusIconRef" class="astryx-power-search-sheet-field__status">
        <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      </span>
    </span>
  </div>
  <PowerSearchBottomSheet
    v-if="isSheetMounted"
    :is-open="isOpen"
    :final-focus="triggerRef"
    :config="config"
    :lookup="lookup"
    :filters="filters"
    :search="search"
    :placeholder="placeholder"
    :is-read-only="isReadOnly"
    :is-disabled="isDisabled"
    :has-clear="hasClear"
    :max-operator-menu-items="maxOperatorMenuItems"
    :time-zone="timeZone"
    :save-label="saveLabel"
    :components="components"
    @close="isOpen = false"
    @commit="(filters, changeType, index) => emit('commit', filters, changeType, index)"
    @motion-complete="onMotionComplete"
  />
</template>
