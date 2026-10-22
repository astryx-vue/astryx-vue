<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type {
  PowerSearchEmits,
  PowerSearchItem,
  PowerSearchProps,
  PowerSearchSlots,
} from './types.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useAstryxMessages } from '../locale/context.js'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import { scrollOptionIntoView, useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { createPowerSearchLookup } from './config.js'
import { powerSearchGroupLabel, powerSearchItemIcon } from './menuPresentation.js'
import PowerSearchToken from './PowerSearchToken.vue'
import { searchPowerSearchFields } from './source.js'
import { usePowerSearchActions } from './usePowerSearchActions.js'
import '../../styles/power-search.css'
import '../../styles/typeahead.css'
import '../../styles/visually-hidden-utility.css'
import '../../styles/layer.css'

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
const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'PowerSearch',
  props,
  attrs,
  reservedAttrs: ['id', 'type', 'role', 'value', 'disabled', 'readonly', 'placeholder', 'autocomplete', 'aria-expanded', 'aria-controls', 'aria-autocomplete', 'aria-activedescendant', 'aria-describedby', 'aria-disabled'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden, true)
const messages = useAstryxMessages()
const locale = useAstryxLocale()
const announce = useAnnounce()
const generatedId = `astryx-power-search-${useId()}`
const passedId = computed(() => typeof attrs.id === 'string' && attrs.id !== '' ? attrs.id : undefined)
const inputId = computed(() => passedId.value ?? generatedId)
const listboxId = computed(() => `${inputId.value}-listbox`)
const disabledId = computed(() => `${inputId.value}-disabled`)
const focused = ref(false)
const placeholderHeight = ref(0)
const queryMirror = ref('')
const anchorRef = useTemplateRef<HTMLElement>('anchorRef')
const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
useScrollbars(listboxRef)
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const editorRef = useTemplateRef<HTMLElement>('editorRef')
const sawCount = ref(false)
const liveText = ref('')
const visibleCountOf = { current: () => 0 }

const text = computed(() => messages.value.powerSearch)
const label = computed(() => props.label ?? text.value.label)
const placeholder = computed(() => props.placeholder ?? text.value.placeholder)
const disabledMessage = computed(() => (props.disabledMessage ?? props.disabledReason)?.trim() || undefined)
const focusableDisabled = computed(() => props.disabled && disabledMessage.value != null)
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
const externalDescribedBy = computed(() => typeof attrs['aria-describedby'] === 'string' ? attrs['aria-describedby'] : undefined)
const describedBy = computed(() => [
  externalDescribedBy.value,
  focusableDisabled.value ? disabledId.value : undefined,
  props.statusMessage ? `${inputId.value}-status` : undefined,
].filter(Boolean).join(' ') || undefined)

const source = computed(() => ({
  search(query: string) {
    const limit = query.trim() === '' ? 1000 : props.maxSearchResults
    return searchPowerSearchFields(lookup.value, query, text.value, limit)
  },
}))

const bridge = {
  pick: (_item: PowerSearchItem) => {},
  sessionOpen: () => false,
  closeEditor: (_restore: boolean) => {},
}

const menu = useTypeaheadMenu<PowerSearchItem>({
  source: () => source.value,
  debounceMs: 0,
  showOnFocus: () => !props.readOnly,
  maxItems: () => queryMirror.value.trim() === '' ? 1000 : props.maxSearchResults,
  disabled: () => props.disabled || props.readOnly || bridge.sessionOpen(),
  onSelect: entry => bridge.pick(entry.item),
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

const {
  activate,
  canRemove,
  clearAll,
  closeEditor,
  editorComponent,
  editorOpen,
  editorStyle,
  fieldFor,
  filters,
  onEditorSave,
  onInput,
  onInputKeyDown,
  onTokenKeyDown,
  openingControl,
  operatorFor,
  pick,
  removeAt,
  session,
  setTokenEl,
  tokenComponent,
} = usePowerSearchActions({
  props,
  emit,
  hasCustomEditor: () => slots.editor != null,
  menu: {
    query: menu.query,
    close: () => menu.close(),
    setQuery: (value) => {
      menu.query.value = value
    },
    onKeyDown: event => menu.onKeyDown(event),
  },
  anchorRef,
  inputRef,
  lookup,
  text,
  announce,
  visibleCount: () => visibleCountOf.current(),
})

bridge.pick = pick
bridge.sessionOpen = () => session.value != null
bridge.closeEditor = closeEditor

useDismiss({
  container: editorRef,
  trigger: openingControl,
  isEnabled: editorOpen,
  dismissOnEscape: 'ignore',
  onDismiss: () => closeEditor(true),
})

const tokenCount = computed(() => filters.value.length)
const overflowState = useOverflow(tokenCount, { gap: 4 })
const visibleCount = computed(() => collapsed.value ? overflowState.visibleCount.value : tokenCount.value)
visibleCountOf.current = () => visibleCount.value
const hiddenCount = computed(() => Math.max(0, tokenCount.value - visibleCount.value))

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
  const width = `min(${props.menuWidth}px, var(--astryx-layer-max-inline-size, calc(100vw - 32px)))`
  return { ...base, width, minWidth: width, maxWidth: width }
})

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

function optionId(index: number): string {
  return `${listboxId.value}-option-${index}`
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
    :class="[parts.containerClass.value, `size-${size}`, { 'is-floating': floating }]"
    :style="parts.containerStyle.value"
    :label="label"
    :input-id="inputId"
    :is-label-hidden="hideLabel"
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
        :class="[parts.controlClass(), `status-${status}`, { 'is-open': menu.combobox.isOpen.value, 'is-disabled': disabled, 'is-floating': floating }]"
        :style="parts.controlStyle()"
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
          v-bind="parts.forwardedAttrs()"
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
      class="astryx-typeahead-listbox astryx-layer"
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
            <div v-if="powerSearchGroupLabel(menu.entries.value, index)" class="astryx-power-search-menu-group">
              {{ powerSearchGroupLabel(menu.entries.value, index) }}
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
              <Icon :icon="powerSearchItemIcon(entry.item, lookup)" size="sm" />
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
      class="astryx-power-search-editor astryx-layer"
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
