import type { ComputedRef, Ref } from 'vue'
import type { ResolvedColorMode } from './colorMode.js'
import { computed, getCurrentInstance, inject, onMounted, ref } from 'vue'
import { useMediaQuery } from '../composables/useMediaQuery.js'
import { readColorMode } from './colorMode.js'
import { systemSchemeKey } from './context.js'
import { useRootScheme } from './rootScheme.js'

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
 * 主题明确给了 light 或 dark 就用它；否则 `system` 跟随页面：
 * 文档属性、`dark` 类，再到页面根画的配色（根声明了两种或读不到时看系统偏好）。
 * 在强制了浅色或深色的 Theme 里面，`system` 直接跟读者的偏好。
 * 跟随页面的那一半挂载前按服务端的 light 算，见 `usePageReadable`。
 */
export function useResolvedColorMode(
  requested: () => string | undefined,
  pageReadable: Ref<boolean> = usePageReadable(),
): ComputedRef<ResolvedColorMode> {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const around = inject(systemSchemeKey, null)
  const systemScheme = (): 'preference' | 'root' => around?.value ?? 'root'
  const forced = (): boolean => {
    const mode = requested()
    return mode === 'light' || mode === 'dark'
  }
  const pageScheme = useRootScheme(() => !forced() && systemScheme() === 'root')

  return computed<ResolvedColorMode>(() => {
    const mode = requested()
    if (mode === 'light' || mode === 'dark')
      return mode
    if (!pageReadable.value)
      return 'light'
    if (systemScheme() === 'preference')
      return prefersDark.value ? 'dark' : 'light'
    return readColorMode(prefersDark.value, pageScheme.value)
  })
}
