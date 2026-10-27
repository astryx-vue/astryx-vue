import type { BuildKit, KitComponent, TemplateMatch } from './build.ts'
import type { ComponentRecord, TableGroup, TableRow, TemplateRecord, ThemeRecord, TopicRecord } from './catalog-types.ts'
import type { InitGuide } from './commands/init.ts'
import type { ThemeStep } from './commands/theme.ts'
import type { SearchHit } from './query.ts'
import type { CopyReceipt } from './templates.ts'
import { examplesFor, text } from './catalog.ts'
import { firstSentence } from './generate/markdown.ts'
import { displayName } from './query.ts'
import { BINARY, CORE_PACKAGE } from './spec.ts'

interface Listing {
  name: string
  description: string
  /** Left out of the line unless it is not core, so the long lists stay readable. */
  package?: string
}

const KIND_LABELS: Record<'en' | 'zh', Record<TopicRecord['kind'], string>> = {
  en: { guide: 'Guides', theme: 'Themes' },
  zh: { guide: '指南', theme: '主题' },
}

export function formatComponentList(components: readonly ComponentRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const component of components) {
    const title = text(component.groupTitle, locale)
    const list = groups.get(title) ?? []
    list.push({ name: label(component, locale), description: text(component.summary, locale), package: component.package })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatComposableList(composables: readonly ComponentRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const composable of composables) {
    const title = text(composable.groupTitle, locale)
    const list = groups.get(title) ?? []
    list.push({ name: displayName(composable), description: text(composable.summary, locale), package: composable.package })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatTopicList(topics: readonly TopicRecord[], locale: 'en' | 'zh', dense: boolean): string {
  const groups = new Map<string, Listing[]>()
  for (const topic of topics) {
    const title = KIND_LABELS[locale][topic.kind]
    const list = groups.get(title) ?? []
    list.push({ name: topic.id, description: text(topic.summary, locale) })
    groups.set(title, list)
  }
  return formatGroupedList(groups, dense)
}

export function formatComposableDetail(composable: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  return formatDetail(composable, locale, dense)
}

export function formatComponentDetail(component: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  return formatDetail(component, locale, dense)
}

export function formatTopicDetail(topic: TopicRecord, locale: 'en' | 'zh', dense: boolean, depthLimited?: string): string {
  const title = text(topic.title, locale)
  const docsUrl = text(topic.docsUrl, locale)
  const body = (depthLimited ?? text(topic.body, locale)).replace(/^# .*\n+/, '')
  if (dense)
    return `${title}  ${topic.id}\n${docsUrl}\n${denseBody(body)}\n`
  return `${[`# ${title}`, '', `Topic: ${topic.id}`, `Docs: ${docsUrl}`, '', body].join('\n').trim()}\n`
}

function formatDetail(record: ComponentRecord, locale: 'en' | 'zh', dense: boolean): string {
  const name = displayName(record)
  const summary = text(record.summary, locale)
  const docsUrl = text(record.docsUrl, locale)
  if (dense) {
    const api = record.kind === 'composable'
      ? record.props[locale].map(group => `${group.heading}: ${group.rows.map(row => propBrief(row)).join(' | ')}`)
      : record.props[locale].length > 0
        ? [`props: ${record.props[locale].flatMap(group => group.rows.map(row => propBrief(row))).join(' | ')}`]
        : []
    const slots = record.slots[locale].flatMap(group => group.rows.map(row => row.name))
    const events = record.events[locale].flatMap(group => group.rows.map(row => row.name))
    const examples = examplesFor(record, locale).map(example => example.title).filter(Boolean)
    const lines = [
      [name, record.importPath ?? '', text(record.groupTitle, locale)].filter(Boolean).join('  '),
      firstSentence(summary),
      ...api,
      slots.length > 0 ? `slots: ${slots.join(', ')}` : '',
      events.length > 0 ? `events: ${events.join(', ')}` : '',
      examples.length > 0 ? `examples: ${examples.join(', ')}` : '',
      docsUrl,
    ].filter(Boolean)
    return `${lines.join('\n')}\n`
  }

  const lines = [
    `# ${name}`,
    '',
    summary,
    '',
    record.importPath ? `Import: \`${importStatement(record)}\`` : '',
    `Group: ${text(record.groupTitle, locale)}`,
    `Docs: ${docsUrl}`,
    '',
    '## Usage',
    '',
    text(record.usage, locale),
  ]
  const practices = record.practices[locale]
  if (practices.length > 0) {
    lines.push('', '## Best practices', '')
    for (const practice of practices)
      lines.push(`- ${practice.guidance}: ${practice.text}`)
  }
  const examples = examplesFor(record, locale)
  if (examples.length > 0) {
    lines.push('', '## Examples', '')
    for (const example of examples) {
      const exampleTitle = example.title || 'Example'
      lines.push(`### ${exampleTitle}`)
      if (example.description)
        lines.push('', example.description)
      if (example.code)
        lines.push('', '```vue', example.code, '```')
      lines.push('')
    }
  }
  for (const group of record.props[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, propColumns(group)))
  for (const group of record.slots[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'description']))
  for (const group of record.events[locale])
    lines.push('', `## ${group.heading}`, '', formatTable(group, ['name', 'payload', 'description']))
  for (const note of record.notes[locale])
    lines.push('', `## ${note.heading}`, '', note.text)
  if (record.anatomy[locale].length > 0) {
    lines.push('', '## Anatomy', '')
    for (const part of record.anatomy[locale])
      lines.push(`- ${part.name}: ${part.description}`)
  }
  if (record.accessibility[locale].length > 0) {
    lines.push('', '## Accessibility', '')
    for (const item of record.accessibility[locale])
      lines.push(`- ${item.name} (${item.requirement}): ${item.description}`)
  }
  return `${lines.filter(line => line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}

function formatGroupedList(groups: Map<string, Listing[]>, dense: boolean): string {
  const blocks: string[] = []
  for (const [title, list] of groups) {
    const lines = list.map(item => dense
      ? `  ${item.name}${packageNote(item)}`
      : `  ${item.name}${packageNote(item)}  ${firstSentence(item.description)}`)
    blocks.push([title, ...lines].join('\n'))
  }
  return `${blocks.join('\n\n')}\n`
}

function packageNote(item: Listing): string {
  return item.package && item.package !== CORE_PACKAGE ? `  (${item.package})` : ''
}

function label(component: ComponentRecord, locale: 'en' | 'zh'): string {
  return locale === 'zh' && component.title.zh !== component.name
    ? `${component.name} (${component.title.zh})`
    : component.name
}

/** Drops blank lines outside fenced code blocks, keeping headings, lists, and code intact. */
function denseBody(body: string): string {
  let fence = false
  const lines: string[] = []
  for (const line of body.split('\n')) {
    if (line.startsWith('```'))
      fence = !fence
    if (!fence && line.trim() === '')
      continue
    lines.push(line)
  }
  return lines.join('\n').trim()
}

export function formatInitGuide(guide: InitGuide, files: readonly { path: string, action: string }[], locale: 'en' | 'zh', dense: boolean): string {
  const zh = locale === 'zh'
  const header = zh ? 'astryx-vue init — 交给 AI 助手的接入说明' : 'astryx-vue init — what an AI assistant has to wire up'
  const managerLine = guide.packageManager
    ? (zh
        ? `包管理器：${guide.packageManager}（来自 ${guide.packageManagerSource === 'packageManager' ? 'package.json 的 packageManager 字段' : guide.lockfile}）`
        : `Package manager: ${guide.packageManager} (from ${guide.packageManagerSource === 'packageManager' ? 'the packageManager field' : guide.lockfile})`)
    : (zh
        ? '包管理器：没探测到（没有 packageManager 字段，也没有锁文件），四种写法都列出来。'
        : 'Package manager: not detected (no packageManager field, no lockfile), so every form is listed.')
  const lines = [header, '', managerLine, '']

  if (!dense) {
    lines.push(zh ? '这个 catalog 覆盖的包：' : 'Packages this catalog covers:', '')
    for (const pkg of guide.packages) {
      const note = pkg.canary ? (zh ? '（canary，API 可能会变）' : ' (canary, the API may change)') : ''
      lines.push(`  ${pkg.name} ${pkg.version}${note}`)
      lines.push(`    ${pkg.description}`)
    }
    lines.push('')
  }

  for (const [index, step] of guide.steps.entries()) {
    lines.push(`${index + 1}. ${step.title}`)
    if (step.text)
      lines.push(...step.text.split('\n').map(line => `   ${line}`))
    if (step.code)
      lines.push('', ...step.code.split('\n').map(line => `   ${line}`), '')
    for (const command of step.commands ?? [])
      lines.push(`   ${command}`)
    lines.push('')
  }

  if (!dense) {
    const extras = guide.packages.filter(pkg => !['@astryx-vue/core', '@astryx-vue/themes'].includes(pkg.name))
    if (extras.length > 0) {
      lines.push(zh ? '按需安装（canary 的要带 @canary）：' : 'Install on demand (canary packages take the tag):', '')
      for (const pkg of extras)
        lines.push(...pkg.install.map(command => `  ${command}`))
      lines.push('')
    }
  }

  if (files.length > 0) {
    lines.push(zh ? '受管理的区块：' : 'Managed block:')
    for (const file of files)
      lines.push(`  ${blockAction(file, locale)}`)
    lines.push('')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

/** How one agent file was handled, in a sentence a reader can act on. */
function blockAction(file: { path: string, action: string }, locale: 'en' | 'zh'): string {
  const zh = locale === 'zh'
  if (file.action === 'created')
    return zh ? `已创建 ${file.path}` : `Created ${file.path}`
  if (file.action === 'appended')
    return zh ? `已追加受管理区块到 ${file.path}` : `Appended the managed block to ${file.path}`
  return zh ? `已更新受管理区块于 ${file.path}` : `Updated the managed block in ${file.path}`
}

export function formatThemeList(themes: readonly ThemeRecord[], locale: 'en' | 'zh', dense: boolean): string {
  if (themes.length === 0)
    return locale === 'zh' ? '这个版本没有内置主题。\n' : 'This version ships no themes.\n'
  const lines = themes.map((theme) => {
    const head = `${theme.slug.padEnd(10)} ${text(theme.title, locale)}`
    if (dense)
      return `  ${head}`
    return `  ${head}  ${firstSentence(text(theme.summary, locale))}  → ${BINARY} theme ${theme.slug}`
  })
  const footer = locale === 'zh'
    ? `\n用 \`${BINARY} theme <名字>\` 看某一套主题怎么接入。\n`
    : `\nRun \`${BINARY} theme <name>\` for how to load one.\n`
  return `${[...lines, footer].join('\n')}`
}

export function formatThemeDetail(theme: ThemeRecord, locale: 'en' | 'zh', dense: boolean, steps: readonly ThemeStep[]): string {
  const head = [
    `# ${text(theme.title, locale)}`,
    '',
    dense ? text(theme.summary, locale) : `${text(theme.summary, locale)}\n\nDocs: ${text(theme.docsUrl, locale)}`,
  ]
  const body = steps.map((step, index) => {
    const lines = [`${index + 1}. ${step.title}`]
    if (step.text)
      lines.push(...step.text.split('\n').map(line => `   ${line}`))
    if (step.code)
      lines.push('', ...step.code.split('\n').map(line => `   ${line}`), '')
    return lines.join('\n').trimEnd()
  })
  return `${[...head, '', ...body].join('\n').trimEnd()}\n`
}

export function formatSearch(query: string, matchCount: number, results: readonly SearchHit[], locale: 'en' | 'zh', dense: boolean): string {
  if (results.length === 0)
    return locale === 'zh' ? `没有匹配「${query}」的结果。\n` : `No matches for "${query}".\n`
  const lines = results.map((hit) => {
    // The package says what to install, so every result carries it.
    const head = `[${hit.domain}] ${hit.name}  ${hit.package}`
    const follow = `→ ${hit.command}`
    if (dense)
      return `${head}  ${follow}`
    return [head, `  ${firstSentence(hit.description)}`, `  ${follow}`].join('\n')
  })
  const heading = matchCount > results.length
    ? (locale === 'zh' ? `「${query}」的结果（${results.length}/${matchCount}）` : `Results for "${query}" (${results.length} of ${matchCount})`)
    : (locale === 'zh' ? `「${query}」的结果（${results.length}）` : `Results for "${query}" (${results.length})`)
  return `${[heading, '', ...lines].join('\n')}\n`
}

function importStatement(component: ComponentRecord): string {
  const imported = component.exportName ?? component.name
  return `import { ${imported} } from '${component.importPath}'`
}

function propBrief(row: TableRow): string {
  const value = row.default && !/^[—-]$/.test(row.default) ? `=${row.default}` : ''
  return `${row.name}${value}`
}

/** Drops the Default column when the rows do not use it, which is the common case for return values. */
function propColumns(group: TableGroup): (keyof TableRow)[] {
  return group.rows.some(row => row.default !== undefined)
    ? ['name', 'type', 'default', 'description']
    : ['name', 'type', 'description']
}

function formatTable(group: TableGroup, columns: (keyof TableRow)[]): string {
  const header = columns.map(column => column === 'name' ? 'Name' : column === 'type' ? 'Type' : column === 'default' ? 'Default' : column === 'payload' ? 'Payload' : 'Description')
  const rows = group.rows.map(row => columns.map(column => row[column] ?? ''))
  const widths = header.map((label, index) => Math.max(label.length, ...rows.map(row => row[index]?.length ?? 0)))
  const render = (cells: string[]): string => `| ${cells.map((cell, index) => cell.padEnd(widths[index] ?? cell.length)).join(' | ')} |`
  return [render(header), `| ${widths.map(width => '-'.repeat(width)).join(' | ')} |`, ...rows.map(render)].join('\n')
}

export function formatTemplateList(templates: readonly TemplateRecord[], locale: 'en' | 'zh', dense: boolean): string {
  if (templates.length === 0)
    return locale === 'zh' ? '还没有 block 模板。目前全部模板都是 page。\n' : 'No block templates yet. Every template is a page.\n'
  const groups = new Map<string, TemplateRecord[]>()
  for (const template of templates) {
    const title = text(template.category, locale)
    groups.set(title, [...(groups.get(title) ?? []), template])
  }
  const blocks: string[] = []
  for (const [title, list] of groups) {
    const lines = list.map((template) => {
      const status = template.isReady ? '' : (locale === 'zh' ? '（不可用）' : ' (not ready)')
      return dense
        ? `  ${template.slug}${status}`
        : `  ${template.slug}  ${text(template.title, locale)}${status} — ${text(template.description, locale)}`
    })
    blocks.push([title, ...lines].join('\n'))
  }
  const notReady = templates.filter(template => !template.isReady).length
  const footer = notReady > 0
    ? (locale === 'zh'
        ? `\n有 ${notReady} 个模板标了（不可用）：它们引用了用户项目装不上的包，能读不能复制。用 \`${BINARY} template <slug>\` 看原因。\n`
        : `\n${notReady} template(s) are marked not ready: they import a package a project cannot install, so they can be read but not copied. \`${BINARY} template <slug>\` says why.\n`)
    : ''
  return `${blocks.join('\n\n')}\n${footer}`
}

export function formatTemplateDetail(template: TemplateRecord, locale: 'en' | 'zh', dense: boolean, source: string): string {
  const title = text(template.title, locale)
  const status = template.isReady
    ? (locale === 'zh' ? '状态：可复制' : 'Status: ready to copy')
    : (locale === 'zh' ? `状态：不可复制 — ${text(template.notReadyReason ?? { en: '', zh: '' }, locale)}` : `Status: not copyable — ${text(template.notReadyReason ?? { en: '', zh: '' }, locale)}`)
  const head = dense
    ? [title, template.slug, status, template.componentsUsed.join(', '), text(template.docsUrl, locale)]
    : [
        `# ${title}`,
        '',
        `${template.slug}  ${template.kind}  ${text(template.category, locale)}`,
        '',
        text(template.description, locale),
        '',
        `Docs: ${text(template.docsUrl, locale)}`,
        status,
        '',
        `Components: ${template.componentsUsed.join(', ')}`,
      ]
  if (dense)
    return `${head.join('\n')}\n\n${source.trim()}\n`
  return `${head.join('\n')}\n\n## Source\n\n\`\`\`vue\n${source.trim()}\n\`\`\`\n`
}

export function formatTemplateSkeleton(template: TemplateRecord, locale: 'en' | 'zh', skeleton: string): string {
  const lines = [
    `# ${text(template.title, locale)} — ${locale === 'zh' ? '骨架' : 'skeleton'}`,
    '',
    text(template.description, locale),
    '',
    `${locale === 'zh' ? '组件' : 'Components'}: ${template.componentsUsed.join(', ')}`,
    '',
    skeleton,
  ]
  return `${lines.join('\n').trim()}\n`
}

export function formatTemplateCopy(receipt: CopyReceipt, locale: 'en' | 'zh'): string {
  const zh = locale === 'zh'
  const lines = [zh ? `已写入 ${receipt.outputPath}` : `Wrote ${receipt.outputPath}`]
  if (receipt.demoMediaReplaced > 0) {
    lines.push(zh
      ? `把 ${receipt.demoMediaReplaced} 处演示图片地址换成了灰色占位图。`
      : `Replaced ${receipt.demoMediaReplaced} demo image path(s) with a grey placeholder.`)
  }
  if (receipt.missingPackages.length > 0) {
    lines.push(zh ? `缺少的包：${receipt.missingPackages.join(', ')}` : `Missing packages: ${receipt.missingPackages.join(', ')}`)
    if (receipt.installCommand)
      lines.push(zh ? `安装：${receipt.installCommand}` : `Install: ${receipt.installCommand}`)
  }
  for (const note of receipt.notes)
    lines.push(note)
  return `${lines.join('\n')}\n`
}

export function formatBuildHelp(locale: 'en' | 'zh'): string {
  if (locale === 'zh') {
    return [
      `${BINARY} build "<一句话想法>"`,
      '',
      '把一句话变成起点：最接近的页面模板，加上要用的组件。完全离线，结果确定，不调用模型。',
      '',
      '步骤：',
      `  1. \`${BINARY} build "登录页"\` 看推荐的模板和组件。`,
      `  2. \`${BINARY} template <slug> ./src/pages\` 把它落到项目里再改。`,
      `  3. 写代码前用 \`${BINARY} component <Name>\` 和 \`${BINARY} composable <Name>\` 查用法，不要猜 props。`,
      '',
      '规则：',
      '  - 只在名字、标题、描述、关键词和用到的组件上做关键词加权匹配，没有网络，没有模型。',
      '  - 标为「不可用」的模板排在可复制模板之后，复制会被拒绝。',
      '  - 匹配太弱时宁可不给，也不硬凑。',
      '',
      `相关命令：\`${BINARY} template --list\`、\`${BINARY} search <query> --type template\`、\`${BINARY} manifest --json\`。`,
      '',
    ].join('\n')
  }
  return [
    `${BINARY} build "<one sentence>"`,
    '',
    'Turns one sentence into a starting point: the closest page template plus the components to use. Offline, deterministic, no model.',
    '',
    'Steps:',
    `  1. \`${BINARY} build "login page"\` to see the template and components it recommends.`,
    `  2. \`${BINARY} template <slug> ./src/pages\` to copy it into the project and change it.`,
    `  3. \`${BINARY} component <Name>\` and \`${BINARY} composable <Name>\` before writing code. Do not guess props.`,
    '',
    'Rules:',
    '  - Weighted keyword match over slug, title, description, keywords, and the components a template uses. No network, no model.',
    '  - Templates marked not ready rank below ready ones, and copying them is refused.',
    '  - A weak match is dropped rather than padded.',
    '',
    `Related: \`${BINARY} template --list\`, \`${BINARY} search <query> --type template\`, \`${BINARY} manifest --json\`.`,
    '',
  ].join('\n')
}

export function formatBuildKit(kit: BuildKit, dense: boolean): string {
  const zh = kit.locale === 'zh'
  const lines: string[] = [`${zh ? '想法' : 'Idea'}: ${kit.idea}`, '']

  lines.push('TEMPLATE')
  if (kit.template) {
    lines.push(...matchLines(kit.template, dense))
    lines.push(`  ${zh ? '下一步' : 'Next'}: ${kit.template.copyCommand}`)
  }
  else {
    lines.push(zh ? '  （没有匹配到模板）' : '  (no template matched)')
  }

  if (kit.otherTemplates.length > 0) {
    lines.push('', 'OTHER TEMPLATES')
    for (const match of kit.otherTemplates)
      lines.push(...matchLines(match, dense))
  }

  if (kit.components.length > 0) {
    lines.push('', 'COMPONENTS')
    for (const item of kit.components)
      lines.push(...componentLines(item, dense))
  }

  if (kit.composables.length > 0) {
    lines.push('', 'COMPOSABLES')
    for (const item of kit.composables)
      lines.push(...componentLines(item, dense))
  }

  if (kit.notes.length > 0) {
    lines.push('')
    for (const note of kit.notes)
      lines.push(`Note: ${note}`)
  }
  return `${lines.join('\n').trimEnd()}\n`
}

function matchLines(match: TemplateMatch, dense: boolean): string[] {
  if (dense)
    return [`  ${match.slug}${match.isReady ? '' : ' (not ready)'}`]
  const lines = [`  ${match.slug}  ${match.title}`, `  ${match.description}`]
  if (match.matchedTerms.length > 0)
    lines.push(`  Matched: ${match.matchedTerms.join(', ')}`)
  if (!match.isReady && match.notReadyReason)
    lines.push(`  Not ready: ${match.notReadyReason}`)
  return lines
}

function componentLines(item: KitComponent, dense: boolean): string[] {
  if (dense)
    return [`  ${item.name}`]
  const from = item.reason === 'template' ? '  (used by the template)' : ''
  return [`  ${item.name} — ${firstSentence(item.description)}${from}`, `  → ${item.command}`]
}
