<script setup lang="ts">
import type { SideNavCollapseButtonEmits, SideNavCollapseButtonProps, SideNavCollapseButtonSlots } from './types.js'
import { computed, inject } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { sideNavCollapseKey, useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavCollapseButton' })

const props = withDefaults(defineProps<SideNavCollapseButtonProps>(), {
  // An explicit `undefined` default keeps an omitted boolean at `undefined`:
  // Vue would cast a boolean without a default to `false`.
  isCollapsed: undefined,
  size: undefined,
})
const emit = defineEmits<SideNavCollapseButtonEmits>()
defineSlots<SideNavCollapseButtonSlots>()
const collapse = useSideNavCollapse()
const messages = useAstryxMessages()

const inSideNav = inject(sideNavCollapseKey, null) !== null
const usingModel = computed(() => props.isCollapsed !== undefined)
const visible = computed(() => usingModel.value || collapse.isCollapsible.value)
const collapsed = computed(() => usingModel.value ? Boolean(props.isCollapsed) : collapse.isCollapsed.value)
const size = computed(() => props.size ?? (inSideNav ? 'sm' : 'md'))
const label = computed(() => {
  if (props.label)
    return props.label
  return collapsed.value ? messages.value.nav.expandSidebar : messages.value.nav.collapseSidebar
})
/** A visible label turns the icon-only square into a text button. */
const hasVisibleLabel = computed(() => Boolean(props.label))

function onClick(): void {
  if (usingModel.value)
    emit('update:isCollapsed', !collapsed.value)
  else
    collapse.toggle()
}
</script>

<template>
  <button
    v-if="visible"
    type="button"
    class="astryx-side-nav-collapse"
    :class="{ 'astryx-side-nav-collapse--with-label': hasVisibleLabel }"
    :data-size="size"
    :aria-label="hasVisibleLabel ? undefined : label"
    :aria-expanded="collapsed ? 'false' : 'true'"
    :aria-controls="collapse.navId || undefined"
    @click="onClick"
  >
    <slot>
      <span
        v-if="hasVisibleLabel"
        class="astryx-side-nav-collapse__label"
      >{{ props.label }}</span>
      <span class="astryx-side-nav-collapse__mirror" aria-hidden="true">
        <Icon
          icon="chevronLeft"
          size="sm"
          class="astryx-side-nav-collapse__chevron"
          :class="{ 'astryx-side-nav-collapse__chevron--collapsed': collapsed }"
        />
      </span>
    </slot>
  </button>
</template>
