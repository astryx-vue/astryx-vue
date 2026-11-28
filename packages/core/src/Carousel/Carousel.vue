<script setup lang="ts">
import type { CarouselHandle, CarouselProps, CarouselSlots } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useComponentMessages } from '../locale/context.js'
import { carouselMessages } from '../locale/messages/carousel.js'
import { CarouselItems } from './slides.js'
import { useCarouselPaging } from './useCarouselPaging.js'
import { useCarouselScroller } from './useCarouselScroll.js'
import '../../styles/carousel.css'

defineOptions({ name: 'AstryxCarousel', inheritAttrs: false })

const props = withDefaults(defineProps<CarouselProps>(), {
  gap: 1,
  hasButtons: true,
  hasEdgeFade: true,
  hasLoop: false,
  hasSnap: false,
})

defineSlots<CarouselSlots>()

const messages = useComponentMessages({ carousel: carouselMessages })
const scroller = ref<HTMLElement | null>(null)
const startButton = ref<HTMLButtonElement | null>(null)
const endButton = ref<HTMLButtonElement | null>(null)
const focusedNav = ref<'start' | 'end' | null>(null)
const { followShown, measure, onKeyDown, overflow, scrollByDirection, scrollToIndex } = useCarouselScroller(scroller)
useCarouselPaging(scroller, () => props.hasSnap, followShown)

const regionLabel = computed(() => props.label ?? messages.value.carousel.label)

const canScrollStart = computed(() => props.hasLoop && overflow.value.hasOverflow
  ? true
  : overflow.value.overflowStart)
const canScrollEnd = computed(() => props.hasLoop && overflow.value.hasOverflow
  ? true
  : overflow.value.overflowEnd)

const fade = computed(() => {
  if (!props.hasEdgeFade)
    return 'none'
  if ((props.hasLoop && overflow.value.hasOverflow) || (overflow.value.overflowStart && overflow.value.overflowEnd))
    return 'both'
  if (overflow.value.overflowStart)
    return 'start'
  if (overflow.value.overflowEnd)
    return 'end'
  return 'none'
})

const spacingName = computed(() => String(props.gap).replace('.', '-'))
const paddingName = computed(() => props.padding == null ? undefined : String(props.padding).replace('.', '-'))
const scrollerStyle = computed(() => {
  const style: Record<string, string> = {
    '--astryx-carousel-gap': `var(--astryx-spacing-${spacingName.value}, ${props.gap * 4}px)`,
  }
  if (paddingName.value != null) {
    const padding = `var(--astryx-spacing-${paddingName.value})`
    style['--astryx-carousel-padding'] = padding
  }
  return style
})

let previousCanScroll: { start: boolean, end: boolean } | null = null

watch([canScrollStart, canScrollEnd], async ([start, end]) => {
  const previous = previousCanScroll
  previousCanScroll = { start, end }
  const side = focusedNav.value
  if (previous == null || side == null)
    return
  const wasEnabled = side === 'start' ? previous.start : previous.end
  const isEnabled = side === 'start' ? start : end
  if (!wasEnabled || isEnabled)
    return
  await nextTick()
  const pressed = side === 'start' ? startButton.value : endButton.value
  if (pressed == null)
    return
  const active = pressed.ownerDocument.activeElement
  if (active !== pressed && active !== pressed.ownerDocument.body)
    return
  if (scroller.value == null)
    return
  focusedNav.value = null
  scroller.value.focus({ preventScroll: true })
})

function buttonElement(target: EventTarget | null): HTMLButtonElement | null {
  return target instanceof HTMLButtonElement ? target : null
}

function onStartFocus(event: FocusEvent): void {
  startButton.value = buttonElement(event.currentTarget)
  focusedNav.value = 'start'
}

function onEndFocus(event: FocusEvent): void {
  endButton.value = buttonElement(event.currentTarget)
  focusedNav.value = 'end'
}

function onNavBlur(event: FocusEvent): void {
  const button = buttonElement(event.currentTarget)
  // 禁用的按钮是被这次更新顺带失焦的，不是用户移开了焦点。
  if (button != null && button.getAttribute('aria-disabled') !== 'true')
    focusedNav.value = null
}

function scrollNext(): void {
  scrollByDirection(1, props.hasLoop)
}

function scrollPrev(): void {
  scrollByDirection(-1, props.hasLoop)
}

const handle: CarouselHandle = {
  canScrollNext: () => props.hasLoop ? overflow.value.hasOverflow : overflow.value.overflowEnd,
  canScrollPrev: () => props.hasLoop ? overflow.value.hasOverflow : overflow.value.overflowStart,
  scrollNext,
  scrollPrev,
  scrollTo: scrollToIndex,
}

defineExpose(handle)

function slideLabel(position: number, total: number): string {
  return messages.value.carousel.slide(position, total)
}
</script>

<template>
  <div
    class="astryx-carousel"
    :class="$attrs.class"
    :style="$attrs.style"
    role="region"
    aria-roledescription="carousel"
    :aria-label="regionLabel"
    data-component="carousel"
  >
    <!-- 滚动区是和轮播同名的分组，只在内容溢出时进 Tab 序列，左右方向键只滚动这一行。放得下时仍能被程序聚焦，用来接住边缘按钮交出的焦点。 -->
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- 分组本身接收方向键滚动，tabindex 随溢出切换。 -->
    <div
      ref="scroller"
      class="astryx-carousel__scroller astryx-carousel-scroller"
      role="group"
      :aria-label="regionLabel"
      :data-gap="gap"
      :data-padding="padding"
      :data-snap="hasSnap ? true : undefined"
      :data-edge-fade="hasEdgeFade || undefined"
      :data-fade="fade"
      :tabindex="overflow.hasOverflow ? 0 : -1"
      :style="scrollerStyle"
      @keydown="onKeyDown($event, hasLoop)"
    >
      <CarouselItems :content="$slots.default" :label="slideLabel" @update="measure" />
    </div>
    <div v-if="hasButtons" class="astryx-carousel__controls">
      <!-- 隐藏的按钮不是 Tab 停靠点，也不在无障碍树里；光靠禁用态它仍可聚焦。 -->
      <div class="astryx-carousel__pill astryx-carousel__pill--start" :data-hidden="!canScrollStart || undefined" :inert="!canScrollStart || undefined">
        <IconButton
          variant="ghost"
          size="sm"
          :label="messages.carousel.scrollLeft"
          :is-disabled="!canScrollStart"
          @focus="onStartFocus"
          @blur="onNavBlur"
          @click="scrollPrev"
        >
          <Icon icon="chevronLeft" size="xsm" />
        </IconButton>
      </div>
      <div class="astryx-carousel__pill astryx-carousel__pill--end" :data-hidden="!canScrollEnd || undefined" :inert="!canScrollEnd || undefined">
        <IconButton
          variant="ghost"
          size="sm"
          :label="messages.carousel.scrollRight"
          :is-disabled="!canScrollEnd"
          @focus="onEndFocus"
          @blur="onNavBlur"
          @click="scrollNext"
        >
          <Icon icon="chevronRight" size="xsm" />
        </IconButton>
      </div>
    </div>
  </div>
</template>
