<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { AsyncSourceStatus } from '../composables/useAsyncSource.js'
import type { TypeaheadMenuEntryView } from './TypeaheadMenu.vue'
import type { TypeaheadMenuConfig } from './types.js'
import { computed, defineComponent, h, useSlots, useTemplateRef } from 'vue'
import TypeaheadMenu from './TypeaheadMenu.vue'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxTypeaheadPopup', inheritAttrs: false })

const props = defineProps<{
  /** 菜单元素的 id：结果列表（没有 `menu` 插槽时）或 dialog，输入框的 aria-controls 指向它。 */
  id: string
  isOpen: boolean
  config?: TypeaheadMenuConfig
  /** 结果列表的无障碍名。 */
  label: string
  grid: boolean
  placement?: string
  popupStyle: CSSProperties
  /** 加在浮层上的类。 */
  popupClass?: string
  entries: readonly TypeaheadMenuEntryView[]
  activeIndex: number
  actionIndex: number
  status: AsyncSourceStatus
  emptyText: string
  loadingText: string
  errorText: string
  query: string
  /** 这次查询搜完了。 */
  isSettled: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  highlight: [index: number]
  close: []
  keydown: [event: KeyboardEvent]
}>()

const slots = useSlots()
const root = useTemplateRef<HTMLElement>('root')
defineExpose({ el: root })

const isDialog = computed(() => props.config?.role === 'dialog')
const dialogLabel = computed(() => props.config?.role === 'dialog' ? props.config.label : undefined)
/** listbox 角色带 `menu` 插槽：浮层本身不是列表，列表由插槽里的 `listbox` 放在想放的位置。 */
const wrapsList = computed(() => !isDialog.value && slots.menu != null)
const listRole = computed(() => props.grid ? 'grid' : 'listbox')
const isBusy = computed(() => props.status === 'loading')
const isEmptySearch = computed(() => props.status === 'empty' && props.isSettled && props.query.trim() !== '')

const menuProps = computed(() => ({
  entries: props.entries,
  activeIndex: props.activeIndex,
  grid: props.grid,
  actionIndex: props.actionIndex,
  status: props.status,
  listboxId: props.id,
  emptyText: props.emptyText,
  loadingText: props.loadingText,
  errorText: props.errorText,
  onSelect: (id: string) => emit('select', id),
  onHighlight: (index: number) => emit('highlight', index),
}))

function menuSlots(): Record<string, unknown> {
  return { ...(slots.item ? { item: slots.item } : {}), ...(slots.empty ? { empty: slots.empty } : {}) }
}

/** 结果列表：唯一带 listbox 角色的元素，菜单插槽围着它放别的信息。 */
const Listbox = defineComponent({
  name: 'AstryxTypeaheadListbox',
  setup: () => () => h('div', { 'id': props.id, 'role': listRole.value, 'aria-label': props.label }, [h(TypeaheadMenu, menuProps.value, menuSlots())]),
})
</script>

<template>
  <Teleport to="body">
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- Escape 关 dialog 菜单：焦点在菜单里的任何地方按下都要接到。 -->
    <div
      v-show="isOpen"
      :id="isDialog || !wrapsList ? id : undefined"
      ref="root"
      class="astryx-typeahead-listbox astryx-layer"
      :class="popupClass"
      :role="isDialog ? 'dialog' : (wrapsList ? undefined : listRole)"
      :aria-label="isDialog ? dialogLabel : (wrapsList ? undefined : label)"
      :data-placement="placement"
      :style="popupStyle"
      tabindex="-1"
      @keydown="emit('keydown', $event)"
    >
      <slot v-if="isDialog" name="menu" :query="query" :close="() => emit('close')" />
      <slot v-else-if="wrapsList" name="menu" :listbox="Listbox" :query="query" :is-busy="isBusy" :is-empty-search="isEmptySearch" :close="() => emit('close')" />
      <TypeaheadMenu v-else v-bind="menuProps">
        <template v-if="$slots.item" #item="slotProps">
          <slot name="item" v-bind="slotProps" />
        </template>
        <template v-if="$slots.empty" #empty>
          <slot name="empty" />
        </template>
      </TypeaheadMenu>
    </div>
  </Teleport>
</template>
