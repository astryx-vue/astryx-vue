<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const host = ref<HTMLElement | null>(null)
const naturalSize = ref({ width: 0, height: 0 })
const scale = ref(1)
const style = computed(() => {
  if (naturalSize.value.width === 0 || naturalSize.value.height === 0)
    return undefined
  return {
    width: `${naturalSize.value.width}px`,
    height: `${naturalSize.value.height}px`,
    transform: `translate(-50%, -50%) scale(${scale.value})`,
  }
})

function measure(): void {
  const root = host.value
  const content = root?.firstElementChild as HTMLElement | null
  const frame = root?.closest<HTMLElement>('.component-card__frame')
  if (!root || !content || !frame)
    return
  const preview = root.closest<HTMLElement>('.component-card__preview')
  if (!preview)
    return
  const previewStyle = getComputedStyle(preview)
  const availableWidth = preview.clientWidth - Number.parseFloat(previewStyle.paddingLeft) - Number.parseFloat(previewStyle.paddingRight)
  const availableHeight = preview.clientHeight - Number.parseFloat(previewStyle.paddingTop) - Number.parseFloat(previewStyle.paddingBottom)
  const width = Math.max(content.offsetWidth, content.scrollWidth)
  const height = Math.max(content.offsetHeight, content.scrollHeight)
  if (width === 0 || height === 0)
    return
  naturalSize.value = { width, height }
  scale.value = Math.min(1, availableWidth / width, availableHeight / height)
}

let observer: ResizeObserver | undefined
onMounted(async () => {
  await nextTick()
  measure()
  const content = host.value?.firstElementChild
  if (content)
    observer = new ResizeObserver(measure)
  observer?.observe(content as Element)
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <div ref="host" class="lab-preview-fit" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.lab-preview-fit {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  width: 100%;
  min-width: 0;
  max-width: none;
  transform-origin: center center;
}

.lab-preview-fit > * {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>
