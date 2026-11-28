import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, provide, shallowReactive, useId } from 'vue'

/** 页面上第一个外层 AppShell 的主区域 id，跳转链接和选择器都认这个。 */
export const MAIN_CONTENT_ID = 'astryx-app-shell-main'

/** 在某个 AppShell 的内容里时为 true：嵌套的壳永远不拿固定 id。 */
const appShellNestingKey: InjectionKey<boolean> = Symbol('astryx-app-shell-nesting')

/** 已挂载的外层壳按挂载顺序登记在这里，只在浏览器里变化。 */
const claims = shallowReactive<object[]>([])

export function provideAppShellNesting(): void {
  provide(appShellNestingKey, true)
}

/**
 * 一个 AppShell 主区域用的 id。第一个挂载的外层壳保持固定 id；
 * 嵌套的壳，或在别的壳占着固定 id 时挂载的壳，用自己生成的 id，页面上不会有重复 id。
 * 服务端和首次渲染里，外层壳都用固定 id，挂载后其余的壳再换成自己的。
 */
export function useAppShellMainId(): { mainId: ComputedRef<string> } {
  const generated = `${MAIN_CONTENT_ID}-${useId()}`
  const isNested = inject(appShellNestingKey, false)
  const claim = {}
  onMounted(() => {
    if (!isNested)
      claims.push(claim)
  })
  onBeforeUnmount(() => {
    const index = claims.indexOf(claim)
    if (index >= 0)
      claims.splice(index, 1)
  })
  const mainId = computed(() => !isNested && (claims.length === 0 || claims[0] === claim) ? MAIN_CONTENT_ID : generated)
  return { mainId }
}
