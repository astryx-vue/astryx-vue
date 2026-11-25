import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parse as parseSfc } from '@vue/compiler-sfc'
import ts from 'typescript'
import { describe, expect, it } from 'vitest'

// 组件源码里的 Unicode 属性转义（`\p{…}`、`\P{…}`）不能写成正则字面量。
// 没有设 browserslist 或目标浏览器不支持属性转义时，Babel 的
// transform-unicode-property-regex 会改写这种字面量，而 Next.js 自带的那份缺少所需的
// Unicode 数据，源码构建会报 "Unknown property"。这类正则改用 `new RegExp(...)` 在运行时构造。

const SRC = __dirname
const SKIPPED = /\.(?:test|spec)\.ts$|\.d\.ts$/
const PROPERTY_ESCAPE = /\\p\{/i

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = join(dir, entry.name)
    if (entry.isDirectory())
      return entry.name === '__fixtures__' ? [] : sourceFiles(file)
    return /\.(?:ts|vue)$/.test(entry.name) && !SKIPPED.test(entry.name) ? [file] : []
  })
}

/** 文件里的脚本：`.ts` 是整份文件，`.vue` 是它的 `<script>` 和 `<script setup>`。 */
function scripts(file: string, source: string): string[] {
  if (!file.endsWith('.vue'))
    return [source]
  const { descriptor } = parseSfc(source, { filename: file })
  return [descriptor.script, descriptor.scriptSetup].flatMap(block => block == null ? [] : [block.content])
}

/** 脚本里每个带属性转义的正则字面量。 */
function propertyEscapeLiterals(code: string): string[] {
  const found: string[] = []
  const sourceFile = ts.createSourceFile('source.ts', code, ts.ScriptTarget.Latest, true)
  const visit = (node: ts.Node): void => {
    if (node.kind === ts.SyntaxKind.RegularExpressionLiteral && PROPERTY_ESCAPE.test(node.getText(sourceFile)))
      found.push(node.getText(sourceFile))
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

describe('源码构建里的正则', () => {
  it('认得出写成字面量的属性转义，运行时构造的不算', () => {
    expect(propertyEscapeLiterals('const a = /\\p{L}/u')).toEqual(['/\\p{L}/u'])
    expect(propertyEscapeLiterals('const a = new RegExp(\'\\\\p{L}\', \'u\')')).toEqual([])
  })

  it('没有把 Unicode 属性转义写成正则字面量', () => {
    const offenders: string[] = []
    for (const file of sourceFiles(SRC)) {
      const source = readFileSync(file, 'utf8')
      if (!PROPERTY_ESCAPE.test(source))
        continue
      for (const code of scripts(file, source)) {
        for (const literal of propertyEscapeLiterals(code))
          offenders.push(`${relative(SRC, file)} ${literal}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
