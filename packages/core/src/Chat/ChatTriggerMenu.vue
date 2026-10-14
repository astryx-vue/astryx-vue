<script setup lang="ts">
import type { CSSProperties, VNode } from 'vue'
import type { SearchableItem } from '../composables/useAsyncSource.js'
import type { SearchItemGroup } from './groupSearchItems.js'
import { computed, ref, watch } from 'vue'
import { useDismiss } from '../composables/useDismiss.js'
import { usePositionedLayer } from '../layer/usePositionedLayer.js'
import { groupSearchItems } from './groupSearchItems.js'
import '../../styles/popover.css'
import '../../styles/chat.css'

const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
  listboxId: string
  label: string
  items: SearchableItem[]
  highlightedIndex: number
  loading: boolean
  loadingText: string
  empty: string | VNode | null
  keyboardMove: boolean
  renderItem?: (item: SearchableItem) => VNode
}>()

const emit = defineEmits<{
  select: [item: SearchableItem]
  hover: [index: number]
  dismiss: []
}>()

const surfaceRef = ref<HTMLElement | null>(null)
const open = computed(() => props.open)
const anchorWritable = ref<HTMLElement | null>(null)

watch(() => props.anchor, (value) => {
  anchorWritable.value = value
}, { immediate: true })

const { position } = usePositionedLayer({
  anchor: anchorWritable,
  layer: surfaceRef,
  isOpen: open,
  placement: computed(() => 'above' as const),
  alignment: computed(() => 'start' as const),
  gap: 4,
})

useDismiss({
  container: surfaceRef,
  trigger: anchorWritable,
  isEnabled: open,
  enableEscape: computed(() => false),
  onDismiss: () => emit('dismiss'),
})

const groups = computed(() => groupSearchItems(props.items))
const style = computed<CSSProperties>(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
}))

function optionId(index: number): string {
  return `${props.listboxId}-option-${index}`
}

function flatIndex(group: SearchItemGroup, indexInGroup: number): number {
  let offset = 0
  for (const entry of groups.value) {
    if (entry === group)
      return offset + indexInGroup
    offset += entry.items.length
  }
  return indexInGroup
}

const emptyView = computed(() => {
  const value = props.empty
  if (value == null || typeof value === 'string')
    return undefined
  return { render: () => value }
})

const itemView = computed(() => {
  const render = props.renderItem
  if (!render)
    return undefined
  return {
    props: ['item'],
    setup(viewProps: { item: SearchableItem }) {
      return () => render(viewProps.item)
    },
  }
})

watch(() => props.highlightedIndex, (index) => {
  if (!props.open || !props.keyboardMove || index < 0)
    return
  document.getElementById(optionId(index))?.scrollIntoView({ block: 'nearest' })
})

function onSelect(item: SearchableItem, event: MouseEvent): void {
  event.preventDefault()
  emit('select', item)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-show="open"
      ref="surfaceRef"
      class="astryx-popover astryx-chat-trigger"
      data-placement="above"
      :style="style"
    >
      <div
        :id="listboxId"
        class="astryx-chat-trigger__list"
        role="listbox"
        :aria-label="label"
      >
        <div v-if="loading" class="astryx-chat-trigger__status" role="status">
          {{ loadingText }}
        </div>
        <div v-else-if="items.length === 0 && empty !== ''" class="astryx-chat-trigger__status">
          <template v-if="typeof empty === 'string'">
            {{ empty }}
          </template>
          <component :is="emptyView" v-else-if="emptyView" />
        </div>
        <template v-else>
          <template v-for="group in groups" :key="group.heading ?? 'ungrouped'">
            <div v-if="group.heading" role="group" :aria-label="group.heading">
              <div class="astryx-chat-trigger__heading" aria-hidden="true">
                {{ group.heading }}
              </div>
              <div
                v-for="(item, index) in group.items"
                :id="optionId(flatIndex(group, index))"
                :key="item.id"
                class="astryx-chat-trigger__item"
                role="option"
                :aria-selected="flatIndex(group, index) === highlightedIndex"
                :data-highlighted="flatIndex(group, index) === highlightedIndex ? '' : undefined"
                tabindex="-1"
                @mousedown="onSelect(item, $event)"
                @mouseenter="emit('hover', flatIndex(group, index))"
                @focus="emit('hover', flatIndex(group, index))"
              >
                <component :is="itemView" v-if="itemView" :item="item" />
                <span v-else class="astryx-chat-trigger__label">{{ item.label }}</span>
              </div>
            </div>
            <template v-else>
              <div
                v-for="(item, index) in group.items"
                :id="optionId(flatIndex(group, index))"
                :key="item.id"
                class="astryx-chat-trigger__item"
                role="option"
                :aria-selected="flatIndex(group, index) === highlightedIndex"
                :data-highlighted="flatIndex(group, index) === highlightedIndex ? '' : undefined"
                tabindex="-1"
                @mousedown="onSelect(item, $event)"
                @mouseenter="emit('hover', flatIndex(group, index))"
                @focus="emit('hover', flatIndex(group, index))"
              >
                <component :is="itemView" v-if="itemView" :item="item" />
                <span v-else class="astryx-chat-trigger__label">{{ item.label }}</span>
              </div>
            </template>
          </template>
        </template>
      </div>
    </div>
  </Teleport>
</template>
