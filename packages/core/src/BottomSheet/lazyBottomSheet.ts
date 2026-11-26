import { defineAsyncComponent } from 'vue'

function loadBottomSheet(): Promise<typeof import('./BottomSheet.vue')> {
  return import('./BottomSheet.vue')
}

/**
 * 按需加载的 BottomSheet：只在底部弹层真正进入组件树时请求，只用锚定浮层的页面
 * 不会加载它（以及它的手势）。菜单和 Popover 的底部弹层呈现共用。
 */
export const LazyBottomSheet = defineAsyncComponent(loadBottomSheet)

/** 先把模块加载好、什么都不渲染：底部弹层可能成为呈现方式时调用，打开时立刻就有。 */
export function preloadBottomSheet(): void {
  void loadBottomSheet()
}
