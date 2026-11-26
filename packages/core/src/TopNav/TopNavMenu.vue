<script setup lang="ts">
import type { TopNavMenuEmits, TopNavMenuProps } from './types.js'
import { inject, ref, useId } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useCloseMobileDrawer } from '../MobileNav/closeOnActivate.js'
import { mobileNavKey } from '../MobileNav/context.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import NavMenu from '../NavMenu/NavMenu.vue'
import NavMenuItem from '../NavMenu/NavMenuItem.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMenu' })

withDefaults(defineProps<TopNavMenuProps>(), {
  hideDelay: 200,
  showDelay: 150,
})

const emit = defineEmits<TopNavMenuEmits>()
const inDrawer = inject(mobileNavKey, false)
const closeMobileDrawer = useCloseMobileDrawer()
const expanded = ref(false)
const drawerItemsId = `astryx-top-nav-menu-items-${useId()}`
</script>

<template>
  <div v-if="inDrawer" class="astryx-top-nav-menu astryx-top-nav-menu--drawer">
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
    <div
      :id="drawerItemsId"
      class="astryx-top-nav-drawer-section"
      :class="{ 'astryx-top-nav-drawer-section--collapsed': !expanded }"
      :aria-hidden="expanded ? undefined : 'true'"
      :inert="expanded ? undefined : true"
    >
      <div class="astryx-top-nav-drawer-section__inner">
        <div class="astryx-top-nav-menu__drawer-items">
          <NavMenuItem
            v-for="item in items"
            :key="item.id ?? item.label"
            :description="item.description"
            :href="item.href"
            :icon-class="item.iconClass"
            :is-disabled="item.isDisabled"
            :is-menu-item="false"
            :label="item.label"
            @click="closeMobileDrawer"
          />
          <slot />
        </div>
      </div>
    </div>
  </div>
  <NavDisclosure
    v-else
    hover
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
    <template #default="{ close, focusRequest }">
      <NavMenu :focus-request="focusRequest" :label="label" @close="close">
        <NavMenuItem
          v-for="item in items"
          :key="item.id ?? item.label"
          :description="item.description"
          :href="item.href"
          :icon-class="item.iconClass"
          :is-disabled="item.isDisabled"
          :keep-open="item.hasCloseOnSelect === false"
          :label="item.label"
        />
        <slot />
      </NavMenu>
    </template>
  </NavDisclosure>
</template>
