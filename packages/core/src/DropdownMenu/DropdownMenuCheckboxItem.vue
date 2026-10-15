<script setup lang="ts">
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps, DropdownMenuCheckboxItemSlots } from './types.js'
import { computed, useSlots } from 'vue'
import Icon from '../Icon/Icon.vue'
import Item from '../List/Item.vue'
import MenuSelectionMark from './MenuSelectionMark.vue'
import { useMenuSelectableRow } from './useMenuSelectableRow.js'
import '../../styles/dropdown-menu.css'

defineOptions({ name: 'AstryxDropdownMenuCheckboxItem', inheritAttrs: false })

const props = withDefaults(defineProps<Omit<DropdownMenuCheckboxItemProps, 'modelValue'>>(), {
  isDisabled: false,
  hasCloseOnSelect: false,
})

const emit = defineEmits<DropdownMenuCheckboxItemEmits>()
defineSlots<DropdownMenuCheckboxItemSlots>()
const checked = defineModel<boolean>('modelValue', { required: true })

const slots = useSlots()
const {
  controlSize,
  density,
  handleClick,
  handlePointerMove,
  inContextMenu,
  menuSize,
} = useMenuSelectableRow({
  hasCloseOnSelect: computed(() => props.hasCloseOnSelect),
  isDisabled: computed(() => props.isDisabled),
  onActivate: () => {
    const next = !checked.value
    checked.value = next
    emit('change', next)
  },
})

const hasStart = computed(() => slots.icon != null || props.icon != null)
const hasLabel = computed(() => slots.label != null || props.label != null)
const hasDescription = computed(() => slots.description != null || props.description != null)
const hasEnd = computed(() => slots.endContent != null)
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/interactive-supports-focus -- The menu owns Enter, Space, and the arrows. tabindex is -1 while the row is enabled and removed while disabled. -->
  <div
    v-if="inContextMenu"
    class="astryx-context-menu-item"
    role="menuitemcheckbox"
    :aria-checked="checked"
    :aria-disabled="isDisabled || undefined"
    :data-disabled="isDisabled || undefined"
    :data-size="menuSize"
    :tabindex="isDisabled ? undefined : -1"
    @click="handleClick"
    @pointermove="handlePointerMove"
  >
    <MenuSelectionMark kind="checkbox" :checked="checked" :is-disabled="isDisabled" :size="controlSize" />
    <span v-if="hasStart" class="astryx-context-menu-item__start">
      <slot name="icon">
        <Icon color="secondary" :icon="icon" size="sm" />
      </slot>
    </span>
    <span class="astryx-context-menu-item__content">
      <span v-if="hasLabel" class="astryx-context-menu-item__label" data-menu-item-label>
        <slot name="label">{{ label }}</slot>
      </span>
      <span v-if="hasDescription" class="astryx-context-menu-item__description">
        <slot name="description">{{ description }}</slot>
      </span>
    </span>
    <span v-if="hasEnd" class="astryx-context-menu-item__end">
      <slot name="endContent" />
    </span>
  </div>

  <Item
    v-else
    class="astryx-dropdown-menu-item"
    role="menuitemcheckbox"
    :aria-checked="checked"
    :data-menu-size="menuSize"
    data-variant="default"
    :density="density"
    :description="description"
    :is-disabled="isDisabled"
    :label="label"
    :on-click="handleClick"
    :tabindex="isDisabled ? undefined : -1"
    @pointermove="handlePointerMove"
  >
    <template #marker>
      <MenuSelectionMark kind="checkbox" :checked="checked" :is-disabled="isDisabled" :size="controlSize" />
    </template>
    <template v-if="hasStart" #startContent>
      <slot name="icon">
        <Icon color="secondary" :icon="icon" size="sm" />
      </slot>
    </template>
    <template v-if="slots.label" #label>
      <slot name="label" />
    </template>
    <template v-if="slots.description" #description>
      <slot name="description" />
    </template>
    <template v-if="hasEnd" #endContent>
      <slot name="endContent" />
    </template>
  </Item>
</template>
