<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type { EditorPlacement } from './placement.js'
import type {
  PartialFilter,
  PowerSearchChangeType,
  PowerSearchEmits,
  PowerSearchFilter,
  PowerSearchItem,
  PowerSearchProps,
  PowerSearchSlots,
} from './types.js'
import { computed, nextTick, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import Field from '../Field/Field.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/context.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { createPowerSearchLookup } from './config.js'
import { resolveEditorPlacement } from './placement.js'
import PowerSearchEditor from './PowerSearchEditor.vue'
import PowerSearchToken from './PowerSearchToken.vue'
import { searchPowerSearchFields } from './source.js'
import '../../styles/power-search.css'
import '../../styles/typeahead.css'
import '../../styles/visually-hidden-utility.css'

defineOptions({ name: 'AstryxPowerSearch', inheritAttrs: false })

const props = withDefaults(defineProps<PowerSearchProps>(), {
  labelHidden: true,
  hasClear: true,
  clearable: true,
  readOnly: false,
  disabled: false,
  status: 'default',
  statusVariant: 'attached',
  maxTokenLength: 40,
  maxSearchResults: 10,
  overflow: 'none',
  size: 'md',
})

const emit = defineEmits<PowerSearchEmits>()
const slots = defineSlots<PowerSearchSlots>()

const messages = useAstryxMessages()
const locale = useAstryxLocale()
const announce = useAnnounce()
const inputId = `astryx-power-search-${useId()}`
const listboxId = `${inputId}-listbox`
const disabledId = `${inputId}-disabled`
const internal = ref<PowerSearchFilter[]>([])
const filters = computed(() => props.filters ?? internal.value)
const focused = ref(false)
const placeholderHeight = ref(0)
const queryMirror = ref('')
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
useScrollbars(listboxRef)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const editorRef = useTemplateRef<HTMLElement>('editorRef')
const tokenEls = new Map<number, HTMLElement>()

interface EditorSession {
  mode: 'create' | 'edit'
  index: number
  filter: PartialFilter
  placement: EditorPlacement
  ready: boolean
  control: HTMLElement | null
}

const session = ref<EditorSession | null>(null)
const openingControl = ref<HTMLElement | null>(null)
const editorOpen = computed(() => session.value != null)
const sawCount = ref(false)
const liveText = ref('')

const text = computed(() => messages.value.powerSearch)
const label = computed(() => props.label ?? text.value.label)
const placeholder = computed(() => props.placeholder ?? text.value.placeholder)
const disabledMessage = computed(() => (props.disabledMessage ?? props.disabledReason)?.trim() || undefined)
const focusableDisabled = computed(() => props.disabled && disabledMessage.value != null)
// 两个名字默认都是 true，任一传 false 就关掉。
const showsClear = computed(() => props.hasClear && props.clearable)
const resolvedSaveLabel = computed(() => props.popoverSaveButtonLabel ?? props.saveLabel)
const resolvedTimeZone = computed(() => props.timezoneID ?? props.timeZone)
const collapsed = computed(() => props.overflow !== 'none' && !focused.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value)
const lookup = computed(() => createPowerSearchLookup(props.config))
const fieldStatus = computed<FieldStatusInput | undefined>(() => {
  if (!props.statusMessage || props.status === 'default')
    return undefined
  return { type: props.status, message: props.statusMessage }
})
const describedBy = computed(() => {
  return [
    focusableDisabled.value ? disabledId : undefined,
    props.statusMessage ? `${inputId}-status` : undefined,
  ].filter(Boolean).join(' ') || undefined
})

const source = computed(() => ({
  search(query: string) {
    const limit = query.trim() === '' ? 1000 : props.maxSearchResults
    return searchPowerSearchFields(lookup.value, query, text.value, limit)
  },
}))

const menu = useTypeaheadMenu<PowerSearchItem>({
  source: () => source.value,
  debounceMs: 0,
  showOnFocus: () => !props.readOnly,
  maxItems: () => queryMirror.value.trim() === '' ? 1000 : props.maxSearchResults,
  disabled: () => props.disabled || props.readOnly || session.value != null,
  onSelect: entry => pick(entry.item),
  onQueryChange: (query) => {
    queryMirror.value = query
  },
})

const anchored = useAnchoredListbox({
  anchor: anchorRef,
  layer: listboxRef,
  isOpen: menu.combobox.isOpen,
  onDismiss: () => menu.close(),
})

useDismiss({
  container: editorRef,
  trigger: openingControl,
  isEnabled: editorOpen,
  enableEscape: ref(false),
  onDismiss: () => closeEditor(true),
})

const tokenCount = computed(() => filters.value.length)
const overflowState = useOverflow(tokenCount, { gap: 4 })
const visibleCount = computed(() => collapsed.value ? overflowState.visibleCount.value : tokenCount.value)
const hiddenCount = computed(() => Math.max(0, tokenCount.value - visibleCount.value))
const visibleFilters = computed(() => filters.value.slice(0, visibleCount.value))
const displayCount = computed(() => {
  if (props.resultCount == null)
    return ''
  return typeof props.resultCount === 'number' ? text.value.resultCount(props.resultCount) : props.resultCount
})
const menuStyle = computed(() => {
  const base = anchored.style.value
  if (props.menuWidth == null)
    return base
  const width = `${props.menuWidth}px`
  return { ...base, width, minWidth: width, maxWidth: width }
})
const editorStyle = computed(() => {
  const place = session.value?.placement
  if (place == null)
    return undefined
  return {
    top: `${place.top}px`,
    left: `${place.left}px`,
    width: `${place.width}px`,
  }
})
const editorComponent = computed(() => {
  const filter = session.value?.filter
  if (filter?.operator == null)
    return PowerSearchEditor
  const operator = lookup.value.getOperator(filter.field, filter.operator)
  const type = operator?.value.type
  return (type ? props.components?.[type]?.editor : undefined) ?? PowerSearchEditor
})

watch(collapsed, () => {
  void nextTick(() => overflowState.remeasure())
})

watch(() => menu.combobox.activeIndex.value, (index) => {
  if (!menu.combobox.isOpen.value || index < 0)
    return
  void nextTick(() => scrollOptionIntoView(listboxRef.value, menu.entries.value[index]?.id))
})

watch(() => props.resultCount, (value) => {
  if (!sawCount.value) {
    sawCount.value = true
    return
  }
  if (typeof value === 'number')
    liveText.value = text.value.resultCount(value)
  else if (typeof value === 'string')
    liveText.value = value
}, { immediate: true })

function commit(next: PowerSearchFilter[], changeType: PowerSearchChangeType, index: number): void {
  internal.value = next
  emit('update:filters', next)
  emit('change', next, changeType, index)
}

function operatorFor(filter: PowerSearchFilter) {
  return lookup.value.getOperator(filter.field, filter.operator)
}

function fieldFor(filter: PowerSearchFilter) {
  return lookup.value.getField(filter.field)
}

function canEdit(filter: PowerSearchFilter): boolean {
  if (props.disabled || props.readOnly || filter.isReadOnly)
    return false
  const operator = operatorFor(filter)
  if (operator == null)
    return false
  if (operator.value.type !== 'empty')
    return true
  return Boolean(props.components?.empty?.editor || slots.editor)
}

function canRemove(filter: PowerSearchFilter): boolean {
  return !props.disabled && !props.readOnly && filter.isReadOnly !== true
}

function tokenComponent(filter: PowerSearchFilter) {
  const type = operatorFor(filter)?.value.type
  return type ? props.components?.[type]?.token : undefined
}

function measure(control: HTMLElement | null): EditorPlacement | null {
  const outer = anchorRef.value
  if (outer == null)
    return null
  const target = control ?? outer
  const outerRect = outer.getBoundingClientRect()
  const controlRect = target.getBoundingClientRect()
  return resolveEditorPlacement({
    outer: { left: outerRect.left, right: outerRect.right, width: outerRect.width },
    control: { left: controlRect.left, right: controlRect.right, width: controlRect.width },
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    direction: getComputedStyle(outer).direction === 'rtl' ? 'rtl' : 'ltr',
    anchorTop: controlRect.top,
    anchorBottom: controlRect.bottom,
  })
}

function openEditor(mode: 'create' | 'edit', filter: PartialFilter, index: number, control: HTMLElement | null): void {
  const placement = measure(control)
  if (placement == null)
    return
  menu.close()
  openingControl.value = control
  session.value = { mode, index, filter, placement, ready: false, control }
  void nextTick(() => {
    requestAnimationFrame(() => {
      if (session.value)
        session.value = { ...session.value, ready: true }
    })
  })
}

function closeEditor(restore: boolean): void {
  const control = session.value?.control
  session.value = null
  openingControl.value = null
  if (!restore)
    return
  void nextTick(() => {
    if (control instanceof HTMLElement)
      control.focus()
    else
      inputRef.value?.focus()
  })
}

function pick(item: PowerSearchItem): void {
  const data = item.auxiliaryData
  if (data == null)
    return
  const field = lookup.value.getField(data.fieldKey)
  const operator = (data.operatorKey ? lookup.value.getOperator(data.fieldKey, data.operatorKey) : undefined)
    ?? lookup.value.getDefaultOperator(data.fieldKey)
  if (field == null || operator == null)
    return
  menu.query.value = ''
  menu.close()
  if (data.filterValue != null || operator.value.type === 'empty') {
    const value = data.filterValue ?? { type: 'empty' as const }
    const next = [...filters.value, { field: field.key, operator: operator.key, value }]
    commit(next, 'add', next.length - 1)
    announce(`${field.label}: ${operator.key}`)
    void nextTick(() => inputRef.value?.focus())
    return
  }
  openEditor('create', { field: field.key, operator: operator.key }, filters.value.length, inputRef.value)
}

function onEditorSave(filter: PowerSearchFilter | null): void {
  const current = session.value
  if (current == null)
    return
  if (filter == null) {
    if (current.mode === 'edit') {
      const removed = filters.value[current.index]
      const next = filters.value.filter((_, index) => index !== current.index)
      commit(next, 'remove', current.index)
      announce(text.value.removeFilter(removed ? fieldFor(removed)?.label ?? removed.field : ''))
    }
    closeEditor(false)
    void nextTick(() => inputRef.value?.focus())
    return
  }
  if (current.mode === 'edit') {
    const next = filters.value.map((item, index) => index === current.index ? filter : item)
    commit(next, 'edit', current.index)
  }
  else {
    const next = [...filters.value, filter]
    commit(next, 'add', next.length - 1)
  }
  const field = lookup.value.getField(filter.field)
  announce(field?.label ?? filter.field)
  closeEditor(false)
  void nextTick(() => inputRef.value?.focus())
}

function removeAt(index: number): void {
  const filter = filters.value[index]
  if (filter == null || !canRemove(filter))
    return
  const next = filters.value.filter((_, itemIndex) => itemIndex !== index)
  commit(next, 'remove', index)
  announce(text.value.removeFilter(fieldFor(filter)?.label ?? filter.field))
  void nextTick(() => inputRef.value?.focus())
}

function clearAll(event?: Event): void {
  event?.stopPropagation()
  if (props.disabled || filters.value.length === 0)
    return
  commit([], 'remove', 0)
  announce(text.value.clear)
  menu.close()
  inputRef.value?.focus()
}

function activate(index: number): void {
  const filter = filters.value[index]
  if (filter == null || !canEdit(filter))
    return
  openEditor('edit', filter, index, tokenEls.get(index) ?? null)
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
  if (props.disabled || props.readOnly)
    return
  menu.setQuery((event.target as HTMLInputElement).value)
}

function onInputFocus(event: FocusEvent): void {
  emit('focus', event)
  if (!props.disabled && !props.readOnly && session.value == null)
    menu.open()
}

function onFocusIn(): void {
  if (!focused.value && props.overflow === 'unfocused-layer')
    placeholderHeight.value = anchorRef.value?.offsetHeight ?? 0
  focused.value = true
}

function onFocusOut(event: FocusEvent): void {
  const next = event.relatedTarget
  if (next instanceof Node && (anchorRef.value?.contains(next) || listboxRef.value?.contains(next) || editorRef.value?.contains(next)))
    return
  focused.value = false
  if (session.value == null)
    menu.close()
}

function onInputKeyDown(event: KeyboardEvent): void {
  if (session.value != null)
    return
  const input = inputRef.value
  if (event.key === 'Backspace' && menu.query.value === '' && filters.value.length > 0 && canRemove(filters.value[filters.value.length - 1]!)) {
    event.preventDefault()
    removeAt(filters.value.length - 1)
    return
  }
  if (event.key === 'ArrowLeft' && input && input.selectionStart === 0 && input.selectionEnd === 0 && filters.value.length > 0) {
    event.preventDefault()
    focusToken(Math.min(visibleCount.value, filters.value.length) - 1)
    return
  }
  if (event.key === 'ArrowRight' && input && menu.query.value === '' && input.selectionStart === 0)
    return
  menu.onKeyDown(event)
}

function onTokenKeyDown(event: KeyboardEvent, index: number): void {
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    focusToken(index - 1)
  }
  else if (event.key === 'ArrowRight') {
    event.preventDefault()
    if (index < visibleCount.value - 1)
      focusToken(index + 1)
    else
      inputRef.value?.focus()
  }
  else if (event.key === 'Escape') {
    inputRef.value?.focus()
  }
  else if ((event.key === 'Backspace' || event.key === 'Delete') && canRemove(filters.value[index]!)) {
    event.preventDefault()
    removeAt(index)
    if (index > 0)
      focusToken(index - 1)
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    activate(index)
  }
}

function onFieldClick(event: MouseEvent): void {
  if (props.disabled && !focusableDisabled.value)
    return
  const target = event.target
  if (target instanceof Element && target.closest('button, a'))
    return
  inputRef.value?.focus()
}

function highlight(index: number): void {
  const entry = menu.entries.value[index]
  if (entry && !entry.disabled)
    menu.combobox.activeIndex.value = index
}

function groupLabel(index: number): string | undefined {
  const group = menu.entries.value[index]?.item.auxiliaryData?.group
  if (group == null || group === '')
    return undefined
  const previous = index > 0 ? menu.entries.value[index - 1]?.item.auxiliaryData?.group : undefined
  return group !== previous ? group : undefined
}

function itemIcon(item: PowerSearchItem): 'calendar' | 'clock' | 'funnel' | 'search' {
  const data = item.auxiliaryData
  const operator = data?.operatorKey ? lookup.value.getOperator(data.fieldKey, data.operatorKey) : undefined
  const type = operator?.value.type
  if (type === 'date_absolute' || type === 'date_range' || type === 'date_relative')
    return 'calendar'
  if (type === 'time')
    return 'clock'
  if (type === 'enum' || type === 'enum_list')
    return 'funnel'
  return 'search'
}

function optionId(index: number): string {
  return `${listboxId}-option-${index}`
}

onMounted(() => {
  if (props.autofocus)
    inputRef.value?.focus()
})

defineExpose({
  focusTypeahead: () => inputRef.value?.focus(),
  blurTypeahead: () => inputRef.value?.blur(),
})
</script>

<template>
  <Field
    class="astryx-power-search"
    :class="[`size-${size}`, { 'is-floating': floating }]"
    :label="label"
    :input-id="inputId"
    :is-label-hidden="labelHidden"
    :is-disabled="disabled && !focusableDisabled"
    :status="fieldStatus"
    :status-variant="statusVariant"
  >
    <div v-if="floating" class="astryx-power-search-placeholder" :style="{ height: `${placeholderHeight}px` }" />
    <Tooltip :content="disabledMessage" :is-enabled="focusableDisabled">
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处把焦点交给输入框。 -->
      <div
        ref="anchorRef"
        class="astryx-power-search-control"
        :class="[`status-${status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': disabled, 'is-floating': floating }]"
        @click="onFieldClick"
        @focusin="onFocusIn"
        @focusout="onFocusOut"
      >
        <span v-if="slots.icon" class="astryx-power-search-icon" aria-hidden="true">
          <slot name="icon" />
        </span>
        <span :ref="overflowState.containerRef" class="astryx-power-search-tokens" :class="{ 'is-collapsed': collapsed }">
          <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键在条件之间移动焦点。 -->
          <span
            v-for="(filter, index) in visibleFilters"
            :key="`${filter.field}-${filter.operator}-${index}`"
            :ref="element => setTokenEl(index, element)"
            class="astryx-power-search-token"
            tabindex="-1"
            @keydown="onTokenKeyDown($event, index)"
          >
            <slot
              name="token"
              :config="config"
              :filter="filter"
              :field="fieldFor(filter)!"
              :operator="operatorFor(filter)!"
              :max-length="maxTokenLength"
              :disabled="disabled"
              :on-click="() => activate(index)"
              :on-remove="() => removeAt(index)"
            >
              <component
                :is="tokenComponent(filter)"
                v-if="tokenComponent(filter)"
                :config="config"
                :filter="filter"
                :field="fieldFor(filter)"
                :operator="operatorFor(filter)"
                :max-length="maxTokenLength"
                :disabled="disabled"
                :on-click="() => activate(index)"
                :on-remove="() => removeAt(index)"
              />
              <PowerSearchToken
                v-else-if="fieldFor(filter) && operatorFor(filter)"
                :field-label="fieldFor(filter)!.label"
                :operator="operatorFor(filter)!"
                :filter="filter"
                :max-length="maxTokenLength"
                :messages="text"
                :locale="locale"
                :time-zone="resolvedTimeZone"
                :size="size"
                :disabled="disabled"
                :removable="canRemove(filter)"
                @activate="activate(index)"
                @remove="removeAt(index)"
              />
            </slot>
          </span>
          <span v-if="collapsed && hiddenCount > 0" class="astryx-power-search-more">
            {{ text.more(hiddenCount) }}
          </span>
        </span>
        <span :ref="overflowState.measureRef" class="astryx-power-search-measure" aria-hidden="true">
          <span v-for="(filter, index) in filters" :key="`${filter.field}-${index}`" class="astryx-power-search-token">
            <PowerSearchToken
              v-if="fieldFor(filter) && operatorFor(filter)"
              :field-label="fieldFor(filter)!.label"
              :operator="operatorFor(filter)!"
              :filter="filter"
              :max-length="maxTokenLength"
              :messages="text"
              :locale="locale"
              :size="size"
              removable
            />
          </span>
          <span data-overflow-indicator class="astryx-power-search-more">{{ text.more(Math.max(hiddenCount, 1)) }}</span>
        </span>
        <input
          :id="inputId"
          ref="inputRef"
          class="astryx-power-search-input"
          type="text"
          role="combobox"
          autocomplete="off"
          autocapitalize="off"
          :placeholder="filters.length === 0 ? placeholder : undefined"
          :value="menu.query.value"
          :disabled="disabled && !focusableDisabled"
          :readonly="readOnly || focusableDisabled || undefined"
          :aria-disabled="disabled ? 'true' : undefined"
          :aria-expanded="menu.combobox.isOpen.value"
          :aria-controls="listboxId"
          aria-autocomplete="list"
          :aria-activedescendant="menu.activeId.value ? optionId(menu.combobox.activeIndex.value) : undefined"
          :aria-describedby="describedBy"
          @input="onInput"
          @keydown="onInputKeyDown"
          @focus="onInputFocus"
          @blur="emit('blur', $event)"
        >
        <slot v-if="slots.endContent" name="endContent" />
        <slot v-else name="end" />
        <span v-if="displayCount" class="astryx-power-search-count">{{ displayCount }}</span>
        <button
          v-if="showsClear && filters.length > 0 && !disabled && !readOnly"
          type="button"
          class="astryx-power-search-clear"
          :aria-label="text.clear"
          @click="clearAll"
        >
          <Icon icon="close" size="sm" />
        </button>
        <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ disabledMessage }}</span>
      </div>
    </Tooltip>
    <span class="astryx-visually-hidden" aria-live="polite">{{ liveText }}</span>
  </Field>
  <Teleport to="body">
    <div
      v-show="menu.combobox.isOpen.value"
      :id="listboxId"
      ref="listboxRef"
      class="astryx-typeahead-listbox"
      role="listbox"
      :aria-label="text.results"
      :data-placement="anchored.position.value.placement"
      :style="menuStyle"
      tabindex="-1"
    >
      <div class="astryx-typeahead-menu" role="presentation">
        <div v-if="menu.entries.value.length === 0" class="astryx-typeahead-state">
          {{ text.empty }}
        </div>
        <div v-else class="astryx-typeahead-options" role="presentation">
          <template v-for="(entry, index) in menu.entries.value" :key="entry.id">
            <div v-if="groupLabel(index)" class="astryx-power-search-menu-group">
              {{ groupLabel(index) }}
            </div>
            <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序。 -->
            <div
              :id="optionId(index)"
              class="astryx-typeahead-option"
              :class="{ 'is-active': index === menu.combobox.activeIndex.value, 'is-disabled': entry.disabled }"
              role="option"
              :aria-selected="index === menu.combobox.activeIndex.value ? 'true' : 'false'"
              :data-option-id="entry.id"
              tabindex="-1"
              @mousedown.prevent
              @mouseenter="highlight(index)"
              @click="pick(entry.item)"
            >
              <Icon :icon="itemIcon(entry.item)" size="sm" />
              <span class="astryx-typeahead-option-copy">
                <span class="astryx-typeahead-option-label">{{ entry.label }}</span>
                <span v-if="entry.description" class="astryx-typeahead-option-description">{{ entry.description }}</span>
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div
      v-if="session"
      ref="editorRef"
      class="astryx-power-search-editor"
      :data-ready="session.ready ? 'true' : 'false'"
      :style="editorStyle"
    >
      <slot
        name="editor"
        :config="config"
        :filter="session.filter"
        :mode="session.mode"
        :save-label="resolvedSaveLabel"
        :read-only="readOnly"
        :time-zone="resolvedTimeZone"
        :max-menu-items="maxOperatorMenuItems"
        :on-save="onEditorSave"
        :on-cancel="() => closeEditor(true)"
      >
        <component
          :is="editorComponent"
          :config="config"
          :filter="session.filter"
          :mode="session.mode"
          :save-label="resolvedSaveLabel"
          :read-only="readOnly"
          :time-zone="resolvedTimeZone"
          :max-menu-items="maxOperatorMenuItems"
          :on-save="onEditorSave"
          :on-cancel="() => closeEditor(true)"
        />
      </slot>
    </div>
  </Teleport>
</template>
