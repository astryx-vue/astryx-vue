<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { IconWeight, WeightedIconDef } from './buildWeightedIcon.js'
import type { SVGIconColor, SVGIconSize } from './types.js'
import { computed, useAttrs } from 'vue'
import { weightedIconSymbolId, weightedLayerClass } from './weightedSymbol.js'
import { registerWeightProbe } from './weightProbe.js'
import '../../styles/svg-icon.css'
import '../../styles/weighted-svg-icon.css'

/**
 * 随周围字重变化的 SVG 图标：一个图标的所有笔画图画在同一个 SVG 里，CSS 只显示字重区间
 * 包含当前字重的那一张，所以粗体文字里的图标自己画粗的那一张，不用传任何属性。
 * 字重来自图标周围的文字，由一个宽 1ch 的探针容器读出（见 weightProbe.ts 和
 * weighted-svg-icon.css）；`weight` 把它固定下来，祖先设 `--astryx-icon-weight` 可以固定一整棵子树。
 */
defineOptions({ name: 'AstryxWeightedSvgIcon', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** 图标：每个字重区间一张图。 */
  icon: WeightedIconDef
  /** @default 'md' */
  size?: SVGIconSize
  /** @default 'primary' */
  color?: SVGIconColor
  /** 固定画某个字重，不跟随周围文字的字重。 */
  weight?: IconWeight
  /** 引用页面上 `WeightedIconSprite` 里的 symbol，不在这里内联画。 */
  sprite?: boolean
}>(), {
  size: 'md',
  color: 'primary',
  sprite: false,
})

const attrs = useAttrs()
const viewBox = computed(() => props.icon.viewBox ?? '0 0 24 24')

// 默认装饰性，有可访问名就是 role="img"；使用方自己写的 role、aria-hidden 优先。
const a11yAttrs = computed<Record<string, string | undefined>>(() => {
  if (attrs['aria-hidden'] != null || attrs.role != null)
    return {}
  return attrs['aria-label'] != null || attrs['aria-labelledby'] != null
    ? { role: 'img' }
    : { 'aria-hidden': 'true' }
})

const svgStyle = computed<CSSProperties>(() => {
  const style = (attrs.style ?? {}) as CSSProperties
  return props.weight == null ? style : { ...style, '--astryx-icon-weight': String(props.weight) } as CSSProperties
})

/** 把探针字体装进图标所在的文档（页面、iframe 或弹出窗口），每个文档一次。 */
function installWeightProbe(element: unknown): void {
  if (element instanceof HTMLElement)
    registerWeightProbe(element.ownerDocument)
}
</script>

<template>
  <span
    :ref="installWeightProbe"
    class="astryx-svg-icon astryx-weighted-svg-icon"
    :data-size="size"
    :data-color="color"
  >
    <span class="astryx-weighted-svg-icon__probe">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :viewBox="viewBox"
        class="astryx-weighted-svg-icon__svg"
        :class="attrs.class"
        v-bind="{ ...a11yAttrs, ...attrs }"
        :style="svgStyle"
      >
        <use v-if="sprite" :href="`#${weightedIconSymbolId(icon)}`" />
        <template v-else>
          <g v-for="layer in icon.layers" :key="`${layer.from}-${layer.to}`" :class="weightedLayerClass(layer)">
            <path v-for="(path, index) in layer.paths" :key="index" :d="path.d" :fill-rule="path.evenOdd === true ? 'evenodd' : undefined" />
          </g>
        </template>
      </svg>
    </span>
  </span>
</template>
