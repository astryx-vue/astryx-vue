<script setup lang="ts">
/**
 * NavigationStack 的一屏卡片：自己滚动的内容区、可选的大标题、栏下的滚动边缘遮罩和视差遮暗。
 * 卡片和遮暗的动效引擎登记到栈的登记表里，由栈驱动。
 */
import type { NavigationRegistry } from './navigationDriver'
import type { ScreenDescriptor } from './NavigationScreen'
import { useScrollableArea } from '@astryx-vue/core'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useMotionEngine } from '../internal/useMotionEngine'
import { useScrollEdgeEffect } from '../internal/useScrollEdgeEffect'
import { BAR_HEIGHT, dimStyle } from './layout'
import { registerLayers } from './navigationDriver'
import { bars } from './navigationMotion'
import { SlotOutlet } from './SlotOutlet'

defineOptions({ name: 'AstryxNavigationCard' })

const props = defineProps<{
  screenKey: string
  screen: ScreenDescriptor
  registry: NavigationRegistry
  isTop: boolean
  isCovered: boolean
  isHidden: boolean
  onLargeTitleCollapse: (key: string, isCollapsed: boolean) => void
}>()

const isLarge = computed(() => props.screen.titleDisplayMode === 'large')
const card = useMotionEngine()
const dim = useMotionEngine()
onBeforeUnmount(registerLayers(
  props.registry,
  props.screenKey,
  { card: card.animator, dim: dim.animator },
  ['largeTitleElement'],
))

const scroller = shallowRef<HTMLElement | null>(null)
// 往前 Tab 进滚动区时，焦点交给里面第一个普通链接或按钮。
const area = useScrollableArea({
  axis: 'block',
  overscroll: 'contain',
  get keyboardAccess() {
    return { owner: 'contentOrViewport' as const, label: props.screen.title }
  },
})
function contentRef(element: unknown): void {
  const next = element instanceof HTMLElement ? element : null
  if (area.content.value !== next)
    area.content.value = next
}
function scrollerRef(element: unknown): void {
  area.viewport(element)
  const next = element instanceof HTMLElement ? element : null
  if (scroller.value !== next)
    scroller.value = next
}

// iOS 26：每屏的滚动视图带着自己的边缘效果，推入、退出时各屏的遮罩跟着自己的卡片走。
// 内容在栏下移动 10px 后打开。藏在两层以下的屏幕没有布局可量，不运行；露出来后量一次立刻切换。
const edge = useScrollEdgeEffect({
  enabled: () => !props.isHidden,
  root: scroller,
  rootInset: BAR_HEIGHT,
  springs: bars.scrollEdgeEffect,
})

// 大标题整个滚到栏下面后算收起：栏里的标题接手。没有布局的标题不算滚走。
const largeTitle = shallowRef<HTMLElement | null>(null)
function largeTitleRef(element: unknown): void {
  const next = element instanceof HTMLElement ? element : null
  if (largeTitle.value !== next)
    largeTitle.value = next
}
watch(
  [largeTitle, scroller],
  ([title, container], _previous, onCleanup) => {
    const current = props.registry.get(props.screenKey)
    if (current != null)
      current.largeTitleElement = title
    if (title == null || container == null)
      return
    const read = (): void => props.onLargeTitleCollapse(
      props.screenKey,
      title.offsetHeight > 0 && container.scrollTop >= title.offsetTop + title.offsetHeight - BAR_HEIGHT,
    )
    read()
    container.addEventListener('scroll', read, { passive: true })
    onCleanup(() => {
      container.removeEventListener('scroll', read)
      props.onLargeTitleCollapse(props.screenKey, false)
      const latest = props.registry.get(props.screenKey)
      if (latest?.largeTitleElement === title)
        latest.largeTitleElement = null
    })
  },
  { flush: 'post' },
)
</script>

<template>
  <div
    :ref="card.ref"
    class="astryx-navigation-stack__card"
    :class="{ 'astryx-navigation-stack__card--hidden': isHidden }"
    :data-navigation-screen="screenKey"
    :data-navigation-top="isTop || undefined"
    :inert="isCovered || undefined"
  >
    <div
      :ref="scrollerRef"
      class="astryx-navigation-stack__scroller"
      v-bind="area.viewportAttrs.value"
      :style="area.viewportStyle.value"
    >
      <div
        v-if="!isLarge"
        :ref="edge.sentinelRef"
        class="astryx-scroll-edge-sentinel astryx-navigation-stack__edge-sentinel"
        aria-hidden="true"
        data-navigation-scroll-edge-sentinel
      />
      <div :ref="contentRef">
        <template v-if="isLarge">
          <h1 :ref="largeTitleRef" tabindex="-1" class="astryx-navigation-stack__large-title">
            {{ screen.title }}
          </h1>
          <div
            :ref="edge.sentinelRef"
            class="astryx-scroll-edge-sentinel astryx-navigation-stack__edge-sentinel astryx-navigation-stack__edge-sentinel--after-large-title"
            aria-hidden="true"
            data-navigation-scroll-edge-sentinel
          />
        </template>
        <SlotOutlet :render="screen.content" />
      </div>
    </div>
    <div :ref="edge.layerRef" class="astryx-scroll-edge astryx-navigation-stack__scroll-edge" aria-hidden="true" data-navigation-scroll-edge />
    <div :ref="dim.ref" aria-hidden="true" class="astryx-navigation-stack__dim" :style="dimStyle" />
  </div>
</template>
