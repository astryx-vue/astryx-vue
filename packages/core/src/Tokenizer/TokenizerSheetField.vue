<script setup lang="ts" generic="T extends SearchableItem">
/**
 * Tokenizer 底部弹层呈现里的字段：沿用行内字段的框、主题挂点和聚焦描边，里面是
 * 触发器、标签和末尾内容（上游 Tokenizer 的 sheet field）。
 *
 * 按钮里不能放控件，所以触发器、标签、末尾内容在框里是兄弟元素。有标签时触发器
 * 铺满整个框，点标签或空白处都打开弹层；自定义标签里的控件、末尾内容自己处理点击。
 * 默认标签只展示不能删，要删在弹层里取消勾选。
 *
 * 焦点从外面进入框时报 `focus`，离开整个字段时报 `blur`；进到自己的弹层、从弹层
 * 回到触发器都还算在字段里。弹层从按下那一刻挂上，直到退场播完、焦点回到触发器。
 */
import type { Component } from 'vue'
import type { SheetDraftChange } from '../composables/internal/sheetDraft.js'
import type { SearchableItem, SearchSource } from '../composables/useAsyncSource.js'
import type { TokenizerSize } from './types.js'
import { computed, ref, useId, useTemplateRef, watch } from 'vue'
import { useComponentMessages } from '../locale/context.js'
import { tokenizerMessages } from '../locale/messages/tokenizer.js'
import Token from '../Token/Token.vue'
import TokenizerBottomSheet from './TokenizerBottomSheet.vue'

defineOptions({ name: 'AstryxTokenizerSheetField', inheritAttrs: false })

const props = defineProps<{
  values: readonly T[]
  inputId: string
  label: string
  labelledBy?: string
  describedBy?: string
  placeholder: string
  size: TokenizerSize
  isDisabled: boolean
  name?: string
  controlClass: unknown
  controlStyle: unknown
  statusIcon?: Component | null
  statusIconProps?: Record<string, unknown>
  searchSource: SearchSource<T>
  maxEntries?: number
  hasCreate: boolean
  maxMenuItems: number
  minQueryLength: number
  debounceMs: number
  emptySearchText?: string | null
}>()

const emit = defineEmits<{
  commit: [items: T[], change: SheetDraftChange<T>]
  /** 自定义标签里的删除控件：立刻去掉这一条。 */
  remove: [item: T]
  changeQuery: [query: string]
  motionComplete: [motion: 'entering' | 'exiting']
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

defineSlots<{
  icon?: () => unknown
  end?: () => unknown
  token?: (props: { item: T, remove: () => void }) => unknown
  empty?: () => unknown
}>()

const isOpen = defineModel<boolean>('isOpen', { required: true })

const messages = useComponentMessages({ tokenizer: tokenizerMessages })
const boxRef = useTemplateRef<HTMLElement>('boxRef')
const triggerRef = useTemplateRef<HTMLButtonElement>('triggerRef')
const laneRef = useTemplateRef<HTMLElement>('laneRef')
const statusIconRef = useTemplateRef<HTMLElement>('statusIconRef')
const countId = `astryx-tokenizer-sheet-${useId()}-count`
const tokenId = (index: number): string => `${countId}-token-${index}`

/** 弹层从按下挂到退场播完；平时字段只有触发器，没有关着的对话框、行和确认框。 */
const isSheetMounted = ref(false)
/** 字段替弹层保管查询：用户关闭会清空它，字段被禁用而强制关上时留着。 */
const sheetQuery = ref('')
let hasReportedFocus = false

const describedBy = computed(() => [
  props.describedBy,
  props.values.length > 0 ? countId : null,
  ...props.values.map((_, index) => tokenId(index)),
].filter(Boolean).join(' ') || undefined)

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
  isOpen.value = true
}

function onMotionComplete(motion: 'entering' | 'exiting'): void {
  if (motion === 'exiting' && !isOpen.value)
    isSheetMounted.value = false
  emit('motionComplete', motion)
}

function onQueryChange(query: string): void {
  sheetQuery.value = query
  emit('changeQuery', query)
}

/** 点标签、占位文字、空白或纯展示的状态图标，和点触发器一样打开弹层。 */
function onBoxClick(event: MouseEvent): void {
  const trigger = triggerRef.value
  const target = event.target
  if (trigger == null || !(target instanceof Element))
    return
  const isInLane = laneRef.value?.contains(target) === true
  const isOnStatusIcon = statusIconRef.value?.contains(target) === true
  const interactive = target.closest('button, a, input, select, textarea, [tabindex]')
  if (trigger.contains(target) || (isInLane && !isOnStatusIcon) || (interactive != null && boxRef.value?.contains(interactive)))
    return
  trigger.click()
}

function onFocusIn(event: FocusEvent): void {
  const related = event.relatedTarget
  if (related instanceof Node && boxRef.value?.contains(related))
    return
  // 从自己的弹层回到触发器不算从外面进来。
  if (hasReportedFocus)
    return
  hasReportedFocus = true
  emit('focus', event)
}

function onFocusOut(event: FocusEvent): void {
  // 焦点进到自己的弹层、或换到框里另一个控件，仍在字段里。
  const related = event.relatedTarget
  if (isOpen.value || (related instanceof Node && boxRef.value?.contains(related)))
    return
  hasReportedFocus = false
  emit('blur', event)
}

defineExpose({
  element: boxRef,
  focus: (options?: FocusOptions) => triggerRef.value?.focus(options),
  blur: () => triggerRef.value?.blur(),
  /** 换呈现交来的焦点：之后的聚焦都算在字段里。 */
  adoptFocus: () => {
    hasReportedFocus = true
  },
})
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是转给触发器；键盘直接操作触发器。 -->
  <div
    ref="boxRef"
    class="astryx-tokenizer-control astryx-tokenizer-sheet-field"
    :class="[controlClass, { 'is-disabled': isDisabled, 'has-tokens': values.length > 0, 'is-open': isOpen }]"
    :style="controlStyle as never"
    @click="onBoxClick"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <span v-if="$slots.icon" class="astryx-tokenizer-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="astryx-tokenizer-tokens">
      <button
        v-bind="$attrs"
        :id="inputId"
        ref="triggerRef"
        type="button"
        class="astryx-tokenizer-sheet-trigger"
        :class="{ 'has-tokens': values.length > 0 }"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        :aria-disabled="isDisabled || undefined"
        :aria-labelledby="labelledBy"
        :aria-describedby="describedBy"
        @click="open"
      >
        <span v-if="values.length === 0" class="astryx-tokenizer-sheet-trigger__placeholder">{{ placeholder }}</span>
      </button>
      <span
        v-for="(item, index) in values"
        :id="$slots.token ? undefined : tokenId(index)"
        :key="item.id"
        class="astryx-tokenizer-token"
      >
        <slot name="token" :item="item" :remove="() => emit('remove', item)">
          <Token :label="item.label" :size="size" :disabled="isDisabled" />
        </slot>
      </span>
    </span>
    <span v-if="$slots.end || statusIcon" ref="laneRef" class="astryx-tokenizer-sheet-field__end">
      <slot name="end" />
      <span ref="statusIconRef" class="astryx-tokenizer-sheet-field__status">
        <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
      </span>
    </span>
    <input v-for="item in (isDisabled ? [] : values)" :key="`${name}-${item.id}`" type="hidden" :name="name" :value="item.id" :disabled="!name">
  </div>
  <span v-if="values.length > 0" :id="countId" class="astryx-visually-hidden">{{ messages.tokenizer.selectedCount(values.length) }}</span>
  <template v-if="$slots.token">
    <span v-for="(item, index) in values" :id="tokenId(index)" :key="item.id" hidden>{{ item.label }}</span>
  </template>
  <TokenizerBottomSheet
    v-if="isSheetMounted"
    :is-open="isOpen"
    :label="label"
    :final-focus="triggerRef"
    :initial-query="sheetQuery"
    :search-source="searchSource"
    :value="values"
    :max-entries="maxEntries"
    :has-create="hasCreate"
    :max-menu-items="maxMenuItems"
    :min-query-length="minQueryLength"
    :debounce-ms="debounceMs"
    :empty-search-text="emptySearchText"
    @close="isOpen = false"
    @commit="(items, change) => emit('commit', items, change)"
    @change-query="onQueryChange"
    @motion-complete="onMotionComplete"
  >
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
  </TokenizerBottomSheet>
</template>
