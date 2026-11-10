<script setup lang="ts">
import type { PlaygroundTemplate } from './templates'
import { useLayer } from '@astryx-vue/core'
import { computed, watch } from 'vue'

/**
 * 编辑栏顶部的「模板」下拉菜单。点菜单外面或按 Esc 关闭。
 *
 * 菜单挂在浮层里而不是触发按钮旁边：左侧编辑区收窄后，按钮附近的容器会
 * 裁掉溢出的内容，菜单只有跳出这些容器才能完整显示。
 */
const props = defineProps<{
  label: string
  templates: PlaygroundTemplate[]
  currentId: string
}>()

const emit = defineEmits<{
  choose: [id: string]
}>()

const open = defineModel<boolean>('open', { required: true })
const listedTemplates = computed(() => props.templates.filter(item => item.isListed))

const layer = useLayer({
  mode: 'context',
  placement: 'below',
  alignment: 'end',
  gap: 6,
  lightDismiss: true,
  lazyMount: true,
})

const { contentStyle, isMounted, isOpen, id, show, hide } = layer

// 外部（例如打开导出弹窗）关掉菜单时，浮层要跟着收起来。
watch(open, value => (value ? show() : hide()), { immediate: true })
// 浮层自己关闭（点外面、按 Esc）时，把状态写回外部。
watch(isOpen, (value) => {
  if (value !== open.value)
    open.value = value
})

function choose(templateId: string): void {
  hide()
  layer.anchorRef.value?.focus()
  emit('choose', templateId)
}
</script>

<template>
  <button
    :ref="layer.anchorRef"
    type="button"
    class="playground__pill"
    :aria-expanded="isOpen"
    :aria-controls="id"
    aria-haspopup="menu"
    @click="isOpen ? hide() : show()"
  >
    <span class="playground__button-text">{{ label }}</span>
    <span class="playground__icon" aria-hidden="true"><span class="i-carbon-chevron-down" /></span>
  </button>
  <Teleport to="body">
    <div
      v-if="isMounted"
      v-show="isOpen"
      :id="id"
      :ref="layer.contentRef"
      class="playground__menu"
      role="menu"
      :aria-label="label"
      :style="contentStyle"
    >
      <button
        v-for="item in listedTemplates"
        :key="item.id"
        type="button"
        role="menuitem"
        :aria-current="item.id === currentId ? 'true' : undefined"
        @click="choose(item.id)"
      >
        {{ item.label }}
      </button>
    </div>
  </Teleport>
</template>
