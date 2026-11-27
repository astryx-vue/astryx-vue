/**
 * 组件文档页自带一个共用的 ToastViewport，示例只要调 `useToast` 就能弹提示。
 * 下面这些页面讲的就是视口本身（放置、堆叠、LayerProvider 配置），示例各自带着
 * 视口，页面就不再加这一个，免得同一条提示叠出两份。
 */
const OWN_VIEWPORT_PAGES: ReadonlySet<string> = new Set(['toast', 'use-toast', 'layer-provider'])

export function ownsToastViewport(slug: string): boolean {
  return OWN_VIEWPORT_PAGES.has(slug)
}
