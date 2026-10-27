export type IcuValue = string | number | undefined

type Node
  = | { type: 'text', value: string }
    | { type: 'pound' }
    | { type: 'arg', name: string }
    | { type: 'number', name: string }
    | { type: 'plural', name: string, offset: number, ordinal: boolean, options: PluralOption[] }
    | { type: 'select', name: string, options: PluralOption[] }

interface PluralOption {
  selector: string
  nodes: Node[]
}

const pluralRules = new Map<string, Intl.PluralRules>()
const ordinalRules = new Map<string, Intl.PluralRules>()
const numberFormats = new Map<string, Intl.NumberFormat>()

function rulesFor(locale: string, ordinal: boolean): Intl.PluralRules {
  const cache = ordinal ? ordinalRules : pluralRules
  let rules = cache.get(locale)
  if (rules == null) {
    rules = new Intl.PluralRules(locale, ordinal ? { type: 'ordinal' } : undefined)
    cache.set(locale, rules)
  }
  return rules
}

function numberFor(locale: string): Intl.NumberFormat {
  let format = numberFormats.get(locale)
  if (format == null) {
    format = new Intl.NumberFormat(locale)
    numberFormats.set(locale, format)
  }
  return format
}

/**
 * 解析原版目录里的 ICU MessageFormat。
 * 覆盖 `{name}`、`{name, number}`、`plural`、`selectordinal` 和 `select`。
 * 解析失败时抛错，调用方负责把这个键记进未映射列表。
 */
export function formatIcu(message: string, values: Record<string, IcuValue>, locale: string): string {
  return render(parseMessage(message), values, locale, undefined)
}

export function icuPlaceholderNames(message: string): string[] {
  return Object.keys(icuArgumentKinds(message))
}

/** 占位符的写法：`{name}` 是 `argument`，其余和 ICU 关键字同名。 */
export type IcuArgumentKind = 'argument' | 'number' | 'plural' | 'selectordinal' | 'select'

/**
 * 每个占位符名字用到的写法，已排序去重。
 * 译文和原文的这张表一致，说明两边收同样的值；字面文字和占位符顺序不算在内。
 * 解析失败时抛错。
 */
export function icuArgumentKinds(message: string): Record<string, IcuArgumentKind[]> {
  const kinds = new Map<string, Set<IcuArgumentKind>>()
  collectKinds(parseMessage(message), kinds)
  return Object.fromEntries([...kinds].map(([name, set]) => [name, [...set].sort()]))
}

function collectKinds(nodes: Node[], kinds: Map<string, Set<IcuArgumentKind>>): void {
  for (const node of nodes) {
    if (node.type === 'text' || node.type === 'pound')
      continue
    const kind: IcuArgumentKind = node.type === 'arg'
      ? 'argument'
      : node.type === 'plural' && node.ordinal ? 'selectordinal' : node.type
    const set = kinds.get(node.name) ?? new Set<IcuArgumentKind>()
    set.add(kind)
    kinds.set(node.name, set)
    if (node.type === 'plural' || node.type === 'select') {
      for (const option of node.options)
        collectKinds(option.nodes, kinds)
    }
  }
}

function render(
  nodes: Node[],
  values: Record<string, IcuValue>,
  locale: string,
  pound: number | undefined,
): string {
  let text = ''
  for (const node of nodes)
    text += renderNode(node, values, locale, pound)
  return text
}

function renderNode(
  node: Node,
  values: Record<string, IcuValue>,
  locale: string,
  pound: number | undefined,
): string {
  if (node.type === 'text')
    return node.value
  if (node.type === 'pound')
    return pound == null ? '' : numberFor(locale).format(pound)
  if (node.type === 'arg')
    return textValue(values[node.name])
  if (node.type === 'number') {
    const value = numericValue(values[node.name])
    return value == null ? '' : numberFor(locale).format(value)
  }
  if (node.type === 'select')
    return renderChoice(node.options, selectSelector(values[node.name]), values, locale, pound)
  const value = numericValue(values[node.name])
  const rounded = value == null ? undefined : value - node.offset
  const selector = value == null ? 'other' : pluralSelector(value, node.options, locale, node.ordinal)
  return renderChoice(node.options, selector, values, locale, rounded)
}

function pluralSelector(value: number, options: PluralOption[], locale: string, ordinal: boolean): string {
  const exact = exactSelector(value)
  if (exact != null && options.some(option => option.selector === exact))
    return exact
  return rulesFor(locale, ordinal).select(value)
}

function renderChoice(
  options: PluralOption[],
  selector: string,
  values: Record<string, IcuValue>,
  locale: string,
  pound: number | undefined,
): string {
  const match = options.find(option => option.selector === selector)
    ?? options.find(option => option.selector === 'other')
    ?? options[0]
  return match == null ? '' : render(match.nodes, values, locale, pound)
}

function textValue(value: IcuValue): string {
  if (value == null)
    return ''
  return typeof value === 'number' ? String(value) : value
}

function numericValue(value: IcuValue): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value))
    return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed))
      return parsed
  }
  return undefined
}

function exactSelector(value: number): string | undefined {
  return Number.isInteger(value) ? `=${value}` : undefined
}

function selectSelector(value: IcuValue): string {
  if (value == null)
    return 'other'
  return String(value)
}

function startsQuote(next: string | undefined, pluralPound: boolean): boolean {
  return next === '{' || next === '}' || next === '<' || next === '>' || (pluralPound && next === '#')
}

function parseMessage(input: string): Node[] {
  let index = 0

  function parseNodes(stop: string | null, pluralPound: boolean): Node[] {
    const nodes: Node[] = []
    let text = ''
    const flush = (): void => {
      if (text !== '') {
        nodes.push({ type: 'text', value: text })
        text = ''
      }
    }
    while (index < input.length) {
      const char = input[index]!
      if (char === '\'') {
        const next = input[index + 1]
        if (next === '\'') {
          text += '\''
          index += 2
          continue
        }
        // 撇号后面紧跟语法字符时才开始引用，例如 `'{'`，和原版用的 intl-messageformat 一致。
        // `Kies 'n datum`、`{name}'s` 里的撇号就是字面字符。
        if (!startsQuote(next, pluralPound)) {
          text += '\''
          index += 1
          continue
        }
        index += 1
        while (index < input.length) {
          if (input[index] === '\'') {
            if (input[index + 1] === '\'') {
              text += '\''
              index += 2
              continue
            }
            index += 1
            break
          }
          text += input[index]
          index += 1
        }
        continue
      }
      if (char === '#' && pluralPound) {
        flush()
        nodes.push({ type: 'pound' })
        index += 1
        continue
      }
      if (char === '{') {
        flush()
        index += 1
        nodes.push(parseArgument())
        continue
      }
      if (stop != null && char === stop) {
        flush()
        return nodes
      }
      text += char
      index += 1
    }
    if (stop != null)
      throw new Error('ICU 消息没有闭合')
    flush()
    return nodes
  }

  function parseArgument(): Node {
    skipSpace()
    const name = readIdentifier()
    skipSpace()
    if (input[index] === '}') {
      index += 1
      return { type: 'arg', name }
    }
    if (input[index] !== ',')
      throw new Error(`ICU 参数 ${name} 格式不对`)
    index += 1
    skipSpace()
    const kind = readIdentifier()
    skipSpace()
    if (kind === 'number') {
      if (input[index] === ',')
        skipNumberStyle()
      expectChar('}')
      index += 1
      return { type: 'number', name }
    }
    if (kind === 'plural' || kind === 'selectordinal' || kind === 'select') {
      expectChar(',')
      index += 1
      skipSpace()
      let offset = 0
      if (kind !== 'select' && input.startsWith('offset:', index)) {
        index += 'offset:'.length
        skipSpace()
        offset = readInteger()
        skipSpace()
      }
      const options: PluralOption[] = []
      while (index < input.length && input[index] !== '}') {
        skipSpace()
        if (input[index] === '}')
          break
        const selector = readSelector()
        skipSpace()
        expectChar('{')
        index += 1
        const nodes = parseNodes('}', kind !== 'select')
        expectChar('}')
        index += 1
        options.push({ selector, nodes })
      }
      expectChar('}')
      index += 1
      if (options.length === 0)
        throw new Error(`ICU ${kind} 没有选项`)
      if (kind === 'select')
        return { type: 'select', name, options }
      return { type: 'plural', name, offset, ordinal: kind === 'selectordinal', options }
    }
    throw new Error(`不支持的 ICU 类型 ${kind}`)
  }

  function skipNumberStyle(): void {
    let depth = 0
    while (index < input.length) {
      const char = input[index]
      if (char === '{') {
        depth += 1
      }
      else if (char === '}') {
        if (depth === 0)
          return
        depth -= 1
      }
      index += 1
    }
    throw new Error('ICU number 没有闭合')
  }

  function skipSpace(): void {
    while (index < input.length && (input[index] === ' ' || input[index] === '\n' || input[index] === '\r' || input[index] === '\t'))
      index += 1
  }

  function readIdentifier(): string {
    const start = index
    while (index < input.length && /[\w$]/.test(input[index]!))
      index += 1
    if (start === index)
      throw new Error('ICU 缺少参数名')
    return input.slice(start, index)
  }

  function readSelector(): string {
    if (input[index] === '=') {
      index += 1
      const sign = input[index] === '-' ? '-' : ''
      if (sign)
        index += 1
      return `=${sign}${readInteger()}`
    }
    return readIdentifier()
  }

  function readInteger(): number {
    const start = index
    while (index < input.length && input[index]! >= '0' && input[index]! <= '9')
      index += 1
    if (start === index)
      throw new Error('ICU 缺少数字')
    return Number(input.slice(start, index))
  }

  function expectChar(char: string): void {
    if (input[index] !== char)
      throw new Error(`ICU 期望 ${char}`)
  }

  return parseNodes(null, false)
}
