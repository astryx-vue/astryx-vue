<script setup lang="ts">
import type { SideNavSectionProps, SideNavSectionSlots } from './types.js'
import { computed, useId } from 'vue'
import { useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'
import '../../styles/visually-hidden.css'

defineOptions({ name: 'AstryxSideNavSection' })

const props = withDefaults(defineProps<SideNavSectionProps>(), {
  isHeaderHidden: false,
})

defineSlots<SideNavSectionSlots>()

const collapse = useSideNavCollapse()
const titleId = `astryx-side-nav-section-${useId()}`
const hideHeader = computed(() => props.isHeaderHidden || collapse.isCollapsed.value)
</script>

<template>
  <div class="astryx-side-nav-section" role="group" :aria-labelledby="titleId">
    <div
      class="astryx-side-nav-section__header"
      :class="{ 'astryx-visually-hidden': hideHeader }"
    >
      <span class="astryx-side-nav-section__titles">
        <span :id="titleId" class="astryx-side-nav-section__title">{{ title }}</span>
        <span v-if="subtitle" class="astryx-side-nav-section__subtitle">{{ subtitle }}</span>
      </span>
      <span v-if="$slots.end" class="astryx-side-nav-section__end">
        <slot name="end" />
      </span>
    </div>
    <div class="astryx-side-nav-section__items">
      <slot />
    </div>
  </div>
</template>
