<script setup lang="ts">
import type { WeightedIconDef } from './buildWeightedIcon.js'
import { weightedIconSymbolId, weightedLayerClass } from './weightedSymbol.js'
import '../../styles/weighted-svg-icon.css'

/**
 * 把每个图标的各张图只画一次，放在隐藏的 `<symbol>` 里，给传了 `sprite` 的图标引用。
 * 每页渲染一次，放在图标前面或后面都行。
 */
defineOptions({ name: 'AstryxWeightedIconSprite' })

defineProps<{
  /** 页面上每个用 `sprite` 引用的图标。 */
  icons: readonly WeightedIconDef[]
}>()
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="astryx-weighted-icon-sprite">
    <symbol v-for="icon in icons" :id="weightedIconSymbolId(icon)" :key="icon.name" :viewBox="icon.viewBox ?? '0 0 24 24'">
      <g v-for="layer in icon.layers" :key="`${layer.from}-${layer.to}`" :class="weightedLayerClass(layer)">
        <path v-for="(path, index) in layer.paths" :key="index" :d="path.d" :fill-rule="path.evenOdd === true ? 'evenodd' : undefined" />
      </g>
    </symbol>
  </svg>
</template>
