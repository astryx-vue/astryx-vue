import type { AgentName } from '../agents.ts'
import type { CatalogPackage } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import type { PackageManager } from '../project.ts'
import { existsSync, mkdirSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { applyManagedBlock, existingAgentDocs, renderAgentBlock, resolveAgentTargets } from '../agents.ts'
import { catalog } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatInitGuide } from '../format.ts'
import { assertWithinProject, toPosix } from '../paths.ts'
import { installCommands, readProject } from '../project.ts'
import { BINARY } from '../spec.ts'

const AGENT_NAMES: readonly AgentName[] = ['cursor', 'claude', 'codex', 'hermes', 'all']

/** One package `init` names, with the command that installs exactly that package. */
export interface InitPackage {
  name: string
  version: string
  description: string
  canary: boolean
  /** The specifier to install: a canary package takes the tag. */
  specifier: string
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
  const guide = initGuide(project.packageManager, project.packageManagerSource, project.lockfile, args.locale)
  const files = features.includes('agents') ? await writeAgentBlock(args, agent) : []

  const data = {
    mode: 'features' as const,
    features,
    /** `auto` means the target came from what the project already has. */
    agent: agent ?? 'auto',
    files,
    guide,
  }
  if (args.json)
    return printJson(successEnvelope('init.run', data))
  return formatInitGuide(guide, files, args.locale, args.dense)
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

async function writeAgentBlock(args: CommandArgs, agent: AgentName | null): Promise<{ path: string, action: string }[]> {
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
  const files: { path: string, action: string }[] = []
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
        throw new CliError(`Could not read ${shown}.`, 'ERR_WRITE_FAILED', 1)
    }
    const next = applyManagedBlock(existing, inner)
    try {
      mkdirSync(dirname(absolute), { recursive: true })
      await writeFile(absolute, next.content)
    }
    catch {
      throw new CliError(`Could not write ${shown}.`, 'ERR_WRITE_FAILED', 1)
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
function initGuide(manager: PackageManager | null, source: InitGuide['packageManagerSource'], lockfile: string | null, locale: 'en' | 'zh'): InitGuide {
  const zh = locale === 'zh'
  const packages = catalog.packages.map((pkg: CatalogPackage): InitPackage => {
    const specifier = pkg.canary ? `${pkg.name}@canary` : pkg.name
    return {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      canary: pkg.canary,
      specifier,
      install: installCommands(manager, [specifier]),
    }
  })
  const core = catalog.packages.find(pkg => pkg.name === '@astryx-vue/core')
  const themes = catalog.packages.find(pkg => pkg.name === '@astryx-vue/themes')
  const starterInstalls = installCommands(manager, catalog.setup.installPackages)

  const steps: InitStep[] = [
    {
      id: 'install',
      title: zh ? '安装包' : 'Install the packages',
      text: zh
        ? `起步只需要 core 和 themes${core && themes ? `（${core.version}）` : ''}。`
        : `A project needs core and themes to start${core && themes ? ` (${core.version})` : ''}.`,
      commands: starterInstalls,
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
  return { packageManager: manager, packageManagerSource: source, lockfile, packages, steps }
}

function isMissing(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT'
}
