import type { CommandArgs } from '../cli/context.ts'
import type { SearchType } from '../spec.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatSearch } from '../format.ts'
import { searchCatalog } from '../query.ts'

const DEFAULT_LIMIT = 20

/** `astryx-vue search <words>`: one ranked list across components, composables, docs, and templates. */
export function searchCommand(args: CommandArgs): string {
  const query = args.positionals.join(' ').trim()
  const limit = args.options.limit === undefined ? DEFAULT_LIMIT : Number(args.options.limit)
  if (!Number.isInteger(limit) || limit < 1)
    throw new CliError('--limit must be a positive integer.', 'ERR_INVALID_ARGUMENT', 2)
  const type = args.options.type as SearchType | undefined
  const { matchCount, results } = searchCatalog(query, args.locale, { limit, type })
  if (args.json) {
    return printJson(successEnvelope('search', {
      query,
      locale: args.locale,
      matchCount,
      results: results.map(result => ({
        domain: result.domain,
        name: result.name,
        package: result.package,
        score: result.score,
        reason: result.reason,
        description: result.description,
        command: result.command,
        ...(result.import ? { import: result.import } : {}),
        title: result.title,
        docsUrl: result.docsUrl,
      })),
    }))
  }
  return formatSearch(query, matchCount, results, args.locale, args.dense)
}
