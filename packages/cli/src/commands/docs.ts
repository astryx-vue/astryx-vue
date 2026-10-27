import type { TopicRecord } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import { text } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { limitBodyDepth, parseDepth } from '../docs-depth.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatTopicDetail, formatTopicList } from '../format.ts'
import { listTopics, resolveTopic } from '../query.ts'
import { DOCS_PACKAGE } from '../spec.ts'

/** `astryx-vue docs [<topic>]`: the guide and theme pages of the docs site. */
export function docsCommand(args: CommandArgs): string {
  const query = args.positionals.join(' ').trim()
  const depth = parseDepth(args.options.depth)
  if (depth !== null && !Number.isInteger(depth))
    throw new CliError('--depth must be a positive integer.', 'ERR_INVALID_ARGUMENT', 2)
  if (depth !== null && !query)
    throw new CliError('--depth only applies to one topic. Pass a topic name.', 'ERR_INVALID_ARGUMENT', 2)
  if (!query) {
    const topics = listTopics()
    if (args.json) {
      const grouped: Record<string, { id: string, kind: string, title: string, description: string, docsUrl: string }[]> = {}
      for (const topic of topics) {
        const group = topic.kind === 'guide' ? 'guide' : 'theme'
        grouped[group] ??= []
        grouped[group].push(topicBrief(topic, args.locale))
      }
      return printJson(successEnvelope('docs.list', { locale: args.locale, detail: 'compact', topics: grouped }, DOCS_PACKAGE))
    }
    return formatTopicList(topics, args.locale, args.dense)
  }
  const topic = resolveTopic(query)
  const limited = depth === null
    ? { body: text(topic.body, args.locale), headings: topic.headings[args.locale] }
    : limitBodyDepth(text(topic.body, args.locale), depth, topic.headings[args.locale])
  if (args.json) {
    return printJson(successEnvelope('docs.detail', {
      ...topicBrief(topic, args.locale),
      summary: text(topic.summary, args.locale),
      headings: limited.headings,
      keywords: topic.keywords[args.locale],
      body: limited.body,
      ...(depth === null ? {} : { depth }),
      locale: args.locale,
    }, DOCS_PACKAGE))
  }
  return formatTopicDetail(topic, args.locale, args.dense, limited.body)
}

function topicBrief(topic: TopicRecord, locale: 'en' | 'zh'): { id: string, kind: string, title: string, description: string, docsUrl: string } {
  return {
    id: topic.id,
    kind: topic.kind,
    title: text(topic.title, locale),
    description: text(topic.summary, locale),
    docsUrl: text(topic.docsUrl, locale),
  }
}
