import type { TopicRecord } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import { text } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { formatTopicDetail, formatTopicList } from '../format.ts'
import { listTopics, resolveTopic } from '../query.ts'
import { DOCS_PACKAGE } from '../spec.ts'

/** `astryx-vue docs [<topic>]`: the guide and theme pages of the docs site. */
export function docsCommand(args: CommandArgs): string {
  const query = args.positionals.join(' ').trim()
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
  if (args.json) {
    return printJson(successEnvelope('docs.detail', {
      ...topicBrief(topic, args.locale),
      summary: text(topic.summary, args.locale),
      headings: topic.headings[args.locale],
      keywords: topic.keywords[args.locale],
      body: text(topic.body, args.locale),
      locale: args.locale,
    }, DOCS_PACKAGE))
  }
  return formatTopicDetail(topic, args.locale, args.dense)
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
