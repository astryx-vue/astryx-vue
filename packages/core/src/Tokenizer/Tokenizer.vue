<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { TypeaheadMenuEntry } from '../Typeahead/useTypeaheadMenu.js'
import type { TokenizerEmits, TokenizerProps, TokenizerSlots } from './types.js'
import type { TokenizerSheetFieldHandle } from './useTokenizerPresentation.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useSlots, useTemplateRef, watch } from 'vue'
import ButtonTooltip from '../Button/ButtonTooltip.vue'
import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'
import { useTokenRemoveTap } from '../composables/internal/useTokenRemoveTap.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import { useInputGroupContext, useInputGroupDisabled } from '../InputGroup/context.js'
import { useComponentMessages } from '../locale/context.js'
import { tokenizerMessages } from '../locale/messages/tokenizer.js'
import { useSize } from '../SizeContext/SizeContext.js'
import Token from '../Token/Token.vue'
import TypeaheadPopup from '../Typeahead/TypeaheadPopup.vue'
import { pickInputAttrs } from './inputAttrs.js'
import TokenizerSheetField from './TokenizerSheetField.vue'
import TokenizerTrack from './TokenizerTrack.vue'
import { useTokenizerDisabled } from './useTokenizerDisabled.js'
import { useTokenizerFieldAria } from './useTokenizerFieldAria.js'
import { useTokenizerFocus } from './useTokenizerFocus.js'
import { useTokenizerKeys } from './useTokenizerKeys.js'
import { useTokenizerMenu } from './useTokenizerMenu.js'
import { useTokenizerPresentation } from './useTokenizerPresentation.js'
import { useTokenizerSelection } from './useTokenizerSelection.js'
import '../../styles/typeahead.css'
import '../../styles/tokenizer.css'
import '../../styles/visually-hidden-utility.css'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxTokenizer', inheritAttrs: false })

const props = withDefaults(defineProps<TokenizerProps<T>>(), {
  modelValue: () => [],
  labelHidden: false,
  disabled: false,
  status: 'default',
  statusVariant: 'attached',
  clearable: false,
  hasClear: false,
  debounceMs: 150,
  maxMenuItems: 10,
  minQueryLength: 1,
  showOnFocus: false,
  hasAutoFocus: false,
  creatable: false,
  hasCreate: false,
  overflow: 'none',
  required: false,
  optional: false,
  presentation: 'adaptive',
})

const emit = defineEmits<TokenizerEmits<T>>()

defineSlots<TokenizerSlots<T>>()

if (isDevBuild() && props.modelValue != null && !Array.isArray(props.modelValue)) {
  throw devPropError(
    'Tokenizer',
    'modelValue',
    'must be an array of the selected items, for example v-model="selected" with const selected = ref([]).',
  )
}

// 在 InputGroup 里整行由组定高，尺寸、禁用都跟组走：组里的 size 不再被自己的 size 盖过。
// 其余情况：显式 size > 外层 SizeContext（Toolbar 等）> 'md'。
const inputGroup = useInputGroupContext()
const inGroup = inputGroup != null
const size = useSize(() => inGroup ? undefined : props.size, 'md')
const isDisabled = useInputGroupDisabled(() => props.disabled)

const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'Tokenizer',
  props,
  attrs,
  reservedAttrs: ['id', 'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-activedescendant', 'aria-autocomplete', 'aria-disabled', 'aria-required'],
})
const messages = useComponentMessages({ tokenizer: tokenizerMessages })
/** 正名 isLabelHidden，旧名 labelHidden 任一为真就藏起标签。 */
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden)
const inputId = `astryx-tokenizer-${useId()}`
const listboxId = `${inputId}-listbox`
const fieldLabelId = `${inputId}-label`
const disabledId = `${inputId}-disabled`
const disabledTooltipId = `${inputId}-disabled-tooltip`
const values = computed(() => props.modelValue ?? [])
const focused = ref(false)
const placeholderHeight = ref(0)
const announce = useAnnounce()
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const popupRef = useTemplateRef<{ el: HTMLElement | null }>('popupRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const tokenEls = new Map<number, HTMLElement>()
const sheetFieldRef = useTemplateRef<TokenizerSheetFieldHandle>('sheetFieldRef')
const slots = useSlots()
const { sheetOpen, isSheet, onSheetMotionComplete, isHandingOffFocus } = useTokenizerPresentation<T>({
  props,
  hasItemSlot: () => slots.item != null,
  root: () => anchorRef.value ?? sheetFieldRef.value?.element,
  focusControl: () => {
    sheetFieldRef.value?.adoptFocus()
    focusControl()
  },
})

const placeholder = computed(() => props.placeholder ?? messages.value.tokenizer.placeholder)
const emptyText = computed(() => props.emptySearchText ?? props.emptyText ?? messages.value.tokenizer.empty)
const { disabledMessage, showsDisabledMessage, focusableDisabled, disabledTooltip } = useTokenizerDisabled(props, isDisabled)
/** 两个名字任一为真就画清除按钮。 */
const showsClear = computed(() => props.hasClear || props.clearable)
/** 两个名字任一为真就在聚焦时先展开。 */
const showsEntriesOnFocus = computed(() => props.hasEntriesOnFocus || props.showOnFocus)
/** 两个名字任一为真就能从输入的文字新建标签。 */
const isCreatable = computed(() => props.hasCreate || props.creatable)
/** 禁用的字段不向表单交值：不渲染隐藏输入，而不是渲染一个原生禁用的。 */
const hiddenCarrierItems = computed(() => isDisabled.value ? [] : values.value)
const atMax = computed(() => props.maxEntries != null && values.value.length >= props.maxEntries)
const collapsed = computed(() => props.overflow !== 'none' && !focused.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value)
const { fieldStatus, labelledBy, statusIcon, statusIconProps, describedBy } = useTokenizerFieldAria({
  props,
  attrs,
  inputId,
  fieldLabelId,
  disabledId,
  hasDisabledDescription: computed(() => focusableDisabled.value && Boolean(disabledMessage.value)),
  group: inputGroup,
})

function inputAttrs(): Record<string, unknown> {
  return pickInputAttrs(attrs)
}

const { menu, menuConfig, anchored, optionGrid, listboxRef, highlight, selectById } = useTokenizerMenu<T>({
  props,
  isDisabled: () => isDisabled.value,
  values,
  atMax,
  showsEntriesOnFocus,
  isCreatable,
  emptyText,
  messages: () => messages.value.tokenizer,
  listboxId,
  anchorRef,
  inputRef,
  popupEl: () => popupRef.value?.el ?? null,
  onSelect: addEntry,
  onQueryChange: (query) => {
    emit('search', query)
    emit('changeQuery', query)
  },
  onOpenChange: isOpen => emit('openChange', isOpen),
})

onMounted(() => {
  if (props.hasAutoFocus)
    inputRef.value?.focus()
})

const removeTap = useTokenRemoveTap({ root: anchorRef, input: inputRef, tokenSelector: '.astryx-tokenizer-token' })
const tokenCount = computed(() => values.value.length)
const overflow = useOverflow(tokenCount, { gap: 4 })
const visibleCount = computed(() => collapsed.value ? overflow.visibleCount.value : tokenCount.value)
const hiddenCount = computed(() => Math.max(0, tokenCount.value - visibleCount.value))
const measureMoreLabel = computed(() => messages.value.tokenizer.more(Math.max(hiddenCount.value, 1)))
const visibleItems = computed(() => values.value.slice(0, visibleCount.value))

watch(collapsed, () => void nextTick(() => overflow.remeasure()))

const selection = useTokenizerSelection<T>({
  values,
  isDisabled: () => isDisabled.value,
  atMax,
  showsEntriesOnFocus,
  menu,
  menuConfig,
  inputRef,
  messages: () => messages.value.tokenizer,
  announce,
  emitChange: (next, change) => {
    emit('update:modelValue', next)
    emit('change', next, change)
  },
})

function remove(item: T): void {
  if (!selection.remove(item))
    return
  if (isSheet.value)
    void nextTick(() => sheetFieldRef.value?.focus())
  else if (removeTap.shouldFocusInputAfterRemove())
    void nextTick(() => inputRef.value?.focus())
}

function setTokenEl(index: number, element: unknown): void {
  if (element instanceof HTMLElement)
    tokenEls.set(index, element)
  else
    tokenEls.delete(index)
}

function focusToken(index: number): void {
  void nextTick(() => tokenEls.get(index)?.focus())
}

function onInput(event: Event): void {
  if (isDisabled.value || atMax.value)
    return
  menu.setQuery((event.target as HTMLInputElement).value)
}

const { onFocusIn, onFocusOut } = useTokenizerFocus<T>({
  anchor: anchorRef,
  listbox: () => listboxRef.value,
  input: inputRef,
  focused,
  placeholderHeight,
  menu,
  isDisabled: () => isDisabled.value,
  atMax: () => atMax.value,
  showsEntriesOnFocus: () => showsEntriesOnFocus.value,
  isFloatingLayer: () => props.overflow === 'unfocused-layer',
  disabledTooltip,
  isHandingOffFocus,
  onFocus: event => emit('focus', event),
  onBlur: event => emit('blur', event),
})

const { onInputKeyDown: onListKeyDown, onTokenKeyDown } = useTokenizerKeys<T>({
  values,
  disabled: () => isDisabled.value,
  menu,
  optionGrid,
  inputRef,
  remove,
  focusToken,
})

function onInputKeyDown(event: KeyboardEvent): void {
  if (!menuConfig.closeOnEscape(event))
    onListKeyDown(event)
}

function onFieldClick(event: MouseEvent): void {
  if (isDisabled.value)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button, a'))
    return
  inputRef.value?.focus()
}

function addEntry(entry: TypeaheadMenuEntry<T>): void {
  selection.add(entry.item, entry.create ? 'create' : 'add')
}

/** 焦点交给当前呈现的控件：行内输入框，或底部弹层呈现的触发器。 */
function focusControl(): void {
  if (isSheet.value)
    sheetFieldRef.value?.focus()
  else
    inputRef.value?.focus()
}

defineExpose({
  focus: focusControl,
  blur: () => isSheet.value ? sheetFieldRef.value?.blur() : inputRef.value?.blur(),
  open: () => {
    if (!isSheet.value)
      menuConfig.open()
    else if (!isDisabled.value)
      sheetOpen.value = true
  },
  close: () => {
    if (isSheet.value)
      sheetOpen.value = false
    else
      menuConfig.close()
  },
})
</script>

<template>
  <Field
    class="astryx-tokenizer"
    :class="[parts.containerClass.value, `size-${size}`, { 'is-floating': floating, 'in-group': inGroup }]"
    :style="parts.containerStyle.value"
    :label="props.label"
    :input-id="inputId"
    :description="inGroup ? undefined : props.description"
    :label-tooltip="props.labelTooltip"
    :is-label-hidden="inGroup || hideLabel"
    :is-disabled="isDisabled"
    :is-required="inGroup ? false : props.required"
    :is-optional="inGroup ? false : props.optional"
    :status="fieldStatus"
    :status-variant="props.statusVariant"
    :width="props.width"
  >
    <TokenizerSheetField
      v-if="isSheet"
      ref="sheetFieldRef"
      v-model:is-open="sheetOpen"
      v-bind="inputAttrs()"
      :values="values"
      :input-id="inputId"
      :label="props.label"
      :labelled-by="labelledBy"
      :described-by="describedBy"
      :placeholder="placeholder"
      :size="size"
      :is-disabled="isDisabled"
      :name="props.name"
      :control-class="[parts.controlClass(), inGroup ? undefined : `status-${props.status}`]"
      :control-style="parts.controlStyle()"
      :status-icon="statusIcon"
      :status-icon-props="statusIconProps"
      :search-source="props.searchSource"
      :max-entries="props.maxEntries"
      :has-create="isCreatable"
      :max-menu-items="props.maxMenuItems"
      :min-query-length="props.minQueryLength"
      :debounce-ms="props.debounceMs"
      :empty-search-text="props.emptySearchText ?? props.emptyText"
      @commit="selection.commit"
      @remove="remove"
      @change-query="query => { emit('search', query); emit('changeQuery', query) }"
      @motion-complete="onSheetMotionComplete"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
      <template v-if="$slots.end" #end>
        <slot name="end" />
      </template>
      <template v-if="$slots.token" #token="tokenProps">
        <slot name="token" v-bind="tokenProps" />
      </template>
      <template v-if="$slots.empty" #empty>
        <slot name="empty" />
      </template>
    </TokenizerSheetField>
    <template v-else>
      <div v-if="floating" class="astryx-tokenizer-placeholder" :style="{ height: `${placeholderHeight}px` }" />
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处只是把焦点交给输入框；方向键和删除由输入框与标签处理。 -->
      <div
        ref="anchorRef"
        class="astryx-tokenizer-control"
        :class="[parts.controlClass(), inGroup ? undefined : `status-${props.status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': isDisabled, 'is-floating': floating, 'has-tokens': values.length > 0 }]"
        :style="parts.controlStyle()"
        @click="onFieldClick"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
        @pointerenter="disabledTooltip.onPointerEnter"
        @pointerleave="disabledTooltip.onPointerLeave"
      >
        <span v-if="$slots.icon" class="astryx-tokenizer-icon" aria-hidden="true">
          <slot name="icon" />
        </span>
        <!-- InputGroup 里标签和输入留在一行里横向滚动；结尾的控件在轨道外面，不会被标签盖住。 -->
        <TokenizerTrack :is-scrollable="inGroup">
          <span
            :ref="overflow.containerRef"
            class="astryx-tokenizer-tokens"
            :class="{ 'is-collapsed': collapsed }"
          >
            <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键在标签容器上移动焦点，删除由内部按钮处理。 -->
            <span
              v-for="(item, index) in visibleItems"
              :key="item.id"
              :ref="element => setTokenEl(index, element)"
              class="astryx-tokenizer-token"
              tabindex="-1"
              @keydown="onTokenKeyDown($event, item, index)"
            >
              <slot name="token" :item="item" :remove="() => remove(item)">
                <Token :label="item.label" :size="size" :disabled="isDisabled" removable @remove="remove(item)" />
              </slot>
            </span>
            <span v-if="collapsed && hiddenCount > 0" class="astryx-tokenizer-more">
              {{ messages.tokenizer.more(hiddenCount) }}
            </span>
          </span>
          <span :ref="overflow.measureRef" class="astryx-tokenizer-measure" aria-hidden="true">
            <span v-for="item in values" :key="item.id" class="astryx-tokenizer-token">
              <Token :label="item.label" :size="size" removable />
            </span>
            <span class="astryx-tokenizer-more" data-overflow-indicator>{{ measureMoreLabel }}</span>
          </span>
          <input
            v-bind="inputAttrs()"
            :id="inputId"
            ref="inputRef"
            class="astryx-tokenizer-input"
            :class="{ 'is-empty': menu.query.value === '' }"
            type="text"
            role="combobox"
            autocomplete="off"
            autocapitalize="off"
            autocorrect="off"
            enterkeyhint="search"
            :data-autofocus="props.hasAutoFocus || undefined"
            :placeholder="values.length === 0 ? placeholder : undefined"
            :value="menu.query.value"
            :disabled="isDisabled && !focusableDisabled"
            :readonly="focusableDisabled || atMax || undefined"
            :aria-disabled="focusableDisabled ? 'true' : undefined"
            :aria-expanded="menuConfig.popupOpen.value"
            :aria-haspopup="menuConfig.isDialog.value ? 'dialog' : optionGrid.popupKind.value"
            :aria-controls="listboxId"
            aria-autocomplete="list"
            :aria-activedescendant="menuConfig.isDialog.value ? undefined : optionGrid.gridMode.value ? optionGrid.actionGrid.activeDescendant.value : (menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined)"
            :aria-labelledby="labelledBy"
            :aria-describedby="describedBy"
            :aria-required="props.required || undefined"
            :aria-invalid="props.status === 'error' ? true : undefined"
            @input="onInput"
            @keydown="onInputKeyDown"
          >
        </TokenizerTrack>
        <slot name="end" />
        <button
          v-if="showsClear && values.length > 0 && !isDisabled"
          type="button"
          class="astryx-tokenizer-clear"
          :aria-label="messages.tokenizer.clear"
          @click="selection.clearAll"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
        <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
        <span v-if="focusableDisabled && disabledMessage" :id="disabledId" class="astryx-visually-hidden">{{ disabledMessage }}</span>
        <input v-for="item in hiddenCarrierItems" :key="`${props.name}-${item.id}`" type="hidden" :name="props.name" :value="item.id" :disabled="!props.name">
      </div>
    </template>
  </Field>
  <ButtonTooltip
    v-if="showsDisabledMessage"
    :id="disabledTooltipId"
    :anchor="isSheet ? (sheetFieldRef?.element ?? null) : anchorRef"
    :open="disabledTooltip.isOpen.value"
    :text="disabledMessage ?? ''"
    @pointer-enter="disabledTooltip.onTooltipPointerEnter"
    @pointer-leave="disabledTooltip.onTooltipPointerLeave"
  />
  <TypeaheadPopup
    v-if="!isSheet"
    :id="listboxId"
    ref="popupRef"
    :is-open="menuConfig.popupOpen.value"
    :config="props.menu"
    :label="messages.tokenizer.results"
    :grid="optionGrid.gridMode.value"
    :placement="anchored.position.value.placement"
    :popup-style="anchored.style.value"
    :entries="menu.entries.value.map(entry => ({ id: entry.id, label: entry.label, description: entry.description, disabled: entry.disabled, group: entry.group, action: entry.action, selected: values.some(item => item.id === entry.item.id) }))"
    :active-index="menu.combobox.activeIndex.value"
    :action-index="optionGrid.actionGrid.column.value === 'action' ? menu.combobox.activeIndex.value : -1"
    :status="menu.menuStatus.value"
    :empty-text="emptyText"
    :loading-text="messages.tokenizer.loading"
    :error-text="messages.tokenizer.error"
    :query="menu.query.value"
    :is-settled="menu.isSettled.value"
    @select="selectById"
    @highlight="highlight"
    @close="menuConfig.close"
    @keydown="menuConfig.closeOnEscape"
  >
    <template v-if="$slots.item" #item="slotProps">
      <slot
        name="item"
        :item="menu.entries.value.find(entry => entry.id === slotProps.entry.id)!.item"
        :is-active="slotProps.isActive"
        :is-selected="slotProps.isSelected"
      />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
    <template v-if="$slots.menu" #menu="menuProps">
      <slot name="menu" v-bind="menuProps" />
    </template>
  </TypeaheadPopup>
</template>
