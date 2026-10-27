import type { ThemeRecord } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import { catalog } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatThemeDetail, formatThemeList } from '../format.ts'
import { suggestByNames } from '../query.ts'
import { BINARY } from '../spec.ts'

/**
 * `theme` only ever prints: the themes that ship, and how to load one. The text
 * it prints is the themes' own documentation pages, so the command cannot say
 * something the site does not.
 */
export function themeCommand(args: CommandArgs): string {
  const name = args.positionals.join(' ').trim()
  if (!name) {
    if (args.json) {
      return printJson(successEnvelope('theme.list', {
        locale: args.locale,
        detail: 'compact',
        themes: catalog.themes.map(theme => themeBrief(theme, args.locale)),
      }))
    }
    return formatThemeList(catalog.themes, args.locale, args.dense)
  }
  const theme = resolveTheme(name)
  const steps = themeSteps(theme, args.locale)
  if (args.json) {
    return printJson(successEnvelope('theme.detail', {
      ...themeBrief(theme, args.locale),
      steps,
      body: theme.body[args.locale],
      locale: args.locale,
    }))
  }
  return formatThemeDetail(theme, args.locale, args.dense, steps)
}

function resolveTheme(name: string): ThemeRecord {
  const key = name.trim().toLowerCase().replace(/[\s_]+/g, '-')
  const theme = catalog.themes.find(candidate => candidate.slug === key)
    ?? catalog.themes.find(candidate => candidate.title.en.toLowerCase() === name.trim().toLowerCase())
  if (theme)
    return theme
  throw new CliError(
    `No theme named "${name}".`,
    'ERR_UNKNOWN_THEME',
    1,
    suggestByNames(name, catalog.themes, candidate => [candidate.slug, candidate.title.en, candidate.title.zh], candidate => candidate.slug),
  )
}

export interface ThemeStep {
  id: 'import-css' | 'set-attribute' | 'scope' | 'verify'
  title: string
  text?: string
  code?: string
}

/**
 * The four things a reader has to do, in order. The stylesheet and the attribute
 * come from the theme's own page; the scoping rules come from the themes index
 * page; only the last step is this command's own pointer at `doctor`.
 */
function themeSteps(theme: ThemeRecord, locale: 'en' | 'zh'): ThemeStep[] {
  const zh = locale === 'zh'
  return [
    {
      id: 'import-css',
      title: zh ? '在应用入口引一次主题样式' : 'Load the theme once in the app entry',
      code: `import '${theme.cssImport}'`,
    },
    {
      id: 'set-attribute',
      title: zh ? '把主题加到该用它的元素上' : 'Put the theme on the element that should use it',
      text: zh
        ? '写在 `html` 上是整站，写在别的元素上只影响那棵子树。'
        : 'On `html` it covers the whole app; on a smaller element it covers only that subtree.',
      code: `<html data-astryx-theme="${theme.attributeValue}">`,
    },
    {
      id: 'scope',
      title: zh ? '换主题，或者同时用两套主题' : 'Switch themes, or run two side by side',
      text: catalog.themeScope[locale].join('\n\n'),
    },
    {
      id: 'verify',
      title: zh ? '改完验证' : 'Check the result',
      text: zh
        ? `运行 \`${BINARY} doctor\`：它会检查样式引了没有、主题设了没有，只报告不改文件。`
        : `Run \`${BINARY} doctor\`: it reports whether a theme stylesheet is imported and whether a theme is set, and changes nothing.`,
    },
  ]
}

function themeBrief(theme: ThemeRecord, locale: 'en' | 'zh'): Record<string, unknown> {
  return {
    slug: theme.slug,
    title: theme.title[locale],
    summary: theme.summary[locale],
    cssImport: theme.cssImport,
    attributeValue: theme.attributeValue,
    command: `${BINARY} theme ${theme.slug}`,
    docsUrl: theme.docsUrl[locale],
  }
}
