<script setup lang="ts">
import type { SideNavCollapseButtonEmits, SideNavCollapseButtonProps } from './types.js'
import { computed } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import { useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavCollapseButton' })

const props = withDefaults(defineProps<SideNavCollapseButtonProps>(), {
  isCollapsed: undefined,
})
const emit = defineEmits<SideNavCollapseButtonEmits>()
const collapse = useSideNavCollapse()
const messages = useAstryxMessages()

const usingModel = computed(() => props.isCollapsed !== undefined)
const visible = computed(() => usingModel.value || collapse.isCollapsible.value)
const collapsed = computed(() => usingModel.value ? Boolean(props.isCollapsed) : collapse.isCollapsed.value)
const label = computed(() => {
  if (props.label)
    return props.label
  return collapsed.value ? messages.value.nav.expandSidebar : messages.value.nav.collapseSidebar
})

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
    :aria-label="label"
    :aria-expanded="collapsed ? 'false' : 'true'"
    :aria-controls="collapse.navId || undefined"
    @click="onClick"
  >
    <span class="astryx-side-nav-collapse__mirror" aria-hidden="true">
      <Icon
        icon="chevronLeft"
        size="sm"
        class="astryx-side-nav-collapse__chevron"
        :class="{ 'astryx-side-nav-collapse__chevron--collapsed': collapsed }"
      />
    </span>
  </button>
</template>
