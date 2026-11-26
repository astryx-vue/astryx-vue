import type { AgentName } from '../agents.ts'
import type { CatalogPackage } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import type { PackageManager, Project } from '../project.ts'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { applyManagedBlock, existingAgentDocs, renderAgentBlock, resolveAgentTargets } from '../agents.ts'
import { catalog } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatInitGuide } from '../format-init.ts'
import { assertWithinProject, toPosix } from '../paths.ts'
import { installAllCommands, installCommands, isInstalledOnDisk, readProject } from '../project.ts'
import { BINARY } from '../spec.ts'
import { missingStarterPackages, starterInstallCommands } from '../starter-install.ts'

const AGENT_NAMES: readonly AgentName[] = ['cursor', 'claude', 'codex', 'hermes', 'all']

/** One package `init` names, with the command that installs exactly that package. */
export interface InitPackage {
  name: string
  version: string
  description: string
  canary: boolean
  /** False for a `private` package: npm has no version of it, so it has no install command. */
  published: boolean
  /** The specifier to install, or null when there is nothing to install yet. */
  specifier: string | null
  install: string[]
}

/** One step of the guide `init` hands an AI assistant. */
export interface InitStep {
  id: 'install' | 'theme' | 'locale' | 'verify' | 'lookup'
  title: string
  text?: string
  code?: string
  commands?: string[]
}

/** What `init` did to one agent file. `unchanged` means the block was already current and the file was not written. */
export type AgentDocAction = 'created' | 'appended' | 'updated' | 'unchanged'

/**
 * The agent files before this run: `current` when every file the run writes
 * already holds the block it would write, `missing` when none of them holds a
 * block, `stale` otherwise. Null when the run writes no agent file.
 */
export type AgentDocsStatus = 'missing' | 'stale' | 'current'

export interface InitGuide {
  packageManager: PackageManager | null
  /** What told us the manager: the `packageManager` field, a lockfile, or nothing. */
  packageManagerSource: 'packageManager' | 'lockfile' | null
  lockfile: string | null
  packages: InitPackage[]
  steps: InitStep[]
}

/**
 * `init` does two things and nothing else: it refreshes the managed block in the
 * project's agent file, and it prints what an AI assistant needs to wire up —
 * which packages to install, where the theme stylesheet goes, and how the locale
 * is provided. It never edits a project file other than that block.
 */
export async function initCommand(args: CommandArgs): Promise<string> {
  if (args.positionals.length > 0)
    throw new CliError('init does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const features = readFeatures(args.options.features)
  const requestedAgent = args.options.agent === undefined ? null : String(args.options.agent)
  const agent = requestedAgent === null ? null : AGENT_NAMES.find(name => name === requestedAgent) ?? null
  if (requestedAgent !== null && agent === null)
    throw new CliError('--agent must be cursor, claude, codex, hermes, or all.', 'ERR_UNKNOWN_AGENT', 2)

  const project = await readProject(args.cwd)
  const guide = initGuide(project, await starterInstallStep(args.cwd, project), args.locale)
  const files = features.includes('agents') ? await writeAgentBlock(args, agent) : []
  const agentDocsStatus = agentDocsStatusOf(files)

  const data = {
    mode: 'features' as const,
    features,
    /** `auto` means the target came from what the project already has. */
    agent: agent ?? 'auto',
    files,
    agentDocsStatus,
    guide,
  }
  if (args.json)
    return printJson(successEnvelope('init.run', data))
  return formatInitGuide(guide, files, agentDocsStatus, args.locale, args.dense)
}

function agentDocsStatusOf(files: readonly { action: AgentDocAction }[]): AgentDocsStatus | null {
  if (files.length === 0)
    return null
  if (files.every(file => file.action === 'unchanged'))
    return 'current'
  return files.every(file => file.action === 'created' || file.action === 'appended') ? 'missing' : 'stale'
}

/** `--features` is optional now: the guide is the default answer, and `agents` adds the block. */
function readFeatures(value: string | boolean | undefined): string[] {
  if (value === undefined)
    return ['agents']
  const features = String(value).split(',').map(feature => feature.trim()).filter(Boolean)
  if (features.length === 0)
    throw new CliError('Pass --features agents.', 'ERR_MISSING_ARGUMENT', 2)
  const unknown = features.find(feature => feature !== 'agents')
  if (unknown)
    throw new CliError(`Unknown feature "${unknown}". MVP supports agents.`, 'ERR_UNKNOWN_FEATURE', 2)
  return features
}

async function writeAgentBlock(args: CommandArgs, agent: AgentName | null): Promise<{ path: string, action: AgentDocAction }[]> {
  const explicitPath = args.options['agent-docs-path']
  const targets: string[] = []
  if (explicitPath !== undefined) {
    const value = String(explicitPath).trim()
    if (!value)
      throw new CliError('--agent-docs-path needs a file path.', 'ERR_MISSING_ARGUMENT', 2)
    assertWithinProject(resolve(args.cwd, value), args.cwd)
    targets.push(value)
  }
  else {
    const existing = existingAgentDocs(file => existsSync(join(args.cwd, file)))
    targets.push(...resolveAgentTargets(agent, existing))
  }

  const inner = renderAgentBlock(catalog, args.locale, args.dense)
  const files: { path: string, action: AgentDocAction }[] = []
  for (const target of targets) {
    const absolute = resolve(args.cwd, target)
    assertWithinProject(absolute, args.cwd)
    const shown = toPosix(relative(args.cwd, absolute))
    let existing: string | null = null
    try {
      existing = await readFile(absolute, 'utf8')
    }
    catch (error) {
      if (!isMissing(error))
        throw writeFailed('read', shown, error)
    }
    const next = applyManagedBlock(existing, inner)
    if (next.content === existing) {
      files.push({ path: shown, action: 'unchanged' })
      continue
    }
    try {
      mkdirSync(dirname(absolute), { recursive: true })
      await writeFile(absolute, next.content)
    }
    catch (error) {
      throw writeFailed('write', shown, error)
    }
    files.push({ path: shown, action: next.action })
  }
  return files
}

/**
 * The guide: what to install, where the theme stylesheet goes, how the locale is
 * provided, and what to run afterwards. The package list and every snippet come
 * from the catalog, so this text is the docs site's text.
 */
function initGuide(project: Project, install: StarterInstall, locale: 'en' | 'zh'): InitGuide {
  const zh = locale === 'zh'
  const manager = project.packageManager
  const packages = catalog.packages.map((pkg: CatalogPackage): InitPackage => {
    // A private package has no published version: printing `pnpm add` for it
    // would hand the reader a command that fails.
    const specifier = !pkg.published ? null : pkg.canary ? `${pkg.name}@canary` : pkg.name
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      canary: pkg.canary,
      published: pkg.published,
      specifier,
      install: specifier === null ? [] : installCommands(manager, [specifier]),
    }
  })
  const core = catalog.packages.find(pkg => pkg.name === '@astryx-vue/core')
  const themes = catalog.packages.find(pkg => pkg.name === '@astryx-vue/themes')
  const starterText = zh
    ? `起步只需要 core 和 themes${core && themes ? `（${core.version}）` : ''}。`
    : `A project needs core and themes to start${core && themes ? ` (${core.version})` : ''}.`

  const steps: InitStep[] = [
    {
      id: 'install',
      title: zh ? '安装包' : 'Install the packages',
      text: install.kind === 'add'
        ? addText(install.missing, zh) ?? starterText
        : install.kind === 'install-all'
          ? (zh ? 'package.json 已经写了 core 和 themes，但还没装上：安装项目的依赖即可，别再 add 一遍。' : 'package.json already lists core and themes, but they are not installed yet. Install the project\'s dependencies; adding them again would replace the versions it lists.')
          : (zh ? 'package.json 已经写了 core 和 themes，这一步不用做。' : 'package.json already lists core and themes, so there is nothing to install.'),
      commands: install.commands,
    },
    {
      id: 'theme',
      title: zh ? '在应用入口引入一次主题样式' : 'Load a theme once in the app entry',
      text: zh ? '写在入口文件（例如 `src/main.ts`）里，整站只引一次。' : 'Put this in the entry file, such as `src/main.ts`. Once per app.',
      code: catalog.setup.themeImport[locale],
    },
    {
      id: 'locale',
      title: zh ? '在根组件提供语言（可选）' : 'Provide the locale at the root (optional)',
      text: zh ? '不提供时组件文案用英文。' : 'Without it, component copy is English.',
      code: catalog.setup.localeCode[locale],
    },
    {
      id: 'verify',
      title: zh ? '改完验证' : 'Check the result',
      text: zh
        ? '运行 `astryx-vue doctor`：它检查依赖版本、样式有没有引入、主题有没有设，只报告不改文件。'
        : 'Run `astryx-vue doctor`: it checks dependency versions, whether a theme stylesheet is imported, and whether a theme is set, and it changes nothing.',
    },
    {
      id: 'lookup',
      title: zh ? '写代码前用它查' : 'Look things up before writing code',
      text: zh
        ? '组件用 `astryx-vue component <Name>`，组合式函数用 `astryx-vue composable <Name>`，页面模板用 `astryx-vue build "<一句话想法>"`。'
        : 'Use `astryx-vue component <Name>` for a component, `astryx-vue composable <Name>` for a composable, and `astryx-vue build "<one sentence>"` for a page template.',
      commands: [`${BINARY} build "<one sentence>"`, `${BINARY} component --list`, `${BINARY} docs --depth 2`],
    },
  ]
  return { packageManager: manager, packageManagerSource: project.packageManagerSource, lockfile: project.lockfile, packages, steps }
}

interface StarterInstall {
  /** `add` for packages package.json lacks, `install-all` for listed packages not on disk, `none` when both are in place. */
  kind: 'add' | 'install-all' | 'none'
  /** The starter packages package.json does not list. */
  missing: string[]
  commands: string[]
}

/** The install text when package.json already lists some starter packages; null when it lists none. */
function addText(missing: readonly string[], zh: boolean): string | null {
  const listed = catalog.setup.installPackages.filter(name => !missing.includes(name))
  if (listed.length === 0)
    return null
  const atCore = listed.includes('@astryx-vue/core')
  return zh
    ? `package.json 已经写了 ${listed.join('、')}，再装 ${missing.join('、')}${atCore ? '，版本和 core 一致' : ''}。`
    : `package.json already lists ${listed.join(', ')}. Add ${missing.join(', ')}${atCore ? ' at the same release as core' : ''}.`
}

/**
 * The install step for the starter packages: add the ones package.json lacks,
 * themes at the project's Core release; or, when both are listed but not on
 * disk (a fresh clone), the project's own install, which keeps its versions.
 */
async function starterInstallStep(cwd: string, project: Project): Promise<StarterInstall> {
  const names = catalog.setup.installPackages
  const missing = missingStarterPackages(project, names)
  if (missing.length > 0)
    return { kind: 'add', missing, commands: starterInstallCommands(project, missing) }
  const onDisk = await Promise.all(names.map(name => isInstalledOnDisk(cwd, name)))
  if (onDisk.includes(false))
    return { kind: 'install-all', missing, commands: installAllCommands(project.packageManager) }
  return { kind: 'none', missing, commands: [] }
}

/** A read or write that failed, with the reason and what to change. */
function writeFailed(verb: 'read' | 'write', shown: string, error: unknown): CliError {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : ''
  const reason = FAILURE_REASONS[code] ?? (code || 'unknown error')
  return new CliError(
    `Could not ${verb} ${shown}: ${reason}. Make that file and its folder ${verb === 'read' ? 'readable' : 'writable'}, or pass --agent-docs-path with a file you can ${verb}.`,
    'ERR_WRITE_FAILED',
    1,
  )
}

const FAILURE_REASONS: Record<string, string> = {
  EACCES: 'permission denied (EACCES)',
  EPERM: 'operation not permitted (EPERM)',
  EROFS: 'the file system is read-only (EROFS)',
  EISDIR: 'it is a folder, not a file (EISDIR)',
  ENOTDIR: 'a part of the path is a file, not a folder (ENOTDIR)',
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
