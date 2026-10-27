<script setup lang="ts">
import type { CarouselHandle, CarouselProps, CarouselSlots } from './types.js'
import { computed, nextTick, ref, watch } from 'vue'
import Icon from '../Icon/Icon.vue'
import IconButton from '../IconButton/IconButton.vue'
import { useAstryxMessages } from '../locale/context.js'
import { CarouselItems } from './slides.js'
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

const messages = useAstryxMessages()
const scroller = ref<HTMLElement | null>(null)
const startButton = ref<HTMLButtonElement | null>(null)
const endButton = ref<HTMLButtonElement | null>(null)
const focusedNav = ref<'start' | 'end' | null>(null)
const { measure, onKeyDown, overflow, scrollByDirection, scrollToIndex } = useCarouselScroller(scroller)

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
  const opposite = side === 'start' ? endButton.value : startButton.value
  const receiver = opposite != null && !opposite.disabled ? opposite : scroller.value
  if (receiver == null)
    return
  focusedNav.value = null
  receiver.focus({ preventScroll: true })
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
  if (button != null && !button.disabled)
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
    <!-- eslint-disable-next-line vue-a11y/no-static-element-interactions -- tabindex 把滚动区放进 Tab 序列；左右方向键只滚动这一行。 -->
    <div
      ref="scroller"
      class="astryx-carousel__scroller astryx-carousel-scroller"
      :data-gap="gap"
      :data-padding="padding"
      :data-snap="hasSnap || undefined"
      :data-edge-fade="hasEdgeFade || undefined"
      :data-fade="fade"
      tabindex="0"
      :style="scrollerStyle"
      @keydown="onKeyDown($event, hasLoop)"
    >
      <CarouselItems :content="$slots.default" :label="slideLabel" @update="measure" />
    </div>
    <div v-if="hasButtons" class="astryx-carousel__controls">
      <div class="astryx-carousel__pill astryx-carousel__pill--start" :data-hidden="!canScrollStart || undefined">
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
      <div class="astryx-carousel__pill astryx-carousel__pill--end" :data-hidden="!canScrollEnd || undefined">
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
