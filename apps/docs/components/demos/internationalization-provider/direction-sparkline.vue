<script setup lang="ts">
import { InternationalizationProvider, useLocaleDirection } from '@astryx-vue/core/InternationalizationProvider'
import { SegmentedControl, SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
import { VStack } from '@astryx-vue/core/Stack'
import { useTheme } from '@astryx-vue/core/Theme'
import { defineComponent, h, onMounted, ref, watch } from 'vue'

const DATA_POINTS = [10, 25, 18, 40, 32, 60, 48, 75]

// A canvas has no CSS direction, so the drawing code reads it from the provider.
const Sparkline = defineComponent(() => {
  const direction = useLocaleDirection()
  const { token } = useTheme()
  const canvas = ref<HTMLCanvasElement | null>(null)

  function draw(): void {
    const context = canvas.value?.getContext('2d')
    if (!canvas.value || !context)
      return
    const { width, height } = canvas.value
    const isRtl = direction.value === 'rtl'
    const step = width / (DATA_POINTS.length - 1)
    const max = Math.max(...DATA_POINTS)
    const min = Math.min(...DATA_POINTS)
    const yOf = (value: number): number => height - ((value - min) / (max - min || 1)) * (height - 10) - 5
    const color = token('--color-accent') || 'currentColor'

    context.clearRect(0, 0, width, height)
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = 2
    // Oldest point at the start edge, newest at the end edge.
    DATA_POINTS.forEach((value, index) => {
      const x = isRtl ? width - index * step : index * step
      if (index === 0)
        context.moveTo(x, yOf(value))
      else
        context.lineTo(x, yOf(value))
    })
    context.stroke()

    context.beginPath()
    context.arc(isRtl ? 0 : width, yOf(DATA_POINTS.at(-1)!), 4, 0, Math.PI * 2)
    context.fillStyle = color
    context.fill()
  }

  onMounted(draw)
  watch(direction, draw)

  return () => h('canvas', {
    'ref': canvas,
    'width': 200,
    'height': 60,
    'data-direction': direction.value,
    'style': 'border: 1px solid var(--color-border, #e1e4e8); border-radius: 4px',
  })
})

const lang = ref<'en' | 'ar'>('en')
</script>

<template>
  <InternationalizationProvider :locale="lang" :dir="lang === 'ar' ? 'rtl' : 'ltr'">
    <VStack :gap="4" h-align="center" :dir="lang === 'ar' ? 'rtl' : 'ltr'" width="100%">
      <SegmentedControl v-model="lang" label="Locale" size="sm">
        <SegmentedControlItem value="en" label="English (LTR)" />
        <SegmentedControlItem value="ar" label="العربية (RTL)" />
      </SegmentedControl>
      <Sparkline />
    </VStack>
  </InternationalizationProvider>
</template>
