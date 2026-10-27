import type { UpgradeRename, UpgradeSection } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import type { Project } from '../project.ts'
import { catalog } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatUpgradeReport } from '../format-upgrade.ts'
import { compareVersions, findLines, installCommands, readProject, readSourceFiles, versionOf } from '../project.ts'
import { CORE_PACKAGE } from '../spec.ts'

/** How many places the report lists before it says how many more there are. */
const HIT_LIMIT = 200

export type UpgradeStatus = 'outdated' | 'up-to-date' | 'not-installed' | 'unknown'

export interface UpgradeHit {
  /** Path relative to the project root, with `/` separators. */
  file: string
  line: number
  text: string
  from: string
  to: string
}

export interface UpgradeReport {
  status: UpgradeStatus
  package: string
  /** The version the project has, when package.json states one this CLI can read. */
  current: string | null
  /** The version this CLI was generated from. */
  latest: string
  locale: 'en' | 'zh'
  guideUrl: string
  changelogUrl: string
  /** What to do, one section per change in the upgrade guide. */
  sections: UpgradeSection[]
  /** The old names the guide replaces, so a reader can search their own code. */
  renames: UpgradeRename[]
  hits: UpgradeHit[]
  /** True when more places matched than the report lists. */
  truncated: boolean
  notes: string[]
}

/**
 * `upgrade` reads the version the project has, compares it with the version this
 * CLI was generated from, and prints what the upgrade guide says about getting
 * from one to the other, plus where the old names still appear in the project.
 * It never writes.
 */
export async function upgradeCommand(args: CommandArgs): Promise<string> {
  if (args.positionals.length > 0)
    throw new CliError('upgrade does not take a positional argument.', 'ERR_INVALID_ARGUMENT', 2)
  const project = await readProject(args.cwd)
  const report = await buildReport(project, args)
  if (args.json)
    return printJson(successEnvelope('upgrade.report', report))
  return formatUpgradeReport(report, args.dense)
}

async function buildReport(project: Project, args: CommandArgs): Promise<UpgradeReport> {
  const core = catalog.packages.find(pkg => pkg.name === CORE_PACKAGE)
  const latest = core?.version ?? '0.0.0'
  const range = project.dependencies[CORE_PACKAGE]
  const current = versionOf(range)
  const status: UpgradeStatus = range === undefined
    ? 'not-installed'
    : current === null
      ? 'unknown'
      : compareVersions(current, latest) < 0 ? 'outdated' : 'up-to-date'
  const notes: string[] = []
  if (status === 'not-installed')
    notes.push(...installCommands(project.packageManager, [CORE_PACKAGE]))
  if (status === 'unknown')
    notes.push(`${CORE_PACKAGE} is set to ${JSON.stringify(range)}, which this CLI cannot turn into a version.`)

  const renames = status === 'outdated' ? catalog.upgrade.renames : []
  const { hits, truncated } = status === 'outdated'
    ? await findOldNames(args.cwd, renames)
    : { hits: [], truncated: false }

  return {
    status,
    package: CORE_PACKAGE,
    current,
    latest,
    locale: args.locale,
    guideUrl: catalog.upgrade.guideUrl[args.locale],
    changelogUrl: catalog.upgrade.changelogUrl[args.locale],
    sections: status === 'outdated' ? catalog.upgrade.sections[args.locale] : [],
    renames,
    hits,
    truncated,
    notes,
  }
}

/**
 * Reads the project once and looks for each old name. A theme target name only
 * counts as an object key (`progressbar: {`), because the same word is also an
 * HTML tag and would otherwise match every page. A property or option name
 * counts wherever it appears as a word, in camelCase or in kebab-case, which is
 * how a template writes it.
 */
async function findOldNames(cwd: string, renames: readonly UpgradeRename[]): Promise<{ hits: UpgradeHit[], truncated: boolean }> {
  if (renames.length === 0)
    return { hits: [], truncated: false }
  const files = await readSourceFiles(cwd)
  const hits = new Map<string, UpgradeHit>()
  for (const file of files) {
    for (const rename of renames) {
      // Test the whole file once per name: most files hold none of them, and
      // only the files that do are read line by line.
      const patterns = patternsFor(rename.from)
      if (!patterns.some(pattern => pattern.test(file.text)))
        continue
      for (const hit of findLines(file, line => patterns.some(pattern => pattern.test(line)))) {
        hits.set(`${hit.path}:${hit.line}:${rename.from}`, { file: hit.path, line: hit.line, text: hit.text, from: rename.from, to: rename.to })
      }
    }
  }
  const sorted = [...hits.values()]
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
    .slice(0, HIT_LIMIT)
  return { hits: sorted, truncated: hits.size > sorted.length }
}

function isThemeKey(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name)
}

/** The regular expressions one old name is looked for with. */
function patternsFor(name: string): RegExp[] {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  if (name.includes('=') || !isThemeKey(name)) {
    const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    return [
      new RegExp(`(^|[^\\w$-])${escaped}(?![\\w-])`),
      ...(kebab === name ? [] : [new RegExp(`(^|[^\\w$-])${kebab}(?![\\w-])`)]),
    ]
  }
  return [new RegExp(`(^|[^\\w-])['"\`]?${escaped}['"\`]?\\s*:\\s*[{(]`)]
}
