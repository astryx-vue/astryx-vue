<script setup lang="ts" generic="T extends SearchableItem">
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { CommandPaletteEmits, CommandPaletteProps, CommandPaletteSlots } from './types.js'
import { computed, provide, ref, useId, watch } from 'vue'
import { useAnnounce, useAsyncSource } from '../composables/index.js'
import Dialog from '../Dialog/Dialog.vue'
import { useAstryxMessages } from '../locale/index.js'
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
const messages = useAstryxMessages()
const announce = useAnnounce()
const search = ref('')
const highlightedIndex = ref(-1)
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

const showEmpty = computed(() => items.value.length === 0 && results.status.value !== 'loading' && results.status.value !== 'idle')
const emptyText = computed(() => {
  if (search.value.trim() === '')
    return props.emptyBootstrapText ?? messages.value.commandPalette.emptyBootstrap
  return props.emptySearchText ?? messages.value.commandPalette.emptySearch
})

function setSearch(next: string): void {
  search.value = next
}

function setHighlightedIndex(index: number): void {
  highlightedIndex.value = index
}

function close(): void {
  results.cancel()
  search.value = ''
  highlightedIndex.value = -1
  announce('')
  emit('openChange', false)
}

function selectItem(item: SearchableItem): void {
  if (item.disabled)
    return
  value.value = item.id
  close()
}

function onKeyDown(event: KeyboardEvent): void {
  if (event.isComposing || event.key === 'Process')
    return
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
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

  const direction = event.key === 'ArrowDown'
    ? 'next'
    : event.key === 'ArrowUp'
      ? 'previous'
      : event.key === 'Home' || event.key === 'PageUp'
        ? 'first'
        : event.key === 'End' || event.key === 'PageDown'
          ? 'last'
          : null
  if (direction == null)
    return
  event.preventDefault()
  highlightedIndex.value = moveHighlight(items.value, highlightedIndex.value, direction)
}

function onOpenChange(open: boolean): void {
  if (!open)
    close()
  else
    emit('openChange', true)
}

watch(items, (list) => {
  if (search.value.trim() === '' && value.value) {
    highlightedIndex.value = list.findIndex(item => item.id === value.value && !item.disabled)
    return
  }
  highlightedIndex.value = -1
})

watch([() => results.status.value, items, search], () => {
  if (!props.isOpen || search.value.trim() === '')
    return
  if (results.status.value === 'loading') {
    announce(messages.value.commandPalette.loading)
    return
  }
  if (results.status.value === 'empty')
    announce(messages.value.commandPalette.noResultsFor(search.value))
  else if (results.status.value === 'ready')
    announce(messages.value.commandPalette.resultCount(items.value.length))
})

watch(() => props.isOpen, (open) => {
  if (!open) {
    results.cancel()
    search.value = ''
    highlightedIndex.value = -1
  }
})

provide(commandPaletteKey, {
  highlightedIndex,
  isBusy,
  isInline,
  items,
  listId,
  onKeyDown,
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
    role="dialog"
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
        <CommandPaletteEmpty v-if="showEmpty">
          {{ emptyText }}
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
