<script setup lang="ts">
import { provideLayerDepth } from './layerDepth.js'
import { resetLayerScopedContext } from './scopedProvide.js'

/**
 * 浮层内容的边界。
 *
 * 两件事都只作用在内容上，不包住触发器：浮层组件同时渲染触发器和内容，
 * 触发器仍然属于外面那一层。
 *
 * - 外面组里的尺寸、禁用、选中值进不来（细节见 `scopedProvide.ts`）。
 * - 嵌套深度加一，往下传。Teleport 切不断 provide/inject，里面再开的
 *   Tooltip / HoverCard 能知道自己比这一层更深。
 */
defineOptions({ name: 'AstryxLayerContentBoundary' })

resetLayerScopedContext()
provideLayerDepth()
</script>

<template>
  <slot />
</template>
