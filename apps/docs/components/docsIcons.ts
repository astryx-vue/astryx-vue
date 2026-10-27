/**
 * The lucide drawings behind the semantic icon names, for the docs pages.
 *
 * Upstream's docs run the neutral theme, which registers a lucide icon table,
 * so its component pages draw outline icons. The playground preview frame does
 * not load this module: it has tokens only, like upstream's `/built` theme, and
 * falls back to core's built-in filled artwork.
 *
 * The icon plugin only bundles names it can see written out in a module.
 */
export const docsIcons = [
  'lucide:x',
  'lucide:chevron-down',
  'lucide:chevron-left',
  'lucide:chevron-right',
  'lucide:chevrons-left',
  'lucide:chevrons-right',
  'lucide:check',
  'lucide:circle-check',
  'lucide:circle-x',
  'lucide:triangle-alert',
  'lucide:info',
  'lucide:calendar',
  'lucide:clock',
  'lucide:external-link',
  'lucide:menu',
  'lucide:ellipsis',
  'lucide:search',
  'lucide:upload',
  'lucide:arrow-up',
  'lucide:arrow-down',
  'lucide:arrow-up-down',
  'lucide:funnel',
  'lucide:eye-off',
  'lucide:columns-3',
  'lucide:copy',
  'lucide:check-check',
  'lucide:wrench',
  'lucide:square',
  'lucide:mic',
  'lucide:image',
] as const
