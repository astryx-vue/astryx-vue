import type { CommandArgs, CommandOutput } from '../cli/context.ts'
import type { Project, SourceFile } from '../project.ts'
import { catalog, text } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { buttonActionsCheck } from '../doctor-buttons.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatDoctorReport } from '../format-doctor.ts'
import { compareVersions, findLines, installAllCommands, isInstalledOnDisk, readProject, readSourceFiles, versionOf } from '../project.ts'
import { CORE_PACKAGE } from '../spec.ts'
import { starterInstallCommands, THEMES_PACKAGE } from '../starter-install.ts'

/** `info` reports a check that could not run, and never changes the overall status. */
export type DoctorStatus = 'ok' | 'info' | 'warn' | 'fail'

export interface DoctorCheck {
  id: 'core-version' | 'themes-installed' | 'vue-version' | 'theme-stylesheet' | 'theme-attribute' | 'button-actions'
  status: DoctorStatus
  /** One line saying what was found. */
  detail: string
  /** Where the docs explain the fix, when a docs page does. */
  docsUrl?: string
  /** Commands that fix it, in the project's package manager (every form when none is detected). */
  commands?: string[]
  /** What to change, when the fix is not a command. */
  fix?: string
}

export interface DoctorReport {
  status: DoctorStatus
  locale: 'en' | 'zh'
  checks: DoctorCheck[]
}

/**
 * `doctor` reports five things about the project and changes nothing: whether
 * core is installed and how its version compares, whether themes is installed,
 * whether vue satisfies the peer range, whether a theme stylesheet is imported,
 * and whether a theme is switched on anywhere.
 */
export async function doctorCommand(args: CommandArgs): Promise<CommandOutput> {
  if (args.positionals.length > 0)
    throw new CliError('doctor does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const report = await runChecks(args)
  const stdout = args.json
    ? printJson(successEnvelope('doctor.report', report))
    : formatDoctorReport(report)
  // A failed check is a real answer, not a crash: the text still prints, and a
  // script can branch on the exit code.
  return { stdout, exitCode: report.status === 'fail' ? 1 : 0 }
}

/** The most source files doctor reads; at the limit it cannot tell where every component renders. */
const SOURCE_FILE_LIMIT = 4000

async function runChecks(args: CommandArgs): Promise<DoctorReport> {
  const project = await readProject(args.cwd)
  const locale = args.locale
  const latest = catalog.packages.find(pkg => pkg.name === CORE_PACKAGE)?.version ?? '0.0.0'
  const checks: DoctorCheck[] = []

  const coreRange = project.dependencies[CORE_PACKAGE]
  const coreVersion = versionOf(coreRange)
  checks.push({
    id: 'core-version',
    ...(await notOnDiskCheck(args.cwd, project, CORE_PACKAGE, locale)
      ?? withInstall(versionCheck(coreRange, coreVersion, latest, locale), coreRange === undefined ? starterInstallCommands(project, [CORE_PACKAGE]) : undefined)),
    docsUrl: topicUrl('guide/installation', locale),
  })

  const themesRange = project.dependencies[THEMES_PACKAGE]
  checks.push({
    id: 'themes-installed',
    ...(await notOnDiskCheck(args.cwd, project, THEMES_PACKAGE, locale) ?? themesCheck(project, themesRange, locale)),
    docsUrl: topicUrl('guide/installation', locale),
  })

  const vueRange = project.dependencies.vue
  const vueVersion = versionOf(vueRange)
  checks.push({
    id: 'vue-version',
    ...vueCheck(vueRange, vueVersion, locale),
    docsUrl: topicUrl('guide/installation', locale),
  })

  const files = await readSourceFiles(args.cwd, { limit: SOURCE_FILE_LIMIT })
  const stylesheets = new Set<string>()
  for (const file of files) {
    for (const match of file.text.matchAll(/@astryx-vue\/themes\/[a-z0-9-]+\.css/g))
      stylesheets.add(match[0])
  }
  checks.push({
    id: 'theme-stylesheet',
    ...stylesheetCheck([...stylesheets], locale),
    docsUrl: topicUrl('themes/index', locale) ?? topicUrl('guide/styling', locale),
  })

  const attributeHits = files.flatMap(themeWiringLines)
  checks.push({
    id: 'theme-attribute',
    ...attributeCheck(attributeHits.slice(0, 3), locale),
    docsUrl: topicUrl('themes/index', locale),
  })

  if (coreRange !== undefined)
    checks.push(buttonActionsCheck(files, files.length >= SOURCE_FILE_LIMIT, locale))

  const status: DoctorStatus = checks.some(check => check.status === 'fail')
    ? 'fail'
    : checks.some(check => check.status === 'warn') ? 'warn' : 'ok'
  return { status, locale, checks }
}

type CheckResult = Pick<DoctorCheck, 'status' | 'detail' | 'commands'>

function withInstall(result: CheckResult, commands: string[] | undefined): CheckResult {
  return commands ? { ...result, commands } : result
}

/**
 * A package package.json lists but no `node_modules` folder holds, as in a fresh
 * clone. The fix is the project's own install, which keeps the versions the
 * project lists; adding the package again would replace them.
 */
async function notOnDiskCheck(cwd: string, project: Project, name: string, locale: 'en' | 'zh'): Promise<CheckResult | null> {
  const range = project.dependencies[name]
  if (range === undefined || await isInstalledOnDisk(cwd, name) !== false)
    return null
  return {
    status: 'fail',
    detail: locale === 'zh'
      ? `package.json 写了 ${name}（${range}），但还没装上，先安装项目的依赖。`
      : `${name} is listed in package.json (${range}) but not installed yet. Install the project's dependencies.`,
    commands: installAllCommands(project.packageManager),
  }
}

function themesCheck(project: Project, range: string | undefined, locale: 'en' | 'zh'): CheckResult {
  if (range !== undefined) {
    return {
      status: 'ok',
      detail: locale === 'zh' ? `已安装 ${THEMES_PACKAGE}（${range}）。` : `${THEMES_PACKAGE} is installed (${range}).`,
    }
  }
  return {
    status: 'fail',
    detail: locale === 'zh' ? `没有安装 ${THEMES_PACKAGE}，主题样式来自这个包。` : `${THEMES_PACKAGE} is not installed, and the theme styles come from it.`,
    commands: starterInstallCommands(project, [THEMES_PACKAGE]),
  }
}

function versionCheck(range: string | undefined, version: string | null, latest: string, locale: 'en' | 'zh'): { status: DoctorStatus, detail: string } {
  if (range === undefined)
    return { status: 'fail', detail: locale === 'zh' ? `没有安装 ${CORE_PACKAGE}。` : `${CORE_PACKAGE} is not installed.` }
  if (version === null) {
    return {
      status: 'warn',
      detail: locale === 'zh'
        ? `${CORE_PACKAGE} 写的是 ${JSON.stringify(range)}，看不出具体版本。`
        : `${CORE_PACKAGE} is set to ${JSON.stringify(range)}, which this CLI cannot read as a version.`,
    }
  }
  const difference = compareVersions(version, latest)
  if (difference < 0) {
    return {
      status: 'warn',
      detail: locale === 'zh'
        ? `${CORE_PACKAGE} ${version} 比这个 CLI 认的 ${latest} 旧，运行 \`astryx-vue upgrade\` 看要改什么。`
        : `${CORE_PACKAGE} ${version} is older than ${latest}, the version this CLI knows. Run \`astryx-vue upgrade\` for what changes.`,
    }
  }
  if (difference > 0) {
    return {
      status: 'warn',
      detail: locale === 'zh'
        ? `${CORE_PACKAGE} ${version} 比这个 CLI 认的 ${latest} 新，这个 CLI 的文档可能落后一版。`
        : `${CORE_PACKAGE} ${version} is newer than ${latest}, the version this CLI documents.`,
    }
  }
  return { status: 'ok', detail: locale === 'zh' ? `${CORE_PACKAGE} ${version} 和这个 CLI 认的版本一致。` : `${CORE_PACKAGE} ${version} matches the version this CLI documents.` }
}

function vueCheck(range: string | undefined, version: string | null, locale: 'en' | 'zh'): { status: DoctorStatus, detail: string } {
  if (range === undefined)
    return { status: 'fail', detail: locale === 'zh' ? '没有安装 vue。' : 'vue is not installed.' }
  if (version === null) {
    return {
      status: 'warn',
      detail: locale === 'zh' ? `vue 写的是 ${JSON.stringify(range)}，看不出具体版本。` : `vue is set to ${JSON.stringify(range)}, which this CLI cannot read as a version.`,
    }
  }
  if (compareVersions(version, '3.5.0') < 0) {
    return {
      status: 'warn',
      detail: locale === 'zh' ? `vue ${version} 低于要求的 3.5.0。` : `vue ${version} is below the required 3.5.0.`,
    }
  }
  return { status: 'ok', detail: locale === 'zh' ? `vue ${version} 满足 3.5.0 以上。` : `vue ${version} satisfies 3.5.0 or newer.` }
}

function stylesheetCheck(stylesheets: readonly string[], locale: 'en' | 'zh'): { status: DoctorStatus, detail: string } {
  if (stylesheets.length === 0) {
    return {
      status: 'fail',
      detail: locale === 'zh'
        ? '项目的源码里没有引入任何主题样式表，组件会没有颜色和间距。'
        : 'No theme stylesheet is imported anywhere in the project, so components have no color or spacing.',
    }
  }
  const known = stylesheets.map(specifier => catalog.themes.find(theme => theme.cssImport === specifier)?.slug).filter(Boolean)
  const names = stylesheets.join(', ')
  if (known.length === 0) {
    return {
      status: 'warn',
      detail: locale === 'zh' ? `引用了 ${names}，但这不是内置主题的文件名。` : `${names} is imported, but that is not one of the built-in theme stylesheets.`,
    }
  }
  return {
    status: 'ok',
    detail: locale === 'zh' ? `已引入主题样式：${names}。` : `A theme stylesheet is imported: ${names}.`,
  }
}

function attributeCheck(hits: readonly { path: string, line: number }[], locale: 'en' | 'zh'): { status: DoctorStatus, detail: string } {
  if (hits.length === 0) {
    return {
      status: 'warn',
      detail: locale === 'zh'
        ? '没有找到 data-astryx-theme，也没有用 Core 的 `<Theme>`。Neutral 不用写也能用；换别的主题，或只给某个区块换主题，就要写这个属性或用 `<Theme>`。'
        : 'No `data-astryx-theme` attribute or Core `<Theme>` was found. Neutral works without them; switching to another theme, or theming one subtree, needs one.',
    }
  }
  const where = hits.map(hit => `${hit.path}:${hit.line}`).join(', ')
  return {
    status: 'ok',
    detail: locale === 'zh' ? `找到设置主题的地方：${where}。` : `A theme is set at ${where}.`,
  }
}

/** An import of the `Theme` component from Core's root or its `Theme` subpath. */
const THEME_COMPONENT_IMPORT = /import\s*\{[^}]*\bTheme\b[^}]*\}\s*from\s*['"]@astryx-vue\/core(?:\/Theme)?['"]/

/**
 * Lines that set a theme: the attribute written out, the attribute set from a
 * script through `dataset.astryxTheme`, or a `<Theme>` from Core, whose
 * outermost instance writes the attribute on the document root. The theme it
 * receives may sit in a variable, so the tag itself is what counts.
 */
function themeWiringLines(file: SourceFile): { path: string, line: number }[] {
  const rendersTheme = THEME_COMPONENT_IMPORT.test(file.text)
  return findLines(file, line => line.includes('data-astryx-theme')
    || line.includes('dataset.astryxTheme')
    || (rendersTheme && /<Theme[\s>/]/.test(line)))
}

/** The docs URL of a topic the catalog carries, so a check points at the page that explains it. */
function topicUrl(id: string, locale: 'en' | 'zh'): string | undefined {
  const topic = catalog.topics.find(candidate => candidate.id === id)
  return topic ? text(topic.docsUrl, locale) : undefined
}
