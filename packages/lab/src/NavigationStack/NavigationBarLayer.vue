<script setup lang="ts">
/**
 * NavigationStack 里一屏的栏：跟着自己的卡片走，标题和尾部内容都在里面。大标题显示时栏标题藏起来，
 * 大标题滚到栏下后栏标题升起淡入。栏、遮暗、裁切框和标题的动效引擎登记到栈的登记表里。
 */
import type { NavigationRegistry } from './navigationDriver'
import type { ScreenDescriptor } from './NavigationScreen'
import { onBeforeUnmount, watch } from 'vue'
import { useMotionEngine } from '../internal/useMotionEngine'
import { dimStyle } from './layout'
import { registerLayers } from './navigationDriver'
import { navigation, springs } from './navigationMotion'
import { SlotOutlet } from './SlotOutlet'

defineOptions({ name: 'AstryxNavigationBarLayer' })

const props = defineProps<{
  screenKey: string
  screen: ScreenDescriptor
  registry: NavigationRegistry
  isCovered: boolean
  isLargeTitleShown: boolean
}>()

function titleTarget(shown: boolean): { opacity: number, y: number } {
  return {
    opacity: shown ? 0 : 1,
    y: shown ? navigation.inlineTitleRise : 0,
  }
}

const bar = useMotionEngine()
const barDim = useMotionEngine()
const clip = useMotionEngine()
const clipContent = useMotionEngine()
// 第一次布局时标题直接就位。
const titleText = useMotionEngine({ initial: titleTarget(props.isLargeTitleShown) })
const unregister = registerLayers(props.registry, props.screenKey, {
  bar: bar.animator,
  barDim: barDim.animator,
  barClip: clip.animator,
  barClipContent: clipContent.animator,
  titleText: titleText.animator,
}, ['titleElement'])
onBeforeUnmount(unregister)

// 标题是一个元素（标题角色）：栈聚焦它，动效引擎让它升起淡入。
function titleRef(element: unknown): void {
  titleText.ref(element)
  const current = props.registry.get(props.screenKey)
  if (current != null)
    current.titleElement = element instanceof HTMLElement ? element : null
}

watch(
  () => props.isLargeTitleShown,
  (shown) => {
    titleText.animator.animate(titleTarget(shown), { spring: springs.navigationBarElements })
  },
)
</script>

<template>
  <div
    :ref="bar.ref"
    class="astryx-navigation-stack__bar-layer"
    :class="{ 'astryx-navigation-stack__bar-layer--covered': isCovered }"
    :data-navigation-bar="screenKey"
    :inert="isCovered || undefined"
  >
    <div :ref="clip.ref" class="astryx-navigation-stack__bar-clip">
      <div :ref="clipContent.ref" class="astryx-navigation-stack__bar-row">
        <div aria-hidden="true" data-navigation-bar-background class="astryx-navigation-stack__bar-layer-background" />
        <div class="astryx-navigation-stack__bar-start" />
        <h2
          :ref="titleRef"
          tabindex="-1"
          :aria-hidden="isLargeTitleShown || undefined"
          class="astryx-navigation-stack__bar-title"
        >
          {{ screen.title }}
        </h2>
        <div class="astryx-navigation-stack__bar-end">
          <SlotOutlet :render="screen.endContent" />
        </div>
        <div
          :ref="barDim.ref"
          aria-hidden="true"
          data-navigation-bar-dim
          class="astryx-navigation-stack__dim astryx-navigation-stack__bar-dim"
          :style="dimStyle"
        />
      </div>
    </div>
  </div>
</template>
