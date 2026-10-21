<script setup lang="ts">
import { resetLayerScopedContext } from './scopedProvide.js'

/**
 * 浮层内容的「成员边界」。
 *
 * 把这层内容包起来，外面组里的尺寸、禁用、选中值就都进不来了（细节见
 * `scopedProvide.ts`）。包在内容上而不是整个浮层组件上，是因为浮层组件同时
 * 渲染触发器和内容：触发器仍然属于外面的组，只有内容不算。
 */
defineOptions({ name: 'AstryxLayerContentBoundary' })

resetLayerScopedContext()
</script>

<template>
  <slot />
</template>
