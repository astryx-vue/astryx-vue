<script setup lang="ts">
import type { PlaygroundTemplate } from './templates'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/** 编辑栏顶部的「模板」下拉菜单。点菜单外面或按 Esc 关闭。 */
defineProps<{
  label: string
  templates: PlaygroundTemplate[]
  currentId: string
}>()

const emit = defineEmits<{
  choose: [id: string]
}>()

const open = defineModel<boolean>('open', { required: true })
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onDocumentKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onDocumentKey)
})

function onPointerDown(event: PointerEvent): void {
  if (!open.value)
    return
  const element = root.value
  if (element && event.target instanceof Node && !element.contains(event.target))
    open.value = false
}

function onDocumentKey(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    open.value = false
}

function choose(id: string): void {
  open.value = false
  emit('choose', id)
}
</script>

<template>
  <div ref="root" class="playground__menu-wrap">
    <button
      type="button"
      class="playground__pill"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <span class="playground__button-text">{{ label }}</span>
      <span class="playground__icon" aria-hidden="true"><span class="i-carbon-chevron-down" /></span>
    </button>
    <div
      v-if="open"
      class="playground__menu"
      role="menu"
      :aria-label="label"
    >
      <button
        v-for="item in templates"
        :key="item.id"
        type="button"
        role="menuitem"
        :aria-current="item.id === currentId ? 'true' : undefined"
        @click="choose(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
  </div>
</template>
