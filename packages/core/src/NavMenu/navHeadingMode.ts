export type NavHeadingMode = 'logo' | 'whole-link' | 'trigger' | 'mixed' | 'links' | 'static'

export interface NavHeadingModeInput {
  hasHeading: boolean
  hasMenu: boolean
  headingHref?: string
  superheadingHref?: string
  subheadingHref?: string
}

/** 标题的点击边界：整段链接、整段打开菜单，或链接和箭头各管各的。 */
export function resolveNavHeadingMode(input: NavHeadingModeInput): NavHeadingMode {
  const hasAnyHref = Boolean(input.headingHref || input.superheadingHref || input.subheadingHref)
  if (!input.hasHeading && !input.hasMenu)
    return 'logo'
  if (input.headingHref && !input.hasMenu && !input.superheadingHref && !input.subheadingHref)
    return 'whole-link'
  if (input.hasMenu && !hasAnyHref)
    return 'trigger'
  if (input.hasMenu && hasAnyHref)
    return 'mixed'
  if (hasAnyHref)
    return 'links'
  return 'static'
}
