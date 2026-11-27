<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useIndicator } from '../Indicator/useIndicator.js'
import { bindSpinnerPhase } from './spinnerPhase.js'

defineOptions({ name: 'AstryxSpinnerRing' })

defineProps<{
  frameSize: number
  diameter: number
  stroke: number
  arcLength: number
  gapLength: number
}>()

// 主题可以用名为 `spinner` 的指示图形换掉整圈：它画在加载圈自己的盒子里，盒子的尺寸、角色和名字不变。
const ThemeSpinner = useIndicator('spinner')

let releasePhase: (() => void) | undefined

/** 转子是自带合成层的 HTML 盒子：弧在里面转，轨道留在外面不动。 */
function onRotor(element: unknown): void {
  releasePhase?.()
  releasePhase = undefined
  if (element instanceof HTMLElement)
    releasePhase = bindSpinnerPhase(element)
}

onBeforeUnmount(() => releasePhase?.())
</script>

<template>
  <component :is="ThemeSpinner" v-if="ThemeSpinner" state="busy" class="astryx-spinner__themed" />
  <template v-else>
    <!-- 轨道按属性是零尺寸：没有样式表时，转子里的弧自己撑满盒子，而不是两个圆并排。 -->
    <svg class="astryx-spinner__ring" width="0" height="0" aria-hidden="true" focusable="false">
      <circle class="astryx-spinner__track" cx="50%" cy="50%" :r="diameter / 2" :stroke-width="stroke" />
    </svg>
    <span :ref="onRotor" class="astryx-spinner__rotor" aria-hidden="true">
      <svg class="astryx-spinner__ring" :width="frameSize" :height="frameSize" focusable="false">
        <circle
          class="astryx-spinner__arc"
          cx="50%"
          cy="50%"
          :r="diameter / 2"
          :stroke-width="stroke"
          :stroke-dasharray="`${arcLength} ${gapLength}`"
        />
      </svg>
    </span>
  </template>
</template>
