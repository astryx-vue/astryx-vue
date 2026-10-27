<script setup lang="ts" generic="T extends string">
import type { FieldStatusInput, PopoverPlacement } from '@astryx-vue/core'
import type { Ref } from 'vue'
import type { TransferListOption } from './types.js'
import { Button, ComplexSelector, useTranslator } from '@astryx-vue/core'
import { computed, ref, watch } from 'vue'
import TransferList from './TransferList.vue'
import '../../styles/transfer-list-selector.css'

defineOptions({ name: 'AstryxTransferListSelector' })

const props = withDefaults(defineProps<{
  label: string
  modelValue?: readonly T[]
  options: readonly TransferListOption<T>[]
  description?: string
  isLabelHidden?: boolean
  isOptional?: boolean
  isRequired?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  labelTooltip?: string
  status?: FieldStatusInput
  statusVariant?: 'attached' | 'detached' | 'tooltip'
  size?: 'sm' | 'md' | 'lg'
  width?: number | string
  placement?: PopoverPlacement
  triggerLabel?: string
  selectedLabel?: string
  availableLabel?: string
  hasSearch?: boolean
  searchLabel?: string
  searchPlaceholder?: string
  isReorderable?: boolean
  hasSelectAll?: boolean
  hasClear?: boolean
  selectedEmptyText?: string
  availableEmptyText?: string
  noResultsText?: string
  /** `immediate` 每次改动立刻生效，`staged` 等用户按 Apply。 */
  commitBehavior?: 'immediate' | 'staged'
  applyLabel?: string
  cancelLabel?: string
}>(), {
  modelValue: () => [],
  isReorderable: undefined,
  commitBehavior: 'immediate',
})

const emit = defineEmits<{
  'update:modelValue': [value: readonly T[]]
  'change': [value: readonly T[]]
  'changeAction': [value: readonly T[]]
  'openChange': [isOpen: boolean]
}>()

/** 弹层和字段的默认宽度：留出 32px 的视口空隙，再宽不超过 41rem。 */
const DEFAULT_SELECTOR_WIDTH = 'min(41rem, calc(100vw - 32px))'

const { t } = useTranslator()

const applyLabel = computed(() => props.applyLabel ?? t('@astryx.transferListSelector.apply'))
const cancelLabel = computed(() => props.cancelLabel ?? t('@astryx.transferListSelector.cancel'))
const triggerLabel = computed(() => props.triggerLabel ?? t('@astryx.transferListSelector.triggerLabel', { count: props.modelValue.length }))

const resolvedWidth = computed(() => typeof props.width === 'number' ? `${props.width}px` : (props.width ?? DEFAULT_SELECTOR_WIDTH))
/** 弹层内容和字段同宽、去掉内边距，两栏贴到弹层边上；高度留出视口空隙，自己不滚。 */
const contentStyle = computed(() => ({
  width: resolvedWidth.value,
  maxWidth: resolvedWidth.value,
  maxHeight: 'calc(100vh - 32px)',
  padding: '0',
  overflow: 'hidden',
  borderRadius: 'inherit',
}))

/** 分段提交时先放在这里，按 Apply 才真正提交。 */
const draftValue = ref<readonly T[]>([...props.modelValue]) as Ref<readonly T[]>
const draftSource = { value: [...props.modelValue] as readonly T[], commitBehavior: props.commitBehavior }
const isOpen = ref(false)

function areOrderedValuesEqual(first: readonly T[], second: readonly T[]): boolean {
  return first.length === second.length && first.every((item, index) => item === second[index])
}

function resetDraft(): void {
  draftValue.value = [...props.modelValue]
}

// 外面换了已选值、或换了提交方式，暂存草稿都要丢掉。同步执行，避免先画出旧草稿再闪一下。
watch(
  () => [props.modelValue, props.commitBehavior] as const,
  () => {
    if (!areOrderedValuesEqual(draftSource.value, props.modelValue) || draftSource.commitBehavior !== props.commitBehavior) {
      draftSource.value = [...props.modelValue]
      draftSource.commitBehavior = props.commitBehavior
      resetDraft()
    }
  },
  { flush: 'sync', deep: false },
)

function onOpenChange(next: boolean): void {
  // 关掉之后草稿作废，下次打开回到外面的值。
  if (isOpen.value && !next)
    resetDraft()
  isOpen.value = next
  emit('openChange', next)
}

function handleTransferChange(nextValue: readonly T[], commit: (value: readonly T[]) => void, isBusy: boolean): void {
  // 提交中不接收新的搬运：一次待处理的动作不该叠第二次。
  if (isBusy)
    return
  if (props.commitBehavior === 'staged') {
    draftValue.value = [...nextValue]
    return
  }
  commit([...nextValue])
}

function applyStaged(commit: (value: readonly T[]) => void, close: () => void): void {
  if (!areOrderedValuesEqual(draftValue.value, props.modelValue))
    commit([...draftValue.value])
  close()
}

function cancelStaged(close: () => void): void {
  resetDraft()
  close()
}
</script>

<template>
  <ComplexSelector
    :label="label" :model-value="modelValue" :trigger-label="triggerLabel"
    :description="description" :is-label-hidden="isLabelHidden" :is-optional="isOptional"
    :is-required="isRequired" :is-disabled="isDisabled" :is-loading="isLoading"
    :label-tooltip="labelTooltip" :status="status" :status-variant="statusVariant"
    :size="size" :width="resolvedWidth" :placement="placement"
    :popup-width="resolvedWidth" :content-style="contentStyle"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @change-action="emit('changeAction', $event)"
    @open-change="onOpenChange"
  >
    <template #default="{ value: appliedValue, commit, close, state }">
      <div :aria-busy="state.isBusy || undefined" :data-busy="state.isBusy || undefined" class="astryx-transfer-list-selector__surface">
        <fieldset class="astryx-transfer-list-selector__fieldset" :disabled="isDisabled">
          <TransferList
            :label="label" is-label-hidden :options="options"
            :model-value="commitBehavior === 'staged' ? draftValue : appliedValue"
            :selected-label="selectedLabel" :available-label="availableLabel" :has-search="hasSearch"
            :search-label="searchLabel" :search-placeholder="searchPlaceholder"
            :is-reorderable="isReorderable" :has-select-all="hasSelectAll" :has-clear="hasClear"
            :selected-empty-text="selectedEmptyText" :available-empty-text="availableEmptyText"
            :no-results-text="noResultsText"
            @change="handleTransferChange($event, commit, state.isBusy)"
          >
            <template v-if="$slots.option" #option="scope">
              <slot name="option" :option="scope.option" />
            </template>
          </TransferList>
        </fieldset>

        <div v-if="commitBehavior === 'staged'" class="astryx-transfer-list-selector__footer">
          <Button
            :label="cancelLabel" variant="ghost" size="sm"
            @click="cancelStaged(close)"
          />
          <Button
            :label="applyLabel" variant="primary" size="sm"
            :is-disabled="isDisabled || state.isBusy" :is-loading="state.isBusy"
            @click="applyStaged(commit, close)"
          />
        </div>
      </div>
    </template>
  </ComplexSelector>
</template>
