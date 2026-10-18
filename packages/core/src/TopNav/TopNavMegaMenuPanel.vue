<script setup lang="ts">
import type { NavMenuFocusRequest } from '../NavMenu/context.js'
import { nextTick, onMounted, watch } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import '../../styles/top-nav.css'

defineOptions({ name: 'AstryxTopNavMegaMenuPanel' })

const props = withDefaults(defineProps<{
  /** 面板的无障碍名称，取自触发按钮上的文字。 */
  label: string
  /** 弹出层要求把焦点放在哪一项。 */
  focusRequest?: NavMenuFocusRequest
}>(), {
  focusRequest: null,
})

const { listRef, handleKeyDown, focusFirst, focusLast } = useListFocus({
  hasHomeEnd: true,
  itemSelector: '.astryx-top-nav-mega-item',
  wrap: true,
})

// 模板里用 ref="listRef" 绑定，这里读一次让 vue-tsc 认出它被使用。
void listRef.value

function applyFocus(request: NavMenuFocusRequest): void {
  if (request == null)
    return
  void nextTick(() => {
    if (request === 'last')
      focusLast()
    else
      focusFirst()
  })
}

onMounted(() => applyFocus(props.focusRequest))
watch(() => props.focusRequest, applyFocus)
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键从内部链接冒泡上来；这一层只负责在面板里移动焦点。 -->
  <div
    ref="listRef"
    class="astryx-top-nav-mega__layout"
    role="group"
    :aria-label="label"
    @keydown="handleKeyDown"
  >
    <div class="astryx-top-nav-mega__items">
      <slot />
    </div>
    <div v-if="$slots.featured" class="astryx-top-nav-mega__featured">
      <slot name="featured" />
    </div>
  </div>
</template>
