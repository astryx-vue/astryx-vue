<script setup lang="ts">
import type { OutlineEmits, OutlineProps } from './types.js'
import { computed, ref, toRef, useAttrs } from 'vue'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useComponentMessages } from '../locale/context.js'
import { outlineMessages } from '../locale/messages/outline.js'
import { indentLevel } from './scrollGeometry.js'
import { useOutlineIndicator } from './useIndicator.js'
import { useScrollSpy } from './useScrollSpy.js'
import '../../styles/outline.css'

defineOptions({ name: 'AstryxOutline', inheritAttrs: false })

const props = withDefaults(defineProps<OutlineProps>(), {
  density: 'default',
  offset: 0,
  scrollContainer: null,
  hasScrollOnClick: true,
})

const emit = defineEmits<OutlineEmits>()
const messages = useComponentMessages({ outline: outlineMessages })
const press = usePressFeedback()
const root = ref<HTMLElement | null>(null)
const attrs = useAttrs()
/** 调用方写的 `aria-label` 优先于 `label`。 */
const regionLabel = computed(() => (attrs['aria-label'] as string | undefined) ?? props.label ?? messages.value.outline.label)

const { resolvedId, scrollTo } = useScrollSpy({
  activeId: toRef(props, 'activeId'),
  items: toRef(props, 'items'),
  root,
  offset: toRef(props, 'offset'),
  scrollContainer: toRef(props, 'scrollContainer'),
  hasScrollOnClick: toRef(props, 'hasScrollOnClick'),
  onActive: id => emit('update:activeId', id),
  onNavigateStart: id => emit('navigateStart', id),
  onNavigateEnd: id => emit('navigateEnd', id),
})

useOutlineIndicator(root, resolvedId)

function hasModifier(event: MouseEvent | KeyboardEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

/**
 * 跟随页内链接后，顺序焦点的起点移到目标，下一次 Tab 从那一节里继续（WCAG 2.4.3）。
 * Outline 取消了链接的默认行为自己滚动，所以这里补上：聚焦目标但不滚动。
 * 本来不能聚焦的目标只设成可由脚本聚焦。
 */
function moveFocusTo(id: string): void {
  const target = document.getElementById(id)
  if (target == null)
    return
  target.focus({ preventScroll: true })
  if (document.activeElement !== target && !target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
}

function navigate(id: string): void {
  if (scrollTo(id)) {
    window.history.pushState(null, '', `#${id}`)
    moveFocusTo(id)
  }
}

function onClick(id: string, event: MouseEvent): void {
  if (event.defaultPrevented || hasModifier(event))
    return
  if (document.getElementById(id) == null)
    return
  event.preventDefault()
  navigate(id)
}

function onItemKeyDown(id: string, event: KeyboardEvent): void {
  if (event.key !== ' ' && event.key !== 'Spacebar')
    return
  if (event.defaultPrevented || hasModifier(event))
    return
  event.preventDefault()
  navigate(id)
}
</script>

<template>
  <nav
    ref="root"
    class="astryx-outline"
    :class="$attrs.class"
    :style="$attrs.style"
    :aria-label="regionLabel"
    :data-density="density"
    data-component="outline"
  >
    <ul class="astryx-outline__list">
      <li v-for="item in items" :key="item.id" class="astryx-outline__item">
        <a
          v-bind="press.pressableProps"
          class="astryx-outline__link"
          :href="`#${item.id}`"
          :data-level="indentLevel(item.level)"
          :data-active="item.id === resolvedId || undefined"
          :aria-current="item.id === resolvedId ? 'location' : undefined"
          @click="onClick(item.id, $event)"
          @keydown="onItemKeyDown(item.id, $event)"
        >
          <span class="astryx-outline__label">{{ item.label }}</span>
        </a>
      </li>
    </ul>
    <div class="astryx-outline__track" aria-hidden="true">
      <span class="astryx-outline__line" />
      <span class="astryx-outline__indicator" />
    </div>
  </nav>
</template>
