import type { Catalog } from './catalog-types.ts'
import { BINARY } from './spec.ts'

const PACKAGE_PATH = '@astryx-vue/cli'

export const MANAGED_BLOCK_START = '<!-- Maintained by astryx-vue, do not edit manually -->'
export const MANAGED_BLOCK_END = '<!-- astryx-vue block end -->'

export type AgentName = 'agents' | 'cursor' | 'claude' | 'codex'
export type BlockAction = 'created' | 'updated' | 'appended' | 'unchanged'

const AGENT_FILES: Record<AgentName, string> = {
  agents: 'AGENTS.md',
  cursor: 'AGENTS.md',
  claude: 'CLAUDE.md',
  codex: 'AGENTS.md',
}

export function agentFile(agent: AgentName): string {
  return AGENT_FILES[agent]
}

export function renderAgentBlock(catalog: Catalog, locale: 'en' | 'zh', dense: boolean): string {
  const conventions = dense ? [] : catalog.conventions[locale]
  return locale === 'zh' ? renderChinese(conventions) : renderEnglish(conventions)
}

export function applyManagedBlock(existing: string | null, inner: string): { content: string, action: BlockAction } {
  const block = `${MANAGED_BLOCK_START}\n${inner.trim()}\n${MANAGED_BLOCK_END}`
  if (existing == null)
    return { content: `${block}\n`, action: 'created' }

  const start = existing.indexOf(MANAGED_BLOCK_START)
  const end = existing.indexOf(MANAGED_BLOCK_END)
  if (start !== -1 && end > start) {
    const before = existing.slice(0, start)
    let after = existing.slice(end + MANAGED_BLOCK_END.length)
    if (after.length > 0 && !after.startsWith('\n'))
      after = `\n${after}`
    const content = ensureTrailingNewline(`${before}${block}${after}`)
    return { content, action: content === existing ? 'unchanged' : 'updated' }
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n'
  return { content: ensureTrailingNewline(`${existing}${separator}${block}`), action: 'appended' }
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`
}

function renderEnglish(conventions: string[]): string {
  const lines = [
    '# astryx-vue',
    '',
    'This project uses astryx-vue, an unofficial Vue 3 community port of the Astryx design system. Components come from `@astryx-vue/core`. Themes come from `@astryx-vue/themes`. Do not use Meta\'s React packages, StyleX, or the bare `astryx` command.',
    '',
    '## How to look things up',
    '',
    `Run \`${BINARY}\`. Do not guess props, and do not paste the component catalog into this file.`,
    '',
    `- \`${BINARY} component --list\` lists components.`,
    `- \`${BINARY} component <Name>\` prints one component's usage, props, slots, and events from the docs.`,
    `- \`${BINARY} search <query>\` searches components and guide topics.`,
    '- Add `--json` for a typed envelope, `--zh` for Simplified Chinese, and `--dense` for a shorter reply.',
    `- \`${BINARY} manifest --json\` describes commands, options, response types, and exit codes.`,
    '',
    'If the binary is not on PATH, add a script and call it with `npm run astryx-vue -- component Button`:',
    '',
    '```json',
    `"astryx-vue": "node node_modules/${PACKAGE_PATH}/bin/astryx-vue.mjs"`,
    '```',
  ]
  if (conventions.length > 0) {
    lines.push('', '## Conventions', '')
    for (const paragraph of conventions)
      lines.push(paragraph, '')
  }
  lines.push(`Refresh this block with \`${BINARY} init --features agents\`. The command replaces only the managed block.`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function renderChinese(conventions: string[]): string {
  const lines = [
    '# astryx-vue',
    '',
    '这个项目使用 astryx-vue，它是 Astryx 设计系统的非官方 Vue 3 社区实现。组件在 `@astryx-vue/core`，主题在 `@astryx-vue/themes`。不要使用 Meta 的 React 包、StyleX，也不要调用裸命令 `astryx`。',
    '',
    '## 怎么查',
    '',
    `用 \`${BINARY}\` 查。不要猜 props，也不要把整份组件目录贴进这个文件。`,
    '',
    `- \`${BINARY} component --list\` 列出组件。`,
    `- \`${BINARY} component <Name>\` 打印一个组件的用法、props、插槽和事件，内容来自文档。`,
    `- \`${BINARY} search <query>\` 搜索组件和指南。`,
    '- 加 `--json` 得到类型化的 JSON；加 `--zh` 输出简体中文；加 `--dense` 缩短文本。',
    `- \`${BINARY} manifest --json\` 说明命令、选项、响应类型和退出码。`,
    '',
    '如果 PATH 里没有这个命令，加上脚本后用 `npm run astryx-vue -- component Button`：',
    '',
    '```json',
    `"astryx-vue": "node node_modules/${PACKAGE_PATH}/bin/astryx-vue.mjs"`,
    '```',
  ]
  if (conventions.length > 0) {
    lines.push('', '## 约定', '')
    for (const paragraph of conventions)
      lines.push(paragraph, '')
  }
  lines.push(`用 \`${BINARY} init --features agents\` 刷新这段。命令只替换受管理的区块。`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
