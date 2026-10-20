<script setup lang="ts">
import type { SideNavCollapseButtonEmits, SideNavCollapseButtonProps, SideNavCollapseButtonSlots } from './types.js'
import { computed, inject } from 'vue'
import Button from '../Button/Button.vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { sideNavCollapseKey, useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavCollapseButton' })

const props = withDefaults(defineProps<SideNavCollapseButtonProps>(), {
  // An explicit `undefined` default keeps an omitted boolean at `undefined`:
  // Vue would cast a boolean without a default to `false`.
  isCollapsed: undefined,
  collapsible: undefined,
  size: undefined,
})
const emit = defineEmits<SideNavCollapseButtonEmits>()
defineSlots<SideNavCollapseButtonSlots>()
const collapse = useSideNavCollapse()
const messages = useAstryxMessages()

const inSideNav = inject(sideNavCollapseKey, null) !== null
/** The controlled config handed in from outside; it outranks `v-model:isCollapsed`. */
const controlled = computed(() => props.collapsible ?? null)
const usingModel = computed(() => props.isCollapsed !== undefined)
const visible = computed(() => controlled.value != null || usingModel.value || collapse.isCollapsible.value)
const collapsed = computed(() => {
  if (controlled.value != null)
    return Boolean(controlled.value.isCollapsed)
  return usingModel.value ? Boolean(props.isCollapsed) : collapse.isCollapsed.value
})
const size = computed(() => props.size ?? (inSideNav ? 'sm' : 'md'))
const label = computed(() => {
  if (props.label)
    return props.label
  return collapsed.value ? messages.value.nav.expandSidebar : messages.value.nav.collapseSidebar
})
/** A visible label turns the icon-only square into a text button. */
const hasVisibleLabel = computed(() => Boolean(props.label))

function onClick(): void {
  if (controlled.value != null)
    controlled.value.onCollapsedChange(!collapsed.value)
  else if (usingModel.value)
    emit('update:isCollapsed', !collapsed.value)
  else
    collapse.toggle()
}
</script>

<template>
  <Button
    v-if="visible"
    class="astryx-side-nav-collapse"
    :label="label"
    :size="size"
    :is-icon-only="!hasVisibleLabel"
    variant="ghost"
    :aria-expanded="collapsed ? 'false' : 'true'"
    :aria-controls="collapse.navId || undefined"
    @click="onClick"
  >
    <template #icon>
      <slot>
        <span class="astryx-side-nav-collapse__mirror" aria-hidden="true">
          <Icon
            icon="chevronLeft"
            size="sm"
            class="astryx-side-nav-collapse__chevron"
            :class="{ 'astryx-side-nav-collapse__chevron--collapsed': collapsed }"
          />
        </span>
      </slot>
    </template>
  </Button>
</template>
