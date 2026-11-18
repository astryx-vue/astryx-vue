import type { ComputedRef, Ref } from 'vue'
import type { ResolvedColorMode } from './colorMode.js'
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { readColorMode } from './colorMode.js'

/**
 * 能不能读读者的页面（文档属性、计算样式、系统偏好）。
 *
 * 组件里挂载后才为 true：服务端看不到读者的页面，hydration 那一趟也必须和服务端算得一样，
 * 否则深色页面或页面自己的 CSS 变量会让第一次渲染和服务端 HTML 对不上。
 * 组件外调用时没有挂载这一步，直接为 true。
 */
export function usePageReadable(): Ref<boolean> {
  const readable = ref(getCurrentInstance() == null)
  if (!readable.value) {
    onMounted(() => {
      readable.value = true
    })
  }
  return readable
}

/**
 * 主题明确给了 light 或 dark 就用它；否则跟随页面（文档属性、`dark` 类、系统偏好）。
 * 跟随页面的那一半挂载前按服务端的 light 算，见 `usePageReadable`。
 */
export function useResolvedColorMode(
  requested: () => string | undefined,
  pageReadable: Ref<boolean> = usePageReadable(),
): ComputedRef<ResolvedColorMode> {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  return computed<ResolvedColorMode>(() => {
    const mode = requested()
    if (mode === 'light' || mode === 'dark')
      return mode
    return pageReadable.value ? readColorMode(prefersDark.value) : 'light'
  })
}
