import type { PlaygroundLocale } from './protocol'
import type { PlaygroundTemplateSlug } from './templateManifest'
import {
  PLAYGROUND_LISTED_TEMPLATE_SLUGS,
  PLAYGROUND_TEMPLATE_META,
  PLAYGROUND_TEMPLATE_SLUGS,
  playgroundTemplateMenuLabel,
} from './templateManifest'

const pageSources = import.meta.glob('./pages/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

export interface PlaygroundTemplate {
  id: string
  label: string
  source: string
  /** 是否出现在模板菜单里；不出现的仍能用 `?template=` 打开。 */
  isListed: boolean
}

const LISTED = new Set<PlaygroundTemplateSlug>(PLAYGROUND_LISTED_TEMPLATE_SLUGS)

function sourceForSlug(slug: string): string {
  const key = `./pages/${slug}.vue`
  const source = pageSources[key]
  if (!source)
    throw new Error(`Missing playground template source: ${slug} (${key})`)
  return source
}

export function playgroundTemplates(locale: PlaygroundLocale): PlaygroundTemplate[] {
  return PLAYGROUND_TEMPLATE_SLUGS.map((slug) => {
    const meta = PLAYGROUND_TEMPLATE_META[slug]
    return {
      id: slug,
      label: playgroundTemplateMenuLabel(meta, locale),
      source: sourceForSlug(slug),
      isListed: LISTED.has(slug),
    }
  })
}
