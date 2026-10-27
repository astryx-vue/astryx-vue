<script setup lang="ts">
import type { SideNavItemCollapsible, SideNavItemEmits, SideNavItemProps, SideNavItemSlots } from './types.js'
import { computed, getCurrentInstance, provide, ref, useAttrs, useId, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import { useAstryxMessages } from '../locale/index.js'
import NavItem from '../NavItem/NavItem.vue'
import NavDisclosure from '../NavMenu/NavDisclosure.vue'
import Tooltip from '../Tooltip/Tooltip.vue'
import { sideNavCollapseKey, useSideNavCollapse } from './context.js'
import '../../styles/side-nav.css'

defineOptions({ name: 'AstryxSideNavItem', inheritAttrs: false })

const props = withDefaults(defineProps<SideNavItemProps>(), {
  collapsible: undefined,
  isDisabled: false,
  isSelected: false,
  size: 'md',
})

const emit = defineEmits<SideNavItemEmits>()
defineSlots<SideNavItemSlots>()
const slots = useSlots()
const attrs = useAttrs()
const accessibleLabel = computed(() => {
  const given = attrs['aria-label']
  if (typeof given === 'string' && given.trim() !== '')
    return given
  return props.label
})
const collapse = useSideNavCollapse()
const messages = useAstryxMessages()
const instance = getCurrentInstance()
const childrenId = `astryx-side-nav-children-${useId()}`
const labelId = `${childrenId}-label`
const localNested = ref(false)

const config = computed<SideNavItemCollapsible>(() =>
  typeof props.collapsible === 'object' ? props.collapsible : {},
)
const hasChildren = computed(() => slots.default != null)
const sidebarCollapsed = computed(() => collapse.isCollapsed.value)
const hasIcon = computed(() => Boolean(props.iconClass || props.selectedIconClass || slots.icon || slots.selectedIcon))
const canNest = computed(() => hasChildren.value && props.collapsible !== false)
const hasClickListener = computed(() => {
  const vnodeProps = instance?.vnode.props
  return vnodeProps?.onClick != null
})
const splitToggle = computed(() =>
  canNest.value && !sidebarCollapsed.value && (Boolean(props.href) || hasClickListener.value),
)
const nestedCollapsed = computed(() => {
  if (!canNest.value)
    return false
  if (props.collapsible !== undefined && typeof props.collapsible === 'object' && config.value.isCollapsed !== undefined)
    return config.value.isCollapsed
  return localNested.value
})

if (typeof props.collapsible === 'object' && props.collapsible.defaultIsCollapsed)
  localNested.value = true

// 下级只在父项展开，或在收起后的弹出层里出现，所以不再跟随侧栏的图标态。
provide(sideNavCollapseKey, {
  isCollapsed: ref(false),
  isCollapsible: ref(false),
  navId: collapse.navId,
  toggle: () => {},
})

function setNested(next: boolean): void {
  if (config.value.isCollapsed === undefined)
    localNested.value = next
}

function toggleNested(): void {
  setNested(!nestedCollapsed.value)
}

function onActivate(event: MouseEvent): void {
  if (props.isDisabled) {
    event.preventDefault()
    return
  }
  if (canNest.value && !splitToggle.value && !sidebarCollapsed.value) {
    event.preventDefault()
    toggleNested()
  }
  emit('click', event)
}

const toggleLabel = computed(() =>
  nestedCollapsed.value
    ? messages.value.nav.expandItem(props.label)
    : messages.value.nav.collapseItem(props.label),
)
</script>

<template>
  <template v-if="sidebarCollapsed">
    <Tooltip v-if="hasIcon && !hasChildren" :content="label" placement="end">
      <NavItem
        v-bind="attrs"
        block
        is-icon-only
        :aria-label="accessibleLabel"
        :as="as"
        :href="href"
        :icon-class="iconClass"
        :is-disabled="isDisabled"
        :is-selected="isSelected"
        :label="label"
        :rel="rel"
        :selected-icon-class="selectedIconClass"
        :size="size"
        :target="target"
        @click="onActivate"
      >
        <template v-if="$slots.icon" #icon>
          <slot name="icon" />
        </template>
        <template v-if="$slots.selectedIcon" #selectedIcon>
          <slot name="selectedIcon" />
        </template>
      </NavItem>
    </Tooltip>
    <NavDisclosure
      v-else-if="hasIcon"
      hover
      placement="end"
      alignment="start"
      :label="messages.nav.submenu(label)"
    >
      <template #trigger="{ isOpen, panelId }">
        <button
          type="button"
          class="astryx-nav-item astryx-nav-item--block astryx-nav-item--icon-only"
          :class="[
            `astryx-nav-item--${size}`,
            { 'astryx-nav-item--selected': isSelected },
          ]"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="panelId"
          aria-haspopup="menu"
          :aria-label="accessibleLabel"
        >
          <span class="astryx-nav-item__icon" aria-hidden="true">
            <span v-if="iconClass" class="astryx-nav-item__glyph" :class="isSelected && selectedIconClass ? selectedIconClass : iconClass" />
            <slot v-else name="icon" />
          </span>
        </button>
      </template>
      <template #default>
        <div class="astryx-side-nav-item__popover" role="group" :aria-label="label">
          <div class="astryx-side-nav-item__popover-title">
            {{ label }}
          </div>
          <slot />
        </div>
      </template>
    </NavDisclosure>
  </template>
  <div v-else class="astryx-side-nav-item">
    <div class="astryx-side-nav-item__main">
      <div v-if="splitToggle" class="astryx-nav-item astryx-nav-item--block" :class="[`astryx-nav-item--${size}`, { 'astryx-nav-item--selected': isSelected }]">
        <NavItem
          v-bind="attrs"
          plain
          class="astryx-side-nav-item__split"
          :as="as"
          :href="href"
          :icon-class="iconClass"
          :is-disabled="isDisabled"
          :is-selected="isSelected"
          :label="label"
          :rel="rel"
          :selected-icon-class="selectedIconClass"
          :size="size"
          :target="target"
          @click="onActivate"
        >
          <template v-if="$slots.icon" #icon>
            <slot name="icon" />
          </template>
          <template v-if="$slots.selectedIcon" #selectedIcon>
            <slot name="selectedIcon" />
          </template>
          <template v-if="$slots.end" #end>
            <slot name="end" />
          </template>
        </NavItem>
        <button
          type="button"
          class="astryx-side-nav-item__toggle"
          :aria-expanded="nestedCollapsed ? 'false' : 'true'"
          :aria-controls="childrenId"
          :aria-label="toggleLabel"
          @click.stop="toggleNested"
        >
          <Icon
            icon="chevronDown"
            size="sm"
            class="astryx-side-nav-item__chevron"
            :class="{ 'astryx-side-nav-item__chevron--open': !nestedCollapsed }"
          />
        </button>
      </div>
      <NavItem
        v-else
        v-bind="attrs"
        block
        :as="as"
        :controls="canNest ? childrenId : undefined"
        :expanded="canNest ? !nestedCollapsed : undefined"
        :href="href"
        :icon-class="iconClass"
        :is-disabled="isDisabled"
        :is-selected="isSelected"
        :label="label"
        :rel="rel"
        :selected-icon-class="selectedIconClass"
        :size="size"
        :target="target"
        @click="onActivate"
      >
        <template v-if="$slots.icon" #icon>
          <slot name="icon" />
        </template>
        <template v-if="$slots.selectedIcon" #selectedIcon>
          <slot name="selectedIcon" />
        </template>
        <template v-if="$slots.end || canNest" #end>
          <slot name="end" />
          <Icon
            v-if="canNest"
            icon="chevronDown"
            size="sm"
            class="astryx-side-nav-item__chevron"
            :class="{ 'astryx-side-nav-item__chevron--open': !nestedCollapsed }"
          />
        </template>
      </NavItem>
      <div v-if="$slots.actions" class="astryx-side-nav-item__actions">
        <slot name="actions" />
      </div>
    </div>
    <div
      v-if="hasChildren"
      :id="childrenId"
      class="astryx-side-nav-item__children"
      :class="{ 'astryx-side-nav-item__children--collapsed': nestedCollapsed }"
      role="group"
      :aria-labelledby="labelId"
      :aria-hidden="nestedCollapsed ? 'true' : undefined"
      :inert="nestedCollapsed || undefined"
    >
      <div class="astryx-side-nav-item__children-inner">
        <span :id="labelId" class="astryx-visually-hidden">{{ label }}</span>
        <slot />
      </div>
    </div>
  </div>
</template>
