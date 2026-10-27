<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { IconShape, SVGIconProps } from './types.js'
import { computed, useAttrs, useId } from 'vue'
import '../../styles/svg-icon.css'

defineOptions({ name: 'AstryxSvgIcon', inheritAttrs: false })

const props = withDefaults(defineProps<SVGIconProps>(), {
  variation: 'linear',
  size: 'md',
  color: 'primary',
  strokeWidth: undefined,
})

const attrs = useAttrs()
const viewBox = computed(() => props.icon.viewBox ?? '0 0 24 24')
const maskId = `astryx-svg-icon-${useId().replace(/\W/g, '')}-mask`

/** 按角色把一层图形拆成「填充组」和「描边组」。 */
function splitByRole(shapes: IconShape[]): { fill: IconShape[], stroke: IconShape[] } {
  const fill: IconShape[] = []
  const stroke: IconShape[] = []
  for (const shape of shapes) {
    if (shape.role === 'stroke')
      stroke.push(shape)
    else
      fill.push(shape)
  }
  return { fill, stroke }
}

const primary = computed(() => splitByRole(props.icon.primary))
const secondary = computed(() => {
  const shapes = props.icon.secondary ?? []
  return shapes.length > 0 ? splitByRole(shapes) : { fill: [], stroke: [] }
})
const hasSecondary = computed(() => (props.icon.secondary?.length ?? 0) > 0)

// 只有 bold 变体、且主层有填充形状、次层有东西可挖的时候才生成遮罩。
const useMask = computed(() => props.variation === 'bold'
  && primary.value.fill.length > 0
  && secondary.value.fill.length + secondary.value.stroke.length > 0)

const knockoutShapes = computed(() => [...secondary.value.fill, ...secondary.value.stroke])

// 装饰性还是有意义：使用方给了可访问名（aria-label / aria-labelledby）就
// 暴露成 role="img"，否则整体从无障碍树里藏起来。用户自己写的属性优先。
const a11yAttrs = computed<Record<string, string | undefined>>(() => {
  if (attrs['aria-hidden'] != null || attrs.role != null)
    return {}
  const hasAccessibleName = attrs['aria-label'] != null || attrs['aria-labelledby'] != null
  return hasAccessibleName ? { role: 'img' } : { 'aria-hidden': 'true' }
})

const mergedAttrs = computed(() => ({ ...a11yAttrs.value, ...attrs }))

const svgStyle = computed<CSSProperties>(() => {
  const style = (attrs.style ?? {}) as CSSProperties
  if (props.strokeWidth == null)
    return style
  return { ...style, '--astryx-icon-stroke-width': String(props.strokeWidth) } as CSSProperties
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg" :viewBox="viewBox" class="astryx-svg-icon"
    :class="[attrs.class, `astryx-svg-icon--${variation}`]" :data-variation="variation" :data-size="size"
    :data-color="color" v-bind="mergedAttrs" :style="svgStyle"
  >
    <!-- 遮罩：把次层的填充形状从主层里挖出带间隙的洞。 -->
    <defs v-if="useMask">
      <mask :id="maskId">
        <rect width="24" height="24" fill="white" />
        <component
          :is="shape.type" v-for="(shape, index) in knockoutShapes" :key="`knockout-${index}`"
          v-bind="shape.attrs" :fill="(shape.role ?? 'fill') === 'fill' ? 'black' : 'none'" stroke="black"
          :stroke-width="(shape.role ?? 'fill') === 'stroke' ? 'calc(var(--astryx-icon-stroke-width, 1.5) + var(--astryx-icon-gap, 0.75) * 2)' : 'var(--astryx-icon-gap, 0.75)'"
          stroke-linecap="round" stroke-linejoin="var(--astryx-icon-gap-linejoin, round)"
        />
      </mask>
    </defs>

    <!-- 主层：填充组（bold 下带遮罩）、描边组。 -->
    <g
      v-if="primary.fill.length > 0" class="astryx-svg-icon__layer astryx-svg-icon__layer--primary-fill"
      :mask="useMask ? `url(#${maskId})` : undefined"
    >
      <component :is="shape.type" v-for="(shape, index) in primary.fill" :key="`primary-fill-${index}`" v-bind="shape.attrs" />
    </g>
    <g v-if="primary.stroke.length > 0" class="astryx-svg-icon__layer astryx-svg-icon__layer--primary-stroke">
      <component :is="shape.type" v-for="(shape, index) in primary.stroke" :key="`primary-stroke-${index}`" v-bind="shape.attrs" />
    </g>

    <!-- 次层：bold + 遮罩时整层不画，它只作为挖洞存在。 -->
    <template v-if="hasSecondary && !useMask">
      <g v-if="secondary.fill.length > 0" class="astryx-svg-icon__layer astryx-svg-icon__layer--secondary-fill">
        <component :is="shape.type" v-for="(shape, index) in secondary.fill" :key="`secondary-fill-${index}`" v-bind="shape.attrs" />
      </g>
      <g v-if="secondary.stroke.length > 0" class="astryx-svg-icon__layer astryx-svg-icon__layer--secondary-stroke">
        <component :is="shape.type" v-for="(shape, index) in secondary.stroke" :key="`secondary-stroke-${index}`" v-bind="shape.attrs" />
      </g>
    </template>
  </svg>
</template>
