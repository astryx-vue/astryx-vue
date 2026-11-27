<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TypeaheadMenuEntry } from '../Typeahead/useTypeaheadMenu.js'
import type { PowerSearchLookup } from './config.js'
import type { PowerSearchItem } from './types.js'
import { nextTick, useTemplateRef, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useScrollbars } from '../Scrollbars/useScrollbars.js'
import { scrollOptionIntoView } from '../Typeahead/useAnchoredListbox.js'
import { powerSearchGroupLabel, powerSearchItemIcon } from './menuPresentation.js'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxPowerSearchListbox' })

const props = defineProps<{
  id: string
  isOpen: boolean
  entries: readonly TypeaheadMenuEntry<PowerSearchItem>[]
  activeIndex: number
  label: string
  emptyText: string
  placement: string
  menuStyle: CSSProperties
  lookup: PowerSearchLookup
}>()

const emit = defineEmits<{
  highlight: [index: number]
  pick: [item: PowerSearchItem]
}>()

const listboxRef = useTemplateRef<HTMLElement>('listboxRef')
useScrollbars(listboxRef)

watch(() => props.activeIndex, (index) => {
  if (!props.isOpen || index < 0)
    return
  void nextTick(() => scrollOptionIntoView(listboxRef.value, props.entries[index]?.id))
})

function onHover(index: number): void {
  if (!props.entries[index]?.disabled)
    emit('highlight', index)
}

defineExpose({ element: listboxRef })
</script>

<template>
  <Teleport to="body">
    <div
      v-show="isOpen"
      :id="id"
      ref="listboxRef"
      class="astryx-typeahead-listbox astryx-layer"
      role="listbox"
      :aria-label="label"
      :data-placement="placement"
      :style="menuStyle"
      tabindex="-1"
    >
      <div class="astryx-typeahead-menu" role="presentation">
        <div v-if="entries.length === 0" class="astryx-typeahead-state">
          {{ emptyText }}
        </div>
        <div v-else class="astryx-typeahead-options" role="presentation">
          <template v-for="(entry, index) in entries" :key="entry.id">
            <div v-if="powerSearchGroupLabel(entries, index)" class="astryx-power-search-menu-group">
              {{ powerSearchGroupLabel(entries, index) }}
            </div>
            <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/mouse-events-have-key-events -- 选项不进 Tab 序。 -->
            <div
              :id="`${id}-option-${index}`"
              class="astryx-typeahead-option"
              :class="{ 'is-active': index === activeIndex, 'is-disabled': entry.disabled }"
              role="option"
              :aria-selected="index === activeIndex ? 'true' : 'false'"
              :data-option-id="entry.id"
              tabindex="-1"
              @mousedown.prevent
              @mouseenter="onHover(index)"
              @click="emit('pick', entry.item)"
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
  </Teleport>
</template>
