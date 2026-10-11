<script setup lang="ts">
import type { NavLinkComponent } from '../NavItem/types.js'
import type { OverflowListItem } from './types.js'
import { computed } from 'vue'
import { useAstryxMessages } from '../locale/index.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import NavMenu from '../NavMenu/NavMenu.vue'
import NavMenuItem from '../NavMenu/NavMenuItem.vue'
import '../../styles/overflow-list.css'

defineOptions({ name: 'AstryxOverflowMore' })

const props = defineProps<{
  items: readonly OverflowListItem[]
  as?: NavLinkComponent
}>()

const emit = defineEmits<{
  select: [item: OverflowListItem, event: MouseEvent]
}>()

const messages = useAstryxMessages()
const label = computed(() => messages.value.nav.more)
const description = computed(() => messages.value.nav.moreItems(props.items.length))

function itemKey(item: OverflowListItem): string {
  return item.id ?? item.label
}
</script>

<template>
  <NavDisclosure :label="description">
    <template #trigger="{ isOpen, panelId }">
      <button
        type="button"
        class="astryx-overflow-list__more"
        :aria-label="description"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        aria-haspopup="menu"
      >
        {{ label }}
      </button>
    </template>
    <template #default="{ close, focusRequest }">
      <NavMenu :label="description" :focus-request="focusRequest" @close="close">
        <NavMenuItem
          v-for="item in items"
          :key="itemKey(item)"
          :as="as"
          :href="item.href"
          :icon-class="item.iconClass"
          :is-disabled="item.isDisabled"
          :label="item.label"
          @click="emit('select', item, $event)"
        />
      </NavMenu>
    </template>
  </NavDisclosure>
</template>
