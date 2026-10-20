/**
 * 把文档页面的 Markdown 源文件转换成纯文本版本。
 * 这里只有文本变换，不读文件、不依赖 VitePress，方便单元测试。
 *
 * 转换结果给 AI agent 读，所以目标是：保留正文、表格和示例代码，
 * 去掉只在浏览器里才成立的 frontmatter、`<script setup>` 和各种 Vue 组件标签。
 */

export interface MarkdownSegment {
  type: 'prose' | 'fence'
  text: string
}

export interface BlockTag {
  name: string
  attrs: Record<string, string>
}

/**
 * 把块级组件换成 Markdown。返回值 `undefined` 表示这个组件没有可交付的正文，
 * 交给后面的通用去标签步骤处理。
 */
export type BlockExpander = (tag: BlockTag) => string | undefined

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/
const FENCE_LINE = /^[ \t]{0,3}(`{3,}|~{3,})/
const SELF_CLOSING_BLOCK_TAG = /^[ \t]*<([A-Z][\w.]*)(?=[\s/>])([^<>]*?)\/>$/gm
const ATTRIBUTE = /([:@]?[\w.-]+)\s*=\s*"([^"]*)"/g
const VUE_TAG = /<\/?[A-Z][\w.]*(?:\s[^<>]*?)?\/?>/g
const HTML_COMMENT = /<!--[\s\S]*?-->/g
const SCRIPT_OR_STYLE = /<(script|style)\b[^<>]*>[\s\S]*?<\/\1>/gi
const HTML_TABLE = /^[ \t]*<table\b[^<>]*>[\s\S]*?<\/table>/gm
const DIV_LINE = /^[ \t]*<\/?div\b[^<>]*>[ \t]*$/gm
const TABLE_ROW = /<tr\b[^<>]*>([\s\S]*?)<\/tr>/gi
const TABLE_CELL = /<t[hd]\b[^<>]*>([\s\S]*?)<\/t[hd]>/gi
const PLACEHOLDER = /\0(\d+)\0/g

const ENTITIES: Record<string, string> = {
  amp: '&',
  apos: '\'',
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
}

/** 页面里少量实体写法（`&quot;`、`&gt;`）转回真字符，其余保持原样。 */
export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (all, body: string) => {
    if (body.startsWith('#x') || body.startsWith('#X'))
      return String.fromCodePoint(Number.parseInt(body.slice(2), 16))
    if (body.startsWith('#'))
      return String.fromCodePoint(Number.parseInt(body.slice(1), 10))
    return ENTITIES[body.toLowerCase()] ?? all
  })
}

/** 围栏长度要压过正文里最长的反引号串，示例源码里经常出现 ```。 */
export function fenceFor(code: string): string {
  return '`'.repeat(Math.max(3, ...Array.from(code.matchAll(/`+/g), match => match[0].length + 1)))
}

export function fenceBlock(code: string, language: string): string {
  const fence = fenceFor(code)
  return `${fence}${language}\n${code.replace(/\s+$/, '')}\n${fence}`
}

/** 去掉文件头的 frontmatter，顺手把里面的标量字段读出来。 */
export function stripFrontmatter(source: string): { data: Record<string, string>, body: string } {
  const match = FRONTMATTER.exec(source)
  if (match === null)
    return { data: {}, body: source }

  const data: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const pair = /^([\w-]+):(.*)$/.exec(line.trim())
    if (pair !== null)
      data[pair[1]] = pair[2].trim().replace(/^['"]|['"]$/g, '')
  }

  return { data, body: source.slice(match[0].length) }
}

/**
 * 按代码围栏切段。围栏内的内容是原文，任何标签处理都不能碰，
 * 因为这些示例代码本来就该带着 `<script setup>` 和 `<Button>` 出现。
 */
export function splitFenceSegments(markdown: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  let buffer: string[] = []
  let open: string | null = null

  const flush = (type: MarkdownSegment['type']): void => {
    if (buffer.length === 0)
      return
    segments.push({ type, text: buffer.join('\n') })
    buffer = []
  }

  for (const line of markdown.split('\n')) {
    const marker = FENCE_LINE.exec(line)
    if (open === null) {
      if (marker !== null) {
        flush('prose')
        open = marker[1]
      }
      buffer.push(line)
      continue
    }

    buffer.push(line)
    const closes = marker !== null
      && marker[1][0] === open[0]
      && marker[1].length >= open.length
      && line.trim() === marker[1]
    if (closes) {
      flush('fence')
      open = null
    }
  }

  flush(open === null ? 'prose' : 'fence')
  return segments
}

/** 解析标签上的属性。`:` 和 `@` 前缀只用来区分绑定，键名统一去掉前缀。 */
export function parseAttributes(text: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const match of text.matchAll(ATTRIBUTE))
    attrs[match[1].replace(/^[:@]/, '')] = decodeEntities(match[2])
  return attrs
}

/** 把 `:sections="['color', 'focus']"` 这类内联数组读成字符串数组。 */
export function parseStringArray(value: string | undefined): string[] | null {
  if (value === undefined)
    return null
  const items = Array.from(value.matchAll(/'([^']*)'|"([^"]*)"/g), match => match[1] ?? match[2])
  return items.length === 0 ? null : items
}

function tableCell(html: string): string {
  const withCode = html.replace(/<code\b[^<>]*>([\s\S]*?)<\/code>/gi, (_all, code: string) => `\`${code.trim()}\``)
  const text = decodeEntities(withCode.replace(/<br\s*\/?>/gi, ' ').replace(/<[^<>]+>/g, ' '))
  return text.replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
}

/** 组件 API 表在源文件里是 HTML 表格，转成 Markdown 表格给纯文本读者。 */
export function htmlTableToMarkdown(tableHtml: string): string {
  const rows = Array.from(tableHtml.matchAll(TABLE_ROW), row =>
    Array.from(row[1].matchAll(TABLE_CELL), cell => tableCell(cell[1])))
  if (rows.length === 0)
    return ''

  const width = Math.max(...rows.map(row => row.length))
  const normalize = (row: string[]): string[] => {
    const cells = [...row]
    while (cells.length < width)
      cells.push('')
    return cells
  }
  const [header, ...body] = rows.map(normalize)
  const line = (row: string[]): string => `| ${row.join(' | ')} |`

  return [
    line(header),
    line(header.map(() => '---')),
    ...body.map(line),
  ].join('\n')
}

/** 去掉 Vue 组件标签本身，保留它包住的文字（`<Badge>New</Badge>` → `New`）。 */
export function unwrapVueTags(text: string): string {
  return text.replace(VUE_TAG, '')
}

function collapseBlankLines(text: string): string {
  return text
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function transformProse(prose: string, expand: BlockExpander): string {
  const stashed: string[] = []
  const text = prose
    .replace(SELF_CLOSING_BLOCK_TAG, (all, name: string, attrText: string) => {
      const expanded = expand({ name, attrs: parseAttributes(attrText) })
      if (expanded === undefined)
        return all
      stashed.push(expanded)
      return `\u0000${stashed.length - 1}\u0000`
    })
    .replace(HTML_COMMENT, '')
    .replace(SCRIPT_OR_STYLE, '')
    .replace(HTML_TABLE, table => htmlTableToMarkdown(table))
    .replace(DIV_LINE, '')
    .replace(VUE_TAG, '')

  return text.replace(PLACEHOLDER, (_all, index: string) => stashed[Number(index)] ?? '')
}

/** 把一页源码转成纯 Markdown，代码围栏原样保留。 */
export function toPlainMarkdown(source: string, expand: BlockExpander): string {
  const { body } = stripFrontmatter(source)
  const text = splitFenceSegments(body)
    .map(segment => segment.type === 'fence' ? segment.text : transformProse(segment.text, expand))
    .join('\n')
  return collapseBlankLines(text)
}

/** 拼一篇文档：先给标题，再按顺序接上各段正文。 */
export function mergeSections(title: string, sections: ReadonlyArray<{ heading?: string, markdown: string }>): string {
  const bodies = sections
    .map(section => ({ heading: section.heading, body: section.markdown.trim() }))
    .filter(section => section.body !== '')
  const parts = bodies[0]?.body.startsWith('# ') ? [] : [`# ${title}`]

  for (const section of bodies) {
    if (section.heading !== undefined && !/^#{1,2}\s/.test(section.body))
      parts.push(`## ${section.heading}`)
    parts.push(section.body)
  }

  return `${parts.join('\n\n')}\n`
}

/** 去掉行内 Markdown 记号，用来把段落压成一句话说明。 */
export function toPlainSentence(text: string): string {
  return decodeEntities(text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim())
}

/**
 * 取页面开头第一段正文，用作列表里的一句话说明。
 * 以冒号结尾的那段通常是在引出下面的代码，先跳过它。
 */
export function firstParagraph(markdown: string): string {
  const candidates: string[] = []
  for (const segment of splitFenceSegments(markdown)) {
    if (segment.type !== 'prose')
      continue
    for (const block of segment.text.split(/\n{2,}/)) {
      const text = block.trim()
      if (text === '' || /^(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|\||>|:::)/.test(text) || /^<[a-z]/i.test(text))
        continue
      candidates.push(toPlainSentence(text))
    }
  }

  return candidates.find(candidate => !/[:：]$/.test(candidate)) ?? candidates[0] ?? ''
}

/** 截到指定长度，尽量断在词或句子边界上。 */
export function truncate(text: string, max: number): string {
  if (text.length <= max)
    return text
  const slice = text.slice(0, max)
  const cut = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('。'), slice.lastIndexOf('; '), slice.lastIndexOf(' '))
  return `${(cut > max * 0.6 ? slice.slice(0, cut) : slice).replace(/[.,;。，；]$/, '')}…`
}
