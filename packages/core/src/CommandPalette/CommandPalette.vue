<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { CommandPaletteEmits, CommandPaletteProps, CommandPaletteSlots } from './types.js'
import { computed, provide, ref, useId, watch } from 'vue'
import { useAnnounce, useAsyncSource } from '../composables/index.js'
import Dialog from '../Dialog/Dialog.vue'
import { useComponentMessages } from '../locale/context.js'
import { commandPaletteMessages } from '../locale/messages/command-palette.js'
import CommandPaletteEmpty from './CommandPaletteEmpty.vue'
import CommandPaletteFooter from './CommandPaletteFooter.vue'
import CommandPaletteGroup from './CommandPaletteGroup.vue'
import CommandPaletteInput from './CommandPaletteInput.vue'
import CommandPaletteItem from './CommandPaletteItem.vue'
import CommandPaletteList from './CommandPaletteList.vue'
import { commandPaletteKey } from './context.js'
import { moveHighlight } from './keyboard.js'
import '../../styles/command-palette.css'

defineOptions({ name: 'AstryxCommandPalette' })

const props = withDefaults(defineProps<CommandPaletteProps<T>>(), {
  isInline: false,
  maxHeight: 480,
  width: 640,
})

const emit = defineEmits<CommandPaletteEmits>()
defineSlots<CommandPaletteSlots<T>>()

const value = defineModel<string | undefined>('value', { default: undefined })
const messages = useComponentMessages({ commandPalette: commandPaletteMessages })
// 每次搜索状态都重新说一遍：快速输入时，后一条取代还没念出去的前一条，结果也取代还没念出去的「加载中」。
const announce = useAnnounce({ hasReplace: true })
const search = ref('')
let busySettle: (() => void) | null = null
const highlightedIndex = ref(-1)
const highlightCause = ref<'keyboard' | 'pointer' | 'sync'>('sync')
const listId = `astryx-command-palette-${useId()}`
const enabled = computed(() => props.isOpen)
const source = computed(() => props.searchSource)

const results = useAsyncSource({
  debounceMs: 0,
  enabled,
  query: search,
  source,
})

const items = computed(() => results.items.value as T[])
const isBusy = computed(() => results.status.value === 'loading')
const isInline = computed(() => props.isInline)
const label = computed(() => props.label ?? messages.value.commandPalette.label)

function groupName(item: SearchableItem): string | null {
  const data = item.auxiliaryData
  if (data == null || typeof data !== 'object' || !('group' in data))
    return null
  const group = (data as { group?: unknown }).group
  return typeof group === 'string' && group !== '' ? group : null
}

const sections = computed(() => {
  const groups: Array<{ heading: string, items: T[] }> = []
  const loose: T[] = []
  for (const item of items.value) {
    const heading = groupName(item)
    if (heading == null) {
      loose.push(item)
      continue
    }
    const existing = groups.find(group => group.heading === heading)
    if (existing)
      existing.items.push(item)
    else
      groups.push({ heading, items: [item] })
  }
  return { groups, loose, grouped: groups.length > 0 }
})

// 空状态文字属于「已经落定的那次查询」：第一次搜索还在等的时候，字段里敲了字也不显示「输入以搜索」。
// 落定之后的空状态在后续按键里一直留着，不会闪。
const settledQuery = ref<string | null>(null)
const emptyKind = computed<'bootstrap' | 'search' | 'pending' | null>(() => {
  const status = results.status.value
  if (items.value.length > 0 || status === 'idle')
    return null
  const hasQuery = search.value.trim() !== ''
  const wasSearch = settledQuery.value?.trim() !== ''
  if (status !== 'loading')
    return hasQuery ? 'search' : 'bootstrap'
  if (settledQuery.value == null)
    return 'pending'
  if (hasQuery && wasSearch)
    return 'search'
  return !hasQuery && !wasSearch ? 'bootstrap' : 'pending'
})
const emptyText = computed(() => emptyKind.value === 'bootstrap'
  ? props.emptyBootstrapText ?? messages.value.commandPalette.emptyBootstrap
  : props.emptySearchText ?? messages.value.commandPalette.emptySearch)

function setSearch(next: string): void {
  search.value = next
}

function setHighlightedIndex(index: number, cause: 'keyboard' | 'pointer' | 'sync' = 'keyboard'): void {
  highlightCause.value = cause
  highlightedIndex.value = index
}

function close(): void {
  results.cancel()
  search.value = ''
  settledQuery.value = null
  highlightedIndex.value = -1
  announce('')
  emit('openChange', false)
}

function selectItem(item: SearchableItem): void {
  if (item.disabled)
    return
  value.value = item.id
  emit('valueChange', item.id)
  close()
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.isComposing || event.key === 'Process')
    return
  if (event.key === 'Escape') {
    // 模态面板把 Escape 留给对话框的关闭栈，里面还有一层时先关里面。
    // 内嵌预览不进那一层栈，所以仍在这里关掉。
    if (props.isInline) {
      event.preventDefault()
      close()
    }
    return
  }
  if (event.key === ' ')
    return
  if (event.key === 'Enter') {
    event.preventDefault()
    const item = items.value[highlightedIndex.value]
    if (item != null)
      selectItem(item)
    return
  }
  if (event.key === 'Home' || event.key === 'End')
    return

  const direction = event.key === 'ArrowDown'
    ? 'next'
    : event.key === 'ArrowUp'
      ? 'previous'
      : event.key === 'PageUp'
        ? 'first'
        : event.key === 'PageDown'
          ? 'last'
          : null
  if (direction == null)
    return
  event.preventDefault()
  setHighlightedIndex(moveHighlight(items.value, highlightedIndex.value, direction), 'keyboard')
}

function onOpenChange(open: boolean): void {
  if (!open)
    close()
  else
    emit('openChange', true)
}

watch(items, (list) => {
  highlightCause.value = 'sync'
  if (search.value.trim() === '' && value.value) {
    highlightedIndex.value = list.findIndex(item => item.id === value.value && !item.disabled)
    return
  }
  highlightedIndex.value = -1
})

watch(() => results.status.value, (status) => {
  if (status === 'ready' || status === 'empty' || status === 'error')
    settledQuery.value = results.searchedQuery.value
})

// 「加载中」由输入框在对话框里念；这里只念搜索的结果，并先收回还没念出去的「加载中」。
watch([() => results.status.value, items, search], () => {
  if (!props.isOpen || search.value.trim() === '')
    return
  const status = results.status.value
  if (status === 'empty' || status === 'error') {
    busySettle?.()
    announce(messages.value.commandPalette.noResultsFor(search.value))
  }
  else if (status === 'ready') {
    busySettle?.()
    announce(messages.value.commandPalette.resultCount(items.value.length))
  }
})

watch(() => props.isOpen, (open) => {
  if (!open) {
    settledQuery.value = null
    results.cancel()
    search.value = ''
    highlightCause.value = 'sync'
    highlightedIndex.value = -1
  }
})

provide(commandPaletteKey, {
  highlightedIndex,
  highlightCause,
  isBusy,
  isInline,
  items,
  listId,
  onKeyDown,
  registerBusySettle: (settle) => {
    busySettle = settle
  },
  search,
  selectItem,
  setHighlightedIndex,
  setSearch,
  value: computed(() => value.value),
})
</script>

<template>
  <Dialog
    :aria-label="label"
    :is-inline="isInline"
    :is-open="isOpen"
    :max-height="maxHeight"
    :padding="0"
    purpose="info"
    :role="isInline ? 'dialog' : undefined"
    :width="width"
    @open-change="onOpenChange"
  >
    <div class="astryx-command-palette">
      <div class="astryx-command-palette-header">
        <slot name="input">
          <CommandPaletteInput />
        </slot>
      </div>
      <CommandPaletteList>
        <!-- 第一次搜索还没落定时用一个看不见的空格撑住一行高，对话框不会跳；读屏听到的是输入框念的「加载中」。 -->
        <CommandPaletteEmpty v-if="emptyKind != null" :aria-hidden="emptyKind === 'pending' ? 'true' : undefined">
          {{ emptyKind === 'pending' ? '\u00a0' : emptyText }}
        </CommandPaletteEmpty>
        <template v-else>
          <CommandPaletteGroup
            v-for="group in sections.groups"
            :key="group.heading"
            :heading="group.heading"
          >
            <CommandPaletteItem
              v-for="item in group.items"
              :key="item.id"
              :is-disabled="item.disabled"
              :value="item.id"
            >
              <slot
                name="item"
                :is-selected="item.id === value"
                :item="item"
              >
                {{ item.label }}
              </slot>
            </CommandPaletteItem>
          </CommandPaletteGroup>
          <CommandPaletteItem
            v-for="item in sections.loose"
            :key="item.id"
            :is-disabled="item.disabled"
            :value="item.id"
          >
            <slot
              name="item"
              :is-selected="item.id === value"
              :item="item"
            >
              {{ item.label }}
            </slot>
          </CommandPaletteItem>
        </template>
      </CommandPaletteList>
      <div class="astryx-command-palette-footer-wrap">
        <slot name="footer">
          <CommandPaletteFooter />
        </slot>
      </div>
    </div>
  </Dialog>
</template>
