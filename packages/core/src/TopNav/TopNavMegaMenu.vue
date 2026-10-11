<script setup lang="ts">
import type { TopNavMegaMenuEmits, TopNavMegaMenuProps } from './types.js'
import { inject, ref } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import Icon from '../Icon/Icon.vue'
import { mobileNavKey } from '../MobileNav/context.js'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenu' })

withDefaults(defineProps<TopNavMegaMenuProps>(), {
  hideDelay: 250,
  showDelay: 150,
})

const emit = defineEmits<TopNavMegaMenuEmits>()
const inDrawer = inject(mobileNavKey, false)
const expanded = ref(false)
const { listRef, handleKeyDown } = useListFocus({
  hasHomeEnd: true,
  itemSelector: '.astryx-top-nav-mega-item',
  orientation: 'both',
  wrap: true,
})
void listRef.value
</script>

<template>
  <div v-if="inDrawer" class="astryx-top-nav-mega astryx-top-nav-mega--drawer">
    <button
      type="button"
      class="astryx-top-nav-menu__drawer-trigger"
      :aria-expanded="expanded ? 'true' : 'false'"
      @click="expanded = !expanded"
    >
      <span>{{ label }}</span>
      <Icon icon="chevronDown" size="sm" :class="{ 'astryx-top-nav-menu__chevron--open': expanded }" />
    </button>
    <div v-show="expanded" class="astryx-top-nav-mega__drawer">
      <div class="astryx-top-nav-mega__items">
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
    <template #default>
      <div class="astryx-top-nav-mega__layout">
        <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键从内部链接冒泡上来；这一层只负责在大菜单里移动焦点。 -->
        <div
          ref="listRef"
          class="astryx-top-nav-mega__items"
          role="group"
          :aria-label="label"
          @keydown="handleKeyDown"
        >
          <slot />
        </div>
        <div v-if="$slots.featured" class="astryx-top-nav-mega__featured">
          <slot name="featured" />
        </div>
      </div>
    </template>
  </NavDisclosure>
</template>
