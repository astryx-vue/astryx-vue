<script setup lang="ts">
import type { TableRowMenuItem } from './types.js'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLayerTeleportTarget } from '../composables/useLayerMountTarget.js'
import Icon from '../Icon/Icon.vue'
import '../../styles/layer.css'

defineOptions({ name: 'AstryxTableRowMenu' })

const props = defineProps<{
  x: number
  y: number
  items: readonly TableRowMenuItem[]
}>()

const emit = defineEmits<{ close: [] }>()

// 浮层挂进最近的挂载点（Dialog 内部），没有就是 body。
const teleportTarget = useLayerTeleportTarget()
const root = ref<HTMLElement | null>(null)
const active = ref(0)

function focusItem(index: number): void {
  const buttons = root.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
  buttons?.[index]?.focus()
}

function onKeydown(event: KeyboardEvent): void {
  const last = props.items.length - 1
  if (event.key === 'Escape') {
    event.preventDefault()
    emit('close')
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    active.value = active.value >= last ? 0 : active.value + 1
    focusItem(active.value)
  }
  else if (event.key === 'ArrowUp') {
    event.preventDefault()
    active.value = active.value <= 0 ? last : active.value - 1
    focusItem(active.value)
  }
  else if (event.key === 'Home') {
    event.preventDefault()
    active.value = 0
    focusItem(0)
  }
  else if (event.key === 'End') {
    event.preventDefault()
    active.value = last
    focusItem(last)
  }
}

function onPointerDown(event: PointerEvent): void {
  const target = event.target
  if (target instanceof Node && root.value?.contains(target))
    return
  emit('close')
}

function choose(item: TableRowMenuItem): void {
  item.onSelect()
  emit('close')
}

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  void nextTick(() => focusItem(0))
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
})
</script>

<template>
  <Teleport :to="teleportTarget">
    <div
      ref="root"
      class="astryx-table-menu astryx-layer"
      role="menu"
      tabindex="-1"
      :style="{ top: `${y}px`, left: `${x}px` }"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, index) in items"
        :key="item.id"
        type="button"
        role="menuitem"
        class="astryx-table-menu__item"
        :tabindex="index === active ? 0 : -1"
        @click="choose(item)"
        @focusin="active = index"
        @mouseenter="active = index"
      >
        <Icon v-if="item.icon" :icon="item.icon" size="xsm" />
        <span>{{ item.label }}</span>
      </button>
    </div>
  </Teleport>
</template>
