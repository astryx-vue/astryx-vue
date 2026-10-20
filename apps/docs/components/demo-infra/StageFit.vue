<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** 内容自然高度超过它时，整体等比缩小到它；不传就取外层画布 min-height 减去上下内边距。 */
  maxHeight?: number
  /** 缩得再小就看不清了，到这个比例为止。 */
  minScale?: number
}>(), {
  maxHeight: undefined,
  minScale: 0.5,
})

const inner = ref<HTMLElement | null>(null)
const naturalHeight = ref(0)
const limit = ref(0)

// 量 demo 根节点的 offsetHeight：它是布局高度，不受 transform 影响，缩放不会反过来改变测量值；
// 外框不缩放时是 display: contents，自己没有盒子，所以不能量外框。
const scale = computed(() => {
  const max = props.maxHeight ?? limit.value
  if (max <= 0 || naturalHeight.value <= max)
    return 1
  return Math.max(props.minScale, max / naturalHeight.value)
})
const frameStyle = computed(() => (scale.value === 1 ? undefined : { height: `${naturalHeight.value * scale.value}px` }))
const innerStyle = computed(() => (scale.value === 1 ? undefined : { transform: `scale(${scale.value})` }))

let observer: ResizeObserver | undefined
function content(): HTMLElement | null {
  return inner.value?.firstElementChild as HTMLElement | null
}
function measure(): void {
  const el = content()
  if (el == null)
    return
  naturalHeight.value = el.offsetHeight
  const stage = el.closest<HTMLElement>('.component-detail__stage')
  if (stage != null) {
    const style = getComputedStyle(stage)
    // 画布的 min-height 是设计高度；clientHeight 会被内容撑大，不能当上限。
    limit.value = Number.parseFloat(style.minHeight) - Number.parseFloat(style.paddingTop) - Number.parseFloat(style.paddingBottom)
  }
}
onMounted(() => {
  const el = content()
  if (el == null)
    return
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(el)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <!-- 不缩放时外框和内层都是 display: contents，等于不存在，demo 仍是舞台的直接子元素，布局和以前一样。 -->
  <div class="stage-fit" :class="{ 'is-scaled': scale !== 1 }" :style="frameStyle">
    <div ref="inner" class="stage-fit__inner" :style="innerStyle">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.stage-fit,
.stage-fit__inner {
  display: contents;
}

/* 只有真的缩小时才让外框占位：高度按缩放后的值算，宽度仍是内容宽度，由舞台居中。 */
.stage-fit.is-scaled {
  display: block;
  min-width: 0;
  max-width: 100%;
}

.stage-fit.is-scaled .stage-fit__inner {
  display: block;
  /* 从顶部中线缩，水平方向保持居中。 */
  transform-origin: top center;
}
</style>
