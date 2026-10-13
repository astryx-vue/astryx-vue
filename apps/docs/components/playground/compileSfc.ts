import type { SFCDescriptor } from '@vue/compiler-sfc'
import type { Component } from 'vue'
import type { PlaygroundLocale } from './protocol'
import { compileScript, compileStyle, compileTemplate, parse } from '@vue/compiler-sfc'
import { transform } from 'sucrase'

const SCOPE_ID = 'data-v-playground'
const FILENAME = 'PlaygroundPreview.vue'

export interface CompiledPlaygroundSfc {
  component: Component
  css: string
}

export interface PlaygroundModules {
  vue: Record<string, unknown>
  core: Record<string, unknown>
  charts: Record<string, unknown>
}

export function compilePlaygroundSfc(
  source: string,
  modules: PlaygroundModules,
  locale: PlaygroundLocale,
): CompiledPlaygroundSfc {
  const parsed = parse(source, { filename: FILENAME })
  if (parsed.errors.length)
    throw new Error(parsed.errors.map(errorText).join('\n'))

  const descriptor = parsed.descriptor
  if (!descriptor.template)
    throw new Error(locale === 'zh' ? '缺少 <template>。' : 'Missing <template>.')
  if (descriptor.script?.src || descriptor.scriptSetup?.src || descriptor.styles.some(style => style.src))
    throw new Error(locale === 'zh' ? '不支持 src 引入。' : 'src imports are not supported.')
  if (descriptor.styles.some(style => style.module))
    throw new Error(locale === 'zh' ? '不支持 CSS Modules。' : 'CSS Modules are not supported.')
  if (descriptor.styles.some(style => style.lang && style.lang !== 'css'))
    throw new Error(locale === 'zh' ? '样式只支持 CSS。' : 'Styles must be CSS.')

  const hasScoped = descriptor.styles.some(style => style.scoped)
  let compiled = compileScriptBlock(descriptor, hasScoped)

  if (!descriptor.scriptSetup && descriptor.script && descriptor.template) {
    const render = compileTemplate({
      filename: FILENAME,
      source: descriptor.template.content,
      id: SCOPE_ID,
      scoped: hasScoped,
      isProd: true,
      compilerOptions: { bindingMetadata: {} },
    })
    if (render.errors.length)
      throw new Error(render.errors.map(errorText).join('\n'))
    const renderCode = stripExports(`${render.preamble ?? ''}\n${render.code}`).replace('function render', 'function __render')
    compiled += `\n${renderCode}\n__sfc__.render = __render\n`
  }

  if (hasScoped)
    compiled += `\n__sfc__.__scopeId = ${JSON.stringify(SCOPE_ID)}\n`

  const plain = transform(compiled, {
    transforms: ['typescript'],
    disableESTransforms: true,
    production: true,
  }).code
  const rewritten = rewriteImports(plain, locale)
  // 编辑器里的 SFC 要在浏览器里变成组件，这里没有别的执行入口。
  // eslint-disable-next-line no-new-func
  const factory = new Function('vue', 'core', 'charts', `${rewritten.prelude}\n${rewritten.code}\nreturn __sfc__`) as (
    vue: Record<string, unknown>,
    core: Record<string, unknown>,
    charts: Record<string, unknown>,
  ) => Component
  const component = factory(modules.vue, modules.core, modules.charts)
  if (!component || typeof component !== 'object')
    throw new Error(locale === 'zh' ? '没有编译出组件。' : 'Compilation did not produce a component.')

  const css = descriptor.styles.map((style) => {
    const result = compileStyle({
      source: style.content,
      filename: FILENAME,
      id: SCOPE_ID,
      scoped: Boolean(style.scoped),
    })
    if (result.errors.length)
      throw new Error(result.errors.map(errorText).join('\n'))
    return result.code
  }).join('\n')

  return { component, css }
}

function compileTemplateOnly(source: string, scoped: boolean): string {
  const render = compileTemplate({
    filename: FILENAME,
    source,
    id: SCOPE_ID,
    scoped,
    isProd: true,
  })
  if (render.errors.length)
    throw new Error(render.errors.map(errorText).join('\n'))
  const code = `${render.preamble ?? ''}\n${render.code}`
  return `${stripExports(code).replace('export function render', 'function render')}\nconst __sfc__ = { render }\n`
}

function stripExports(code: string): string {
  return code.replace(/^export\s+/gm, '')
}

function compileScriptBlock(descriptor: SFCDescriptor, hasScoped: boolean): string {
  if (descriptor.script || descriptor.scriptSetup) {
    return compileScript(descriptor, {
      id: SCOPE_ID,
      inlineTemplate: Boolean(descriptor.scriptSetup),
      isProd: true,
      genDefaultAs: '__sfc__',
      sourceMap: false,
    }).content
  }
  return compileTemplateOnly(descriptor.template?.content ?? '', hasScoped)
}

function rewriteImports(code: string, locale: PlaygroundLocale): { code: string, prelude: string } {
  const bindings: string[] = []
  const output: string[] = []
  const lines = code.split('\n')
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? ''
    if (!/^[ \t]*import\s/.test(line)) {
      output.push(line)
      continue
    }
    const collected = [line]
    while (!/ from ['"]/.test(collected.join('\n')) && index + 1 < lines.length) {
      index += 1
      collected.push(lines[index] ?? '')
    }
    const statement = collected.join('\n')
    const parsed = parseImportStatement(statement)
    if (!parsed) {
      throw new Error(locale === 'zh'
        ? `只支持具名导入：${statement.trim()}`
        : `Only named imports are supported: ${statement.trim()}`)
    }
    if (!parsed.typeOnly)
      bindings.push(...namedBindings(parsed.clause, parsed.source, statement, locale))
    output.push('')
  }
  return { code: output.join('\n'), prelude: bindings.join('\n') }
}

function parseImportStatement(statement: string): { typeOnly: boolean, clause: string, source: string } | null {
  const compact = statement.replace(/\s+/g, ' ').trim().replace(/;$/, '')
  if (!compact.startsWith('import '))
    return null
  let body = compact.slice('import '.length)
  let typeOnly = false
  if (body.startsWith('type ')) {
    typeOnly = true
    body = body.slice('type '.length)
  }
  const marker = ' from '
  const at = body.lastIndexOf(marker)
  if (at < 0)
    return null
  const clause = body.slice(0, at).trim()
  const rawSource = body.slice(at + marker.length).trim()
  const quote = rawSource[0]
  if ((quote !== '\'' && quote !== '"') || rawSource.length < 2 || rawSource.at(-1) !== quote)
    return null
  return { typeOnly, clause, source: rawSource.slice(1, -1) }
}

function namedBindings(clause: string, source: string, statement: string, locale: PlaygroundLocale): string[] {
  const namespace = moduleNamespace(source, locale) as 'vue' | 'core' | 'charts'
  if (!clause.startsWith('{') || !clause.endsWith('}')) {
    throw new Error(locale === 'zh'
      ? `只支持具名导入：${statement.trim()}`
      : `Only named imports are supported: ${statement.trim()}`)
  }
  const bindings: string[] = []
  for (const part of clause.slice(1, -1).split(',')) {
    const item = part.trim().replace(/^type /, '')
    if (!item || item.startsWith('type '))
      continue
    const alias = item.split(' as ')
    const imported = alias[0]?.trim()
    const local = (alias[1] ?? alias[0])?.trim()
    if (!imported || !local || !/^[\w$]+$/.test(imported) || !/^[\w$]+$/.test(local)) {
      throw new Error(locale === 'zh'
        ? `无法解析导入：${item}`
        : `Could not parse import: ${item}`)
    }
    bindings.push(`const ${local} = ${namespace}[${JSON.stringify(imported)}]; if (${local} === undefined) throw new Error(${JSON.stringify(missingExport(namespace, imported, locale))});`)
  }
  return bindings
}

function moduleNamespace(source: string, locale: PlaygroundLocale): 'vue' | 'core' | 'charts' {
  if (source === 'vue')
    return 'vue'
  if (source === '@astryx-vue/core' || source.startsWith('@astryx-vue/core/'))
    return 'core'
  if (source === '@astryx-vue/playground-charts')
    return 'charts'
  throw new Error(locale === 'zh'
    ? `只能从 vue、@astryx-vue/core 和 @astryx-vue/playground-charts 导入，不支持 ${source}。`
    : `Only vue, @astryx-vue/core, and @astryx-vue/playground-charts can be imported, not ${source}.`)
}

function missingExport(namespace: 'vue' | 'core' | 'charts', name: string, locale: PlaygroundLocale): string {
  const from = namespace === 'vue'
    ? 'vue'
    : namespace === 'charts'
      ? '@astryx-vue/playground-charts'
      : '@astryx-vue/core'
  return locale === 'zh' ? `${from} 没有导出 ${name}。` : `${from} does not export ${name}.`
}

function errorText(error: unknown): string {
  if (error instanceof Error)
    return error.message
  if (typeof error === 'string')
    return error
  if (error && typeof error === 'object' && 'message' in error)
    return String(error.message)
  return String(error)
}
