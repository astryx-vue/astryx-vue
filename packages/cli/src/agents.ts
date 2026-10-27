import type { Catalog, CatalogPackage } from './catalog-types.ts'
import { BINARY } from './spec.ts'

export const MANAGED_BLOCK_START = '<!-- Maintained by astryx-vue, do not edit manually -->'
export const MANAGED_BLOCK_END = '<!-- astryx-vue block end -->'

/** Targets `init --agent` accepts. `all` and the absent target follow the project. */
export type AgentName = 'agents' | 'cursor' | 'claude' | 'codex' | 'hermes' | 'all'
export type BlockAction = 'created' | 'updated' | 'appended'

const AGENT_FILES: Record<Exclude<AgentName, 'all'>, string> = {
  agents: 'AGENTS.md',
  cursor: 'AGENTS.md',
  claude: 'CLAUDE.md',
  codex: 'AGENTS.md',
  hermes: '.hermes.md',
}

/**
 * Every agent file this command knows, in the order automatic detection prefers
 * them: the tool-agnostic standard first, then the tool-specific files.
 */
export const AGENT_DOC_CANDIDATES = ['AGENTS.md', 'CLAUDE.md', '.cursorrules', '.hermes.md', 'HERMES.md'] as const

export function agentFile(agent: Exclude<AgentName, 'all'>): string {
  return AGENT_FILES[agent]
}

export function existingAgentDocs(exists: (file: string) => boolean): string[] {
  return AGENT_DOC_CANDIDATES.filter(file => exists(file))
}

/**
 * The files to write. No `--agent` reuses whatever the project already has, so a
 * Claude Code repo keeps its instructions in CLAUDE.md. `all` writes every known
 * file that exists, and creates `AGENTS.md` when the project has none.
 */
export function resolveAgentTargets(agent: AgentName | null, existing: readonly string[]): string[] {
  // Sorted by the detection order, so the answer does not depend on how the
  // caller listed the files it found.
  const known = AGENT_DOC_CANDIDATES.filter(file => existing.includes(file))
  if (agent === 'all')
    return known.length > 0 ? [...known] : ['AGENTS.md']
  if (agent === null)
    return [known[0] ?? 'AGENTS.md']
  // Hermes reads `.hermes.md`, and a project that already keeps `HERMES.md`
  // keeps it rather than getting a second file.
  if (agent === 'hermes')
    return existing.includes('HERMES.md') && !existing.includes('.hermes.md') ? ['HERMES.md'] : ['.hermes.md']
  return [agentFile(agent)]
}

export function renderAgentBlock(catalog: Catalog, locale: 'en' | 'zh', dense: boolean): string {
  const conventions = dense ? [] : catalog.conventions[locale]
  return locale === 'zh' ? renderChinese(catalog, conventions) : renderEnglish(catalog, conventions)
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
    return { content, action: 'updated' }
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n'
  return { content: ensureTrailingNewline(`${existing}${separator}${block}`), action: 'appended' }
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith('\n') ? value : `${value}\n`
}

/**
 * One line per package, with the install specifier. A package published only
 * under the canary tag says so and takes `@canary`, because installing it
 * without the tag gets a placeholder version. A package no registry serves yet
 * is named without any install instruction, so a reader is never sent to a
 * command that fails.
 */
function packageLines(packages: readonly CatalogPackage[], locale: 'en' | 'zh'): string[] {
  return packages.map((pkg) => {
    const label = pkg.published && pkg.canary ? `\`${pkg.name}@canary\`` : `\`${pkg.name}\``
    return `- ${label} ${pkg.version} — ${pkg.description}${packageNote(pkg, locale)}`
  })
}

/** What a line adds after the description: canary, or not on npm at all. */
function packageNote(pkg: CatalogPackage, locale: 'en' | 'zh'): string {
  const zh = locale === 'zh'
  if (!pkg.published) {
    return pkg.canary
      ? (zh ? '（还没发布到 npm，装不到；以后只发 canary，装的时候要写 `@canary`）' : ' (not on npm yet, so there is nothing to install; when it ships it will be canary only and takes `@canary`)')
      : (zh ? '（还没发布到 npm，装不到，不要写进依赖）' : ' (not on npm yet, so there is nothing to install and it does not belong in the dependencies)')
  }
  return pkg.canary ? (zh ? '（canary 预览，API 可能会变，安装要写 `@canary`）' : ' (canary only: the API may change, install with `@canary`)') : ''
}

function renderEnglish(catalog: Catalog, conventions: string[]): string {
  const lines = [
    '# astryx-vue',
    '',
    'This project uses astryx-vue, an unofficial Vue 3 community port of the Astryx design system. Do not use Meta\'s React packages, StyleX, or the bare `astryx` command.',
    '',
    '## Packages',
    '',
    ...packageLines(catalog.packages, 'en'),
    '',
    '## Workflow',
    '',
    `1. Start from a page. \`${BINARY} build "<what you are building>"\` names the closest template, two alternatives, and the components to use. \`${BINARY} template --list\` shows every template.`,
    `2. Copy it and make it yours. \`${BINARY} template <slug> ./src/pages\` writes \`<Name>.vue\`, swaps the docs-site demo photos for a grey placeholder, and reports the packages the project is missing. Only \`--overwrite\` (or \`-f\`) replaces an existing file.`,
    `3. Look it up before writing. \`${BINARY} component <Name>\` prints usage, props, slots, and events. \`${BINARY} composable <Name>\` prints parameters and returns. Do not guess props, and do not paste the component catalog into this file.`,
    '',
    '## How to look things up',
    '',
    `- \`${BINARY} component --list\` lists components.`,
    `- \`${BINARY} composable --list\` lists composables, the \`use*\` functions.`,
    `- \`${BINARY} docs\` lists guide and theme topics; \`${BINARY} docs <topic>\` prints one page, such as \`${BINARY} docs guide/dark-mode\`.`,
    `- \`${BINARY} search <query>\` searches components, composables, docs topics, and templates.`,
    `- Add \`--json\` for a typed envelope, \`--zh\` for Simplified Chinese, and \`--dense\` for a shorter reply.`,
    `- \`${BINARY} manifest --json\` describes commands, options, response types, and error codes.`,
    '',
    '## Running it',
    '',
    `After \`npm install -D @astryx-vue/cli\` (or pnpm or yarn), the binary is already on \`node_modules/.bin\`: use \`npx ${BINARY} …\` or \`pnpm exec ${BINARY} …\`. Without installing it, run \`npx @astryx-vue/cli …\`; the scope is required, because the bare \`${BINARY}\` name on npm is not this package.`,
    '',
    `Optional: add \`"${BINARY}": "${BINARY}"\` to \`scripts\` when an agent shell does not put \`node_modules/.bin\` on PATH, then call \`npm run ${BINARY} -- component Button\`.`,
  ]
  if (conventions.length > 0) {
    lines.push('', '## Conventions', '')
    for (const paragraph of conventions)
      lines.push(paragraph, '')
  }
  lines.push(`Refresh this block with \`${BINARY} init --features agents\`. The command replaces only the managed block.`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function renderChinese(catalog: Catalog, conventions: string[]): string {
  const lines = [
    '# astryx-vue',
    '',
    '这个项目使用 astryx-vue，它是 Astryx 设计系统的非官方 Vue 3 社区实现。不要使用 Meta 的 React 包、StyleX，也不要调用裸命令 `astryx`。',
    '',
    '## 包',
    '',
    ...packageLines(catalog.packages, 'zh'),
    '',
    '## 工作流',
    '',
    `1. 先从页面模板起步。\`${BINARY} build "<你要做的东西>"\` 会给出最接近的模板、另外两个备选，以及要用的组件。\`${BINARY} template --list\` 列出全部模板。`,
    `2. 复制出来再改。\`${BINARY} template <slug> ./src/pages\` 写出 \`<Name>.vue\`，把文档站的演示图片换成灰色占位图，并列出项目还缺哪些包。已存在的文件只有加 \`--overwrite\`（或 \`-f\`）才会被替换。`,
    `3. 写代码前先查。\`${BINARY} component <Name>\` 打印用法、props、插槽和事件；\`${BINARY} composable <Name>\` 打印参数和返回值。不要猜 props，也不要把整份组件目录贴进这个文件。`,
    '',
    '## 怎么查',
    '',
    `- \`${BINARY} component --list\` 列出组件。`,
    `- \`${BINARY} composable --list\` 列出组合式函数（\`use*\` 函数）。`,
    `- \`${BINARY} docs\` 列出指南和主题；\`${BINARY} docs <topic>\` 打印一篇正文，例如 \`${BINARY} docs guide/dark-mode\`。`,
    `- \`${BINARY} search <query>\` 搜索组件、组合式函数、文档主题和模板。`,
    `- 加 \`--json\` 得到类型化的 JSON；加 \`--zh\` 输出简体中文；加 \`--dense\` 缩短文本。`,
    `- \`${BINARY} manifest --json\` 说明命令、选项、响应类型和错误码。`,
    '',
    '## 怎么运行',
    '',
    `\`npm install -D @astryx-vue/cli\`（或 pnpm、yarn）装好后，命令已经在 \`node_modules/.bin\` 里：用 \`npx ${BINARY} …\` 或 \`pnpm exec ${BINARY} …\`。不装、只想临时用，就运行 \`npx @astryx-vue/cli …\`；scope 不能省，因为 npm 上裸名 \`${BINARY}\` 不是这个包。`,
    '',
    `可选：如果 agent 的外壳没有把 \`node_modules/.bin\` 放进 PATH，可以在 \`scripts\` 里加 \`"${BINARY}": "${BINARY}"\`，再用 \`npm run ${BINARY} -- component Button\` 调用。`,
  ]
  if (conventions.length > 0) {
    lines.push('', '## 约定', '')
    for (const paragraph of conventions)
      lines.push(paragraph, '')
  }
  lines.push(`用 \`${BINARY} init --features agents\` 刷新这段。命令只替换受管理的区块。`)
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}
