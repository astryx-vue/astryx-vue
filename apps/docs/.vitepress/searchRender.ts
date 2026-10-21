import type { DefaultTheme } from 'vitepress'

type SearchRender = NonNullable<DefaultTheme.LocalSearchOptions['_render']>

/**
 * 本地搜索建索引时用的页面渲染。
 *
 * 搜索按正文里的标题切块，每块的显示路径由上层标题拼成。组件页的页面名只写在
 * frontmatter 的 `title` 里，正文从 `## 使用方法` 开始，没有 h1，结果就只剩
 * 「使用方法」这类同名小标题，分不清来自哪个页面。这里在正文缺 h1 时，用
 * frontmatter 的 `title` 补一个，只进搜索索引，不影响页面本身。
 */
export const renderForSearch: SearchRender = async (src, env, md) => {
  const html = await md.renderAsync(src, env)
  if (env.frontmatter?.search === false)
    return ''

  const title = env.frontmatter?.title
  if (typeof title !== 'string' || title === '' || /<h1[\s>]/i.test(html))
    return html

  const heading = await md.renderAsync(`# ${title}`, {})
  return heading + html
}
