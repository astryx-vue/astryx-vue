import type { ComponentRecord } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import { examplesFor, text } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatComponentDetail, formatComponentList, formatComposableDetail, formatComposableList } from '../format.ts'
import { displayName, listComponents, listComposables, resolveComponent, resolveComposable } from '../query.ts'
import { BINARY } from '../spec.ts'

/** The two record commands, which differ only in which records they read and how they label them. */
export type RecordKind = 'component' | 'composable'

const COLLECTION: Record<RecordKind, string> = { component: 'components', composable: 'composables' }

/**
 * `component` and `composable` share one shape: `--list` prints every record in
 * its group, and a name prints that record. `component <composable name>`
 * resolves too, and says which command reads it properly.
 */
export function recordCommand(args: CommandArgs, kind: RecordKind): string {
  const name = args.positionals.join(' ').trim()
  if (args.options.list === true) {
    if (name)
      throw new CliError(`Do not pass a ${kind} name together with --list.`, 'ERR_INVALID_ARGUMENT', 2)
    const records = kind === 'component' ? listComponents() : listComposables()
    if (args.json)
      return printJson(successEnvelope(`${kind}.list`, { locale: args.locale, detail: 'compact', [COLLECTION[kind]]: groupForList(records, args.locale) }))
    return kind === 'component'
      ? formatComponentList(records, args.locale, args.dense)
      : formatComposableList(records, args.locale, args.dense)
  }
  if (!name)
    throw new CliError(`Pass a ${kind} name, or use --list.`, 'ERR_MISSING_ARGUMENT', 2)
  const record = kind === 'component' ? resolveComponent(name) : resolveComposable(name)
  const hint = record.kind === 'composable' && kind === 'component' ? composableHint(record, args.locale) : ''
  if (args.json) {
    const data = recordDetail(record, args.locale)
    return printJson(successEnvelope(`${kind}.detail`, hint ? { ...data, hint } : data, record.package))
  }
  const detail = kind === 'component'
    ? formatComponentDetail(record, args.locale, args.dense)
    : formatComposableDetail(record, args.locale, args.dense)
  return hint ? `${detail}${hint}\n` : detail
}

function composableHint(record: ComponentRecord, locale: 'en' | 'zh'): string {
  const command = `${BINARY} composable ${displayName(record)}`
  return locale === 'zh'
    ? `这是组合式函数（composable）。用 \`${command}\` 查看。`
    : `This is a composable. Run \`${command}\`.`
}

interface ListEntry {
  name: string
  slug: string
  title: string
  description: string
  /** The package that owns the record, so a reader knows what to install. */
  package: string
  import: string | null
}

function groupForList(records: readonly ComponentRecord[], locale: 'en' | 'zh'): Record<string, ListEntry[]> {
  const grouped: Record<string, ListEntry[]> = {}
  for (const record of records) {
    const group = text(record.groupTitle, locale)
    grouped[group] ??= []
    grouped[group].push({
      name: displayName(record),
      slug: record.slug,
      title: text(record.title, locale),
      description: text(record.summary, locale),
      package: record.package,
      import: record.importPath,
    })
  }
  return grouped
}

function recordDetail(record: ComponentRecord, locale: 'en' | 'zh'): Record<string, unknown> {
  return {
    name: displayName(record),
    slug: record.slug,
    kind: record.kind,
    title: text(record.title, locale),
    group: record.group,
    groupTitle: text(record.groupTitle, locale),
    package: record.package,
    import: record.importPath,
    exportName: record.exportName,
    summary: text(record.summary, locale),
    usage: text(record.usage, locale),
    practices: record.practices[locale],
    props: record.props[locale],
    slots: record.slots[locale],
    events: record.events[locale],
    notes: record.notes[locale],
    examples: examplesFor(record, locale),
    anatomy: record.anatomy[locale],
    accessibility: record.accessibility[locale],
    docsUrl: text(record.docsUrl, locale),
    locale,
  }
}
