<script setup lang="ts">
import type { TopNavMegaMenuEmits, TopNavMegaMenuProps, TopNavMegaMenuSlots } from './types.js'
import { inject, ref, useId } from 'vue'
import Icon from '../Icon/Icon.vue'
import { mobileNavKey } from '../MobileNav/context.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import TopNavMegaMenuPanel from './TopNavMegaMenuPanel.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenu' })

withDefaults(defineProps<TopNavMegaMenuProps>(), {
  hideDelay: 250,
  showDelay: 150,
})

const emit = defineEmits<TopNavMegaMenuEmits>()
defineSlots<TopNavMegaMenuSlots>()

const inDrawer = inject(mobileNavKey, false)
const expanded = ref(false)
const drawerItemsId = `astryx-top-nav-mega-items-${useId()}`
</script>

<template>
  <div v-if="inDrawer" class="astryx-top-nav-mega astryx-top-nav-mega--drawer">
    <button
      type="button"
      class="astryx-top-nav-menu__drawer-trigger"
      :aria-controls="drawerItemsId"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="expanded = !expanded"
    >
      <span>{{ label }}</span>
      <Icon icon="chevronDown" size="sm" :class="{ 'astryx-top-nav-menu__chevron--open': expanded }" />
    </button>
    <div v-show="expanded" :id="drawerItemsId" class="astryx-top-nav-mega__drawer">
      <div class="astryx-top-nav-mega__drawer-items">
        <slot />
      </div>
      <div v-if="$slots.featured" class="astryx-top-nav-mega__featured">
        <slot name="featured" />
      </div>
    </div>
  </div>
  <NavDisclosure
    v-else
    hover
    panel-class="astryx-top-nav-mega__panel"
    :hide-delay="hideDelay"
    :label="label"
    :show-delay="showDelay"
    @open-change="emit('openChange', $event)"
  >
    <template #trigger="{ isOpen, panelId }">
      <button
        type="button"
        class="astryx-top-nav-menu__trigger"
        :data-open="isOpen || undefined"
        :aria-expanded="isOpen ? 'true' : 'false'"
        :aria-controls="panelId"
        aria-haspopup="menu"
      >
        <span>{{ label }}</span>
        <Icon icon="chevronDown" size="sm" class="astryx-top-nav-menu__chevron" :class="{ 'astryx-top-nav-menu__chevron--open': isOpen }" />
      </button>
    </template>
    <template #default="{ focusRequest }">
      <TopNavMegaMenuPanel :focus-request="focusRequest" :label="label">
        <slot />
        <template #featured>
          <slot name="featured" />
        </template>
      </TopNavMegaMenuPanel>
    </template>
  </NavDisclosure>
</template>
