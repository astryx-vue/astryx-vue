<script setup lang="ts">
import type { OutlineEmits, OutlineProps } from './types.js'
import { computed, nextTick, ref, toRef, watch } from 'vue'
import { useListFocus } from '../composables/useListFocus.js'
import { usePressFeedback } from '../composables/usePressFeedback.js'
import { useAstryxMessages } from '../locale/context.js'
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
const messages = useAstryxMessages()
const press = usePressFeedback()
const root = ref<HTMLElement | null>(null)
const regionLabel = computed(() => props.label ?? messages.value.outline.label)

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

const { handleFocus, handleKeyDown, listRef } = useListFocus({
  hasRovingTabIndex: true,
  itemSelector: 'a[href]',
  orientation: 'vertical',
})

function seatTabStop(): void {
  const list = listRef.value
  if (list == null || (document.activeElement != null && list.contains(document.activeElement)))
    return
  const links = [...list.querySelectorAll<HTMLElement>('a[href]')]
  const active = links.find(link => link.getAttribute('aria-current') === 'location')
  if (active == null)
    return
  for (const link of links)
    link.tabIndex = link === active ? 0 : -1
}

watch(resolvedId, () => {
  void nextTick(seatTabStop)
})

useOutlineIndicator(root, resolvedId)

function hasModifier(event: MouseEvent | KeyboardEvent): boolean {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey
}

function navigate(id: string): void {
  if (scrollTo(id))
    window.history.pushState(null, '', `#${id}`)
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
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 方向键在链接之间移动焦点，列表本身不是另一个控件。 -->
    <ul
      ref="listRef"
      class="astryx-outline__list"
      @keydown="handleKeyDown"
      @focus="handleFocus"
    >
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
