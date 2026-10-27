<script setup lang="ts">
import type { OverflowListEmits, OverflowListItem, OverflowListProps, OverflowListSlots } from './types.js'
import { computed, watch } from 'vue'
import { useOverflow } from '../composables/useOverflow.js'
import { useLinkComponent } from '../LinkProvider/context.js'
import { resolveNavRoot } from '../NavItem/link.js'
import OverflowMore from './OverflowMore.vue'
import '../../styles/overflow-list.css'

defineOptions({ name: 'AstryxOverflowList' })

const props = withDefaults(defineProps<OverflowListProps>(), {
  behavior: 'observeSelf',
  collapseFrom: 'end',
  gap: 2,
  minVisibleItems: 0,
})

const emit = defineEmits<OverflowListEmits>()
defineSlots<OverflowListSlots>()

const linkComponent = useLinkComponent()
/** 自己的 `as` 优先，其次是 LinkProvider 给的默认链接组件。 */
const customLink = computed(() => props.as ?? linkComponent.value)
const gapPx: Record<number, number> = {
  0: 0,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
}
const gapToken = computed(() => String(props.gap).replace('.', '-'))
const { containerRef, measureRef, rowHeight, visibleCount: measuredCount } = useOverflow(
  () => props.items.length,
  {
    behavior: props.behavior,
    collapseFrom: props.collapseFrom,
    gap: gapPx[props.gap] ?? 8,
    maxRows: props.maxRows,
    maxVisibleItems: props.maxVisibleItems,
    minVisibleItems: props.minVisibleItems,
  },
)
// 这两个 ref 只交给模板测量。读一次，避免被当成未使用。
void containerRef.value
void measureRef.value
const count = computed(() => props.visibleCount ?? measuredCount.value)
const visibleItems = computed(() =>
  props.collapseFrom === 'end'
    ? props.items.slice(0, count.value)
    : props.items.slice(props.items.length - count.value),
)
const hiddenItems = computed(() =>
  props.collapseFrom === 'end'
    ? props.items.slice(count.value)
    : props.items.slice(0, Math.max(0, props.items.length - count.value)),
)
const collapsed = computed(() => {
  if (props.collapseFrom === 'end') {
    return hiddenItems.value.map((item, offset) => ({
      item,
      index: count.value + offset,
    }))
  }
  return hiddenItems.value.map((item, index) => ({ item, index }))
})
const collapsedKey = computed(() => collapsed.value
  .map(entry => `${entry.index}:${entry.item.id ?? entry.item.label}`)
  .join('|'))

let announcedOverflow = false
watch(collapsedKey, (key) => {
  if (key === '' && !announcedOverflow)
    return
  announcedOverflow = true
  emit('overflowChange', collapsed.value)
}, { immediate: true })
const multiRow = computed(() => props.maxRows != null && props.maxRows > 1)
const listStyle = computed(() => {
  const style: Record<string, string> = {
    '--astryx-overflow-gap': `var(--astryx-spacing-${gapToken.value})`,
  }
  if (multiRow.value && rowHeight.value > 0 && props.maxRows != null) {
    const gap = gapPx[props.gap] ?? 8
    style.maxHeight = `${rowHeight.value * props.maxRows + gap * (props.maxRows - 1)}px`
  }
  return style
})

function itemKey(item: OverflowListItem, index: number): string {
  return item.id ?? `${item.label}-${index}`
}

function onSelect(item: OverflowListItem, event: MouseEvent): void {
  if (item.isDisabled) {
    event.preventDefault()
    return
  }
  emit('select', item, event)
}
</script>

<template>
  <div class="astryx-overflow-list" :class="{ 'astryx-overflow-list--wrap': multiRow }">
    <div ref="measureRef" class="astryx-overflow-list__measure" aria-hidden="true" inert>
      <div v-for="(item, index) in items" :key="itemKey(item, index)">
        <slot name="item" :item="item" :index="index">
          <span class="astryx-overflow-list__chip">{{ item.label }}</span>
        </slot>
      </div>
      <div data-overflow-indicator>
        <!-- 和原版一致，测量用户真实的 overflow 内容（按最多项数渲染，保证留出最大宽度），
             不再用内置文案估算。 -->
        <slot name="overflow" :items="items">
          <OverflowMore :as="as" :items="items" @select="onSelect" />
        </slot>
      </div>
    </div>

    <div ref="containerRef" class="astryx-overflow-list__row" :style="listStyle">
      <slot v-if="collapseFrom === 'start' && hiddenItems.length" name="overflow" :items="hiddenItems">
        <OverflowMore :as="as" :items="hiddenItems" @select="onSelect" />
      </slot>
      <div v-for="(item, index) in visibleItems" :key="itemKey(item, index)" class="astryx-overflow-list__item">
        <slot name="item" :item="item" :index="index">
          <component
            :is="resolveNavRoot(item.href, Boolean(item.isDisabled), customLink)"
            class="astryx-overflow-list__chip"
            :href="item.href && !item.isDisabled ? item.href : undefined"
            :to="item.href && customLink != null && !item.isDisabled ? item.href : undefined"
            :type="item.href && !item.isDisabled ? undefined : 'button'"
            :disabled="item.isDisabled || undefined"
            @click="onSelect(item, $event)"
          >
            <span v-if="item.iconClass" class="astryx-overflow-list__glyph" :class="item.iconClass" aria-hidden="true" />
            {{ item.label }}
          </component>
        </slot>
      </div>
      <slot v-if="collapseFrom !== 'start' && hiddenItems.length" name="overflow" :items="hiddenItems">
        <OverflowMore :as="as" :items="hiddenItems" @select="onSelect" />
      </slot>
    </div>
  </div>
</template>
