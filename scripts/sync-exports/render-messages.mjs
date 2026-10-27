// 生成 `packages/core/src/locale/messages.ts`：把 `locale/messages/*.ts` 里各组件的文案合成一张表。
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { compareName, TS_BANNER } from './source-layout.mjs'

function kebabToCamel(name) {
  return name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function messageSources(rootDir) {
  const dir = join(rootDir, 'packages/core/src/locale/messages')
  if (!existsSync(dir))
    return []
  return readdirSync(dir)
    .filter(name => name.endsWith('.ts'))
    .filter(name => name !== 'shared.ts' && name !== 'index.ts' && !name.endsWith('.test.ts'))
    .sort(compareName)
}

export function renderMessages(rootDir) {
  const files = messageSources(rootDir)
  const parts = []
  for (const fileName of files) {
    const base = fileName.replace(/\.ts$/, '')
    const camel = kebabToCamel(base)
    const pascal = camel.charAt(0).toUpperCase() + camel.slice(1)
    const text = readFileSync(join(rootDir, 'packages/core/src/locale/messages', fileName), 'utf8')
    if (!text.includes(`export const ${camel}Messages`))
      throw new Error(`locale/messages/${fileName} 需要导出 ${camel}Messages`)
    if (!text.includes(`export interface ${pascal}Messages`))
      throw new Error(`locale/messages/${fileName} 需要导出 ${pascal}Messages`)
    parts.push({ base, camel, pascal })
  }

  const typeImports = parts
    .map(part => `import type { ${part.pascal}Messages } from './messages/${part.base}.js'`)
  const valueImports = parts
    .map(part => `import { ${part.camel}Messages } from './messages/${part.base}.js'`)
  const fields = parts.map(part => `  ${part.camel}: ${part.pascal}Messages`).join('\n')
  const enFields = parts.map(part => `    ${part.camel}: ${part.camel}Messages.en,`).join('\n')
  const zhFields = parts.map(part => `    ${part.camel}: ${part.camel}Messages['zh-CN'],`).join('\n')

  return `${TS_BANNER}
import type { AstryxLocale } from './types.js'
${typeImports.join('\n')}
${valueImports.join('\n')}

export interface AstryxMessages {
${fields}
}

export const astryxMessages: Record<AstryxLocale, AstryxMessages> = {
  'en': {
${enFields}
  },
  'zh-CN': {
${zhFields}
  },
}
`
}
