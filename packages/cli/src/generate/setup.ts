import type { LocaleText } from '../catalog-types.ts'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * The snippet `init` hands an AI assistant: which packages to install, where the
 * theme CSS goes, and how to provide the locale. Every line is read out of the
 * docs pages, so the command and the site cannot drift apart.
 */
export interface SetupGuide {
  /** Package names the installation page installs together. */
  installPackages: string[]
  /** The style import that loads a theme once, as the quick start writes it. */
  themeImport: LocaleText
  /** The snippet that provides a locale at the root, as the i18n page writes it. */
  localeCode: LocaleText
}

export async function buildSetup(repoRoot: string): Promise<SetupGuide> {
  const page = (locale: 'en' | 'zh', name: string): Promise<string> =>
    readFile(join(repoRoot, 'apps/docs/docs', locale, 'guide', `${name}.md`), 'utf8')
  const [installation, gettingStarted, i18n, zhGettingStarted, zhI18n] = await Promise.all([
    page('en', 'installation'),
    page('en', 'getting-started'),
    page('en', 'i18n'),
    page('zh', 'getting-started'),
    page('zh', 'i18n'),
  ])
  return {
    installPackages: readInstalledPackages(installation),
    themeImport: {
      en: readFence(gettingStarted, fence => fence.includes('/themes/') && fence.includes('.css')),
      zh: readFence(zhGettingStarted, fence => fence.includes('/themes/') && fence.includes('.css')),
    },
    localeCode: {
      en: readFence(i18n, fence => fence.includes('provideAstryxLocale')),
      zh: readFence(zhI18n, fence => fence.includes('provideAstryxLocale')),
    },
  }
}

const PACKAGE_MANAGERS = new Set(['pnpm', 'npm', 'yarn', 'bun'])
const INSTALL_VERBS = new Set(['add', 'install'])

/** `pnpm add @astryx-vue/core @astryx-vue/themes` becomes the two package names. */
function readInstalledPackages(page: string): string[] {
  for (const fence of codeFences(page)) {
    for (const line of fence.split('\n')) {
      const [manager, verb, ...packages] = line.trim().split(/\s+/)
      if (PACKAGE_MANAGERS.has(manager ?? '') && INSTALL_VERBS.has(verb ?? '') && packages.length > 0)
        return packages
    }
  }
  throw new Error('guide/installation.md does not show an install command that init can reuse')
}

/** The first fenced block the caller recognises. */
function readFence(page: string, matches: (fence: string) => boolean): string {
  for (const fence of codeFences(page)) {
    if (matches(fence))
      return fence.trim()
  }
  throw new Error('the docs page does not have the code block this command needs')
}

function codeFences(page: string): string[] {
  return [...page.matchAll(/```[^\n]*\n([\s\S]*?)```/g)].map(match => match[1] ?? '')
}
