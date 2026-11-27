<script setup lang="ts">
import type { FieldStatusInput } from '../Field/types.js'
import type {
  PowerSearchEmits,
  PowerSearchItem,
  PowerSearchProps,
  PowerSearchSlots,
} from './types.js'
import { computed, nextTick, onMounted, ref, useAttrs, useId, useTemplateRef, watch } from 'vue'
import { devPropError, isDevBuild } from '../composables/internal/devBuild.js'
import { useAnnounce } from '../composables/useAnnounce.js'
import { useDismiss } from '../composables/useDismiss.js'
import { useInputStatusIcon } from '../composables/useInputStatusIcon.js'
import { useOverflow } from '../composables/useOverflow.js'
import { useResolvedLabelHidden } from '../composables/useResolvedLabelHidden.js'
import Field from '../Field/Field.vue'
import { useFieldPartStyling } from '../Field/fieldParts.js'
import Icon from '../Icon/Icon.vue'
import { useAstryxLocale, useComponentMessages } from '../locale/context.js'
import { powerSearchMessages } from '../locale/messages/power-search.js'
import { useSize } from '../SizeContext/SizeContext.js'
import Tooltip from '../Tooltip/Tooltip.vue'
import { useAnchoredListbox } from '../Typeahead/useAnchoredListbox.js'
import { useTypeaheadMenu } from '../Typeahead/useTypeaheadMenu.js'
import { createPowerSearchLookup } from './config.js'
import { menuStyleWithWidth, resultCountText } from './menuStyle.js'
import PowerSearchFilterToken from './PowerSearchFilterToken.vue'
import PowerSearchListbox from './PowerSearchListbox.vue'
import PowerSearchSheetField from './PowerSearchSheetField.vue'
import PowerSearchToken from './PowerSearchToken.vue'
import { searchPowerSearchFields } from './source.js'
import { useFilterTokenNaming } from './useFilterTokenNaming.js'
import { usePowerSearchActions } from './usePowerSearchActions.js'
import { usePowerSearchPresentation } from './usePowerSearchPresentation.js'
import { useResultCountAnnouncement } from './useResultCountAnnouncement.js'
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
  presentation: 'adaptive',
})

const emit = defineEmits<PowerSearchEmits>()

const slots = defineSlots<PowerSearchSlots>()

if (isDevBuild() && props.config == null)
  throw devPropError('PowerSearch', 'config', 'is required: the fields people can filter by, for example :config="{ fields: [...] }".')

// 显式 size > 外层 SizeContext（Toolbar、InputGroup 等）> 'md'。
const size = useSize(() => props.size, 'md')

const attrs = useAttrs()
const parts = useFieldPartStyling({
  component: 'PowerSearch',
  props,
  attrs,
  reservedAttrs: ['id', 'type', 'role', 'value', 'disabled', 'readonly', 'placeholder', 'autocomplete', 'aria-expanded', 'aria-controls', 'aria-autocomplete', 'aria-activedescendant', 'aria-describedby', 'aria-disabled'],
})
const hideLabel = useResolvedLabelHidden(() => props.isLabelHidden, () => props.labelHidden, true)
const messages = useComponentMessages({ powerSearch: powerSearchMessages })
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
const listboxRef = useTemplateRef<{ element: HTMLElement | null }>('listboxRef')
const listboxElement = computed(() => listboxRef.value?.element ?? null)
const sheetFieldRef = useTemplateRef<InstanceType<typeof PowerSearchSheetField>>('sheetFieldRef')
const inputRef = useTemplateRef<HTMLInputElement>('inputRef')
const editorRef = useTemplateRef<HTMLElement>('editorRef')
const visibleCountOf = { current: () => 0 }

const text = computed(() => messages.value.powerSearch)
const liveText = useResultCountAnnouncement(() => props.resultCount, count => text.value.resultCount(count))
const label = computed(() => props.label ?? text.value.label)
const placeholder = computed(() => props.placeholder ?? text.value.placeholder)
const disabledMessage = computed(() => (props.disabledMessage ?? props.disabledReason)?.trim() || undefined)
const focusableDisabled = computed(() => props.disabled && disabledMessage.value != null)
const showsClear = computed(() => props.hasClear && props.clearable)
const resolvedSaveLabel = computed(() => props.popoverSaveButtonLabel ?? props.saveLabel)
const resolvedTimeZone = computed(() => props.timezoneID ?? props.timeZone)
const lookup = computed(() => createPowerSearchLookup(props.config))
const fieldStatus = computed<FieldStatusInput | undefined>(() => !props.statusMessage || props.status === 'default' ? undefined : { type: props.status, message: props.statusMessage })
const { statusIcon, statusIconProps } = useInputStatusIcon({ status: () => fieldStatus.value, statusVariant: () => props.statusVariant })
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
  layer: listboxElement,
  isOpen: menu.combobox.isOpen,
  onDismiss: () => menu.close(),
})

const {
  activate,
  canEdit,
  canRemove,
  clearAll,
  closeEditor,
  commit,
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

const naming = useFilterTokenNaming({ idPrefix: () => inputId.value, session, filters, opensEditor: canEdit, isBuiltIn: filter => !slots.token && !tokenComponent(filter) })

bridge.pick = pick
bridge.sessionOpen = () => session.value != null
bridge.closeEditor = closeEditor
const sheet = usePowerSearchPresentation({
  props,
  root: () => anchorRef.value ?? sheetFieldRef.value?.element,
  input: () => inputRef.value,
  sheetTrigger: () => sheetFieldRef.value,
  onEnterSheet: () => {
    menu.close()
    closeEditor(false)
  },
})
const collapsed = computed(() => props.overflow !== 'none' && !focused.value && !sheet.isSheet.value)
const floating = computed(() => props.overflow === 'unfocused-layer' && focused.value && !sheet.isSheet.value)

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

const visibleFilters = computed(() => filters.value.slice(0, visibleCount.value))
// 全部清除只移除可编辑的条件，所以只有存在可编辑条件时才显示。
const hasClearButton = computed(() => showsClear.value && filters.value.some(filter => filter.isReadOnly !== true) && !props.disabled && !props.readOnly)
const displayCount = computed(() => resultCountText(props.resultCount, text.value.resultCount))
const menuStyle = computed(() => menuStyleWithWidth(anchored.style.value, props.menuWidth))

function onInputFocus(event: FocusEvent): void {
  if (sheet.isHandingOffFocus())
    return
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
  if (next instanceof Node && (anchorRef.value?.contains(next) || listboxElement.value?.contains(next) || editorRef.value?.contains(next)))
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

onMounted(() => {
  if (props.autofocus)
    sheet.focusControl()
})

defineExpose({
  focusTypeahead: () => sheet.focusControl(),
  blurTypeahead: () => sheet.blurControl(),
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
      <PowerSearchSheetField
        v-if="sheet.isSheet.value"
        ref="sheetFieldRef"
        v-bind="parts.forwardedAttrs()"
        v-model:is-open="sheet.sheetOpen.value"
        :config="config"
        :lookup="lookup"
        :filters="filters"
        :input-id="inputId"
        :label-id="`${inputId}-label`"
        :described-by="describedBy"
        :placeholder="placeholder"
        :size="size"
        :is-disabled="disabled"
        :is-focusable-when-disabled="focusableDisabled"
        :is-read-only="readOnly"
        :has-clear="showsClear"
        :control-class="[parts.controlClass(), `status-${status}`]"
        :control-style="parts.controlStyle()"
        :status-icon="statusIcon"
        :status-icon-props="statusIconProps"
        :display-count="displayCount"
        :messages="text"
        :locale="locale"
        :time-zone="resolvedTimeZone"
        :max-token-length="maxTokenLength"
        :max-operator-menu-items="maxOperatorMenuItems"
        :save-label="resolvedSaveLabel"
        :components="components"
        :search="query => source.search(query)"
        :token-component="tokenComponent"
        @commit="commit"
        @motion-complete="sheet.onSheetMotionComplete"
        @focus="sheet.isHandingOffFocus() || emit('focus', $event)"
        @blur="emit('blur', $event)"
      >
        <template v-if="slots.icon" #icon>
          <slot name="icon" />
        </template>
        <template v-if="slots.endContent || slots.end" #end>
          <slot v-if="slots.endContent" name="endContent" />
          <slot v-else name="end" />
        </template>
        <template v-if="slots.token" #token="tokenProps">
          <slot name="token" v-bind="tokenProps" />
        </template>
      </PowerSearchSheetField>
      <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 点空白处把焦点交给输入框。 -->
      <div
        v-else
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
            <PowerSearchFilterToken
              v-bind="naming.tokenProps(filter, index)"
              :config="config"
              :lookup="lookup"
              :filter="filter"
              :max-length="maxTokenLength"
              :messages="text"
              :locale="locale"
              :time-zone="resolvedTimeZone"
              :size="size"
              :disabled="disabled"
              :removable="canRemove(filter)"
              :custom="tokenComponent(filter)"
              @activate="activate(index)"
              @remove="removeAt(index)"
            >
              <template v-if="slots.token" #token="tokenProps">
                <slot name="token" v-bind="tokenProps" />
              </template>
            </PowerSearchFilterToken>
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
          autocorrect="off"
          enterkeyhint="search"
          :placeholder="filters.length === 0 ? placeholder : undefined"
          :value="menu.query.value"
          :disabled="disabled && !focusableDisabled"
          :readonly="readOnly || focusableDisabled || undefined"
          :aria-disabled="disabled ? 'true' : undefined"
          :aria-expanded="menu.combobox.isOpen.value"
          :aria-controls="listboxId"
          aria-autocomplete="list"
          :aria-activedescendant="menu.activeId.value ? `${listboxId}-option-${menu.combobox.activeIndex.value}` : undefined"
          :aria-describedby="describedBy"
          @input="onInput"
          @keydown="onInputKeyDown"
          @focus="onInputFocus"
          @blur="emit('blur', $event)"
        >
        <!-- 同上游 Tokenizer 的 endSection：计数、endContent、清除按钮并成一组，距边框 8px、间距 8px。 -->
        <span v-if="displayCount || slots.endContent || slots.end || hasClearButton || statusIcon" class="astryx-power-search-end">
          <span v-if="displayCount" class="astryx-power-search-count">{{ displayCount }}</span>
          <slot v-if="slots.endContent" name="endContent" />
          <slot v-else name="end" />
          <button
            v-if="hasClearButton"
            type="button"
            class="astryx-power-search-clear"
            :aria-label="text.clear"
            @click="clearAll"
          >
            <Icon icon="close" size="sm" />
          </button>
          <component :is="statusIcon" v-if="statusIcon" v-bind="statusIconProps" />
        </span>
      </div>
    </Tooltip>
    <span v-if="focusableDisabled" :id="disabledId" class="astryx-visually-hidden">{{ disabledMessage }}</span>
    <span class="astryx-visually-hidden" aria-live="polite">{{ liveText }}</span>
  </Field>
  <Teleport to="body">
    <PowerSearchListbox
      v-if="!sheet.isSheet.value"
      :id="listboxId"
      ref="listboxRef"
      :is-open="menu.combobox.isOpen.value"
      :entries="menu.entries.value"
      :active-index="menu.combobox.activeIndex.value"
      :label="text.results"
      :empty-text="text.empty"
      :placement="anchored.position.value.placement"
      :menu-style="menuStyle"
      :lookup="lookup"
      @highlight="menu.combobox.activeIndex.value = $event"
      @pick="pick"
    />
    <div
      v-if="session"
      ref="editorRef"
      v-bind="naming.editorAttrs.value"
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
