#!/usr/bin/env node
/**
 * 从「改了哪些文件」推出「要跑视觉对照的组件」，给 CI 的视觉对照用。
 *
 * 映射规则（路径都相对仓库根目录）：
 * - `packages/core/src/<Dir>/**`：目录同名的主组件；改的是 `<Name>.vue` 且有文档页时，再加上 `<Name>`。
 *   目录本身没有同名页面（如 `Indicator/`）时，取目录里所有有文档页的 `.vue`。
 * - `packages/core/styles/<kebab>.css`、`packages/themes/neutral/<kebab>.css`：kebab 名对应的组件。
 * - `apps/docs/components/demos/<slug>/**`：slug 对应的组件。
 * - 公共文件（见 BROAD_FILES、SHARED_CORE_DIRS，以及找不到对应组件的样式文件）：跑 REPRESENTATIVE_COMPONENTS。
 * - 测试文件和其它路径不触发。
 *
 * 「有文档页」指 `apps/docs/docs/en/components/<slug>/index.md` 存在，这也是对照工具找我们这边页面的依据。
 *
 * 用法：
 *   node scripts/swarm/changed-components.mjs <文件...>
 *   node scripts/swarm/changed-components.mjs --base <git 提交> [--head <git 提交>]
 *   node scripts/swarm/changed-components.mjs --components Button,Badge
 * 选项：--out <file> 把结果 JSON 写进文件（否则打到 stdout）；--github-output 把 count（要跑几个）写进 $GITHUB_OUTPUT。
 */
import { execFileSync } from 'node:child_process'
import { appendFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join, posix, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { toSlug, toUpstreamName } from './visual-compare/names.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

/** 一次最多跑几个组件。每个组件 4 种组合，8 个大约要 CI 二三十分钟。 */
export const MAX_COMPONENTS = 8

/**
 * 公共文件被改时跑的「代表组件」。改主题入口、reset、Theme 或公共 composable 会波及所有组件，
 * 全跑太慢，挑几个覆盖面最广的：
 * - Button：最基础的按压控件，颜色、圆角、字号、焦点环都在上面。
 * - TextInput：输入框描边、占位文字、输入类 token。
 * - Selector：触发器加弹出列表，覆盖输入控件和浮层两类样式。
 * - Dialog：遮罩、阴影、层级、标题排版。
 * - DropdownMenu：菜单项、分隔线、选中标记，是浮层定位和菜单 token 的代表。
 * - Table：边框、间距、密集排版，最容易暴露 spacing 和字体度量的变化。
 */
export const REPRESENTATIVE_COMPONENTS = Object.freeze(['Button', 'TextInput', 'Selector', 'Dialog', 'DropdownMenu', 'Table'])

/** 改了就跑代表组件的单个文件。 */
export const BROAD_FILES = Object.freeze([
  'packages/themes/neutral.css',
  'packages/themes/fonts.css',
  'packages/core/reset.css',
  'packages/core/styles.css',
])

/** `packages/core/src/` 下不是组件、而是被很多组件共用的目录。 */
export const SHARED_CORE_DIRS = Object.freeze(['composables', 'Theme', 'layer', 'locale'])

const DOCS_PAGES_DIR = 'apps/docs/docs/en/components'
const TEST_FILE = /(?:\.(?:test|spec)\.[cm]?[jt]sx?|\.fixtures\.ts|\/__snapshots__\/.*)$/

/** 读真实仓库的默认实现。测试可以换成假的。 */
export function repoFs(root = ROOT) {
  return {
    hasPage: name => existsSync(join(root, DOCS_PAGES_DIR, toSlug(name), 'index.md')),
    vueFilesIn: (dir) => {
      try {
        return readdirSync(join(root, dir)).filter(f => f.endsWith('.vue')).map(f => f.slice(0, -4)).sort()
      }
      catch {
        return []
      }
    },
  }
}

/**
 * 一个文件对应的组件。
 * @returns {{ kind: 'components', names: string[] } | { kind: 'broad' } | { kind: 'none' }} 映射结果
 */
export function classifyFile(file, fs) {
  const path = file.split('\\').join('/').replace(/^\.\//, '')
  if (TEST_FILE.test(path))
    return { kind: 'none' }
  if (BROAD_FILES.includes(path))
    return { kind: 'broad' }

  const core = path.match(/^packages\/core\/src\/([^/]+)\/(.+)$/)
  if (core) {
    const [, dir, rest] = core
    if (SHARED_CORE_DIRS.includes(dir))
      return { kind: 'broad' }
    const names = []
    if (fs.hasPage(dir))
      names.push(dir)
    const own = rest.match(/^([^/]+)\.vue$/)
    if (own && own[1] !== dir && fs.hasPage(own[1]))
      names.push(own[1])
    if (names.length === 0)
      names.push(...fs.vueFilesIn(`packages/core/src/${dir}`).filter(n => fs.hasPage(n)))
    return names.length > 0 ? { kind: 'components', names } : { kind: 'none' }
  }

  const style = path.match(/^packages\/(?:core\/styles|themes\/neutral)\/([a-z0-9-]+)\.css$/)
  if (style) {
    const name = toUpstreamName(style[1])
    // 找不到同名组件的样式文件是多个组件共用的（如 bordered-control、pressable、neutral/input）。
    return fs.hasPage(name) ? { kind: 'components', names: [name] } : { kind: 'broad' }
  }

  const demo = path.match(/^apps\/docs\/components\/demos\/([a-z0-9-]+)\//)
  if (demo) {
    const name = toUpstreamName(demo[1])
    return fs.hasPage(name) ? { kind: 'components', names: [name] } : { kind: 'none' }
  }
  return { kind: 'none' }
}

/** 按出现顺序去重后截到 limit 个，多出来的放进 skipped。 */
function capList(names, limit) {
  const unique = [...new Set(names)]
  return { components: unique.slice(0, limit), skipped: unique.slice(limit) }
}

/**
 * 改动文件 → 要跑的组件。直接改到的组件排在前面，代表组件排在后面。
 * @param {string[]} files 改动的文件路径
 * @returns {{ source: 'files', components: string[], skipped: string[], reasons: Record<string, string[]>, broadFiles: string[] }} 结果
 */
export function componentsFromFiles(files, { fs = repoFs(), limit = MAX_COMPONENTS } = {}) {
  const direct = []
  const reasons = {}
  const broadFiles = []
  for (const file of files) {
    const result = classifyFile(file, fs)
    if (result.kind === 'broad') {
      broadFiles.push(file)
      continue
    }
    if (result.kind !== 'components')
      continue
    for (const name of result.names) {
      direct.push(name)
      ;(reasons[name] ??= []).push(file)
    }
  }
  const all = broadFiles.length > 0 ? [...direct, ...REPRESENTATIVE_COMPONENTS] : direct
  return { source: 'files', ...capList(all, limit), reasons, broadFiles }
}

/** 手动指定的组件名（逗号或空白分隔），统一成上游名。页面是否存在交给运行那一层检查。 */
export function componentsFromNames(input, { limit = MAX_COMPONENTS } = {}) {
  const names = String(input ?? '').split(/[\s,]+/).filter(Boolean).map(toUpstreamName)
  return { source: 'manual', ...capList(names, limit), reasons: {}, broadFiles: [] }
}

/** `git diff --name-only base...head`。 */
export function gitChangedFiles(base, head = 'HEAD', cwd = ROOT) {
  return execFileSync('git', ['diff', '--name-only', '--no-renames', `${base}...${head}`], { cwd, encoding: 'utf8' })
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .map(f => posix.normalize(f))
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'base': { type: 'string' },
      'head': { type: 'string', default: 'HEAD' },
      'components': { type: 'string' },
      'out': { type: 'string' },
      'github-output': { type: 'boolean', default: false },
    },
  })
  let plan
  if (values.components !== undefined)
    plan = componentsFromNames(values.components)
  else if (values.base)
    plan = componentsFromFiles(gitChangedFiles(values.base, values.head))
  else
    plan = componentsFromFiles(positionals)

  const json = `${JSON.stringify(plan, null, 2)}\n`
  if (values.out)
    writeFileSync(resolve(values.out), json)
  else
    process.stdout.write(json)
  const notes = [`要跑：${plan.components.join(', ') || '(无)'}`]
  if (plan.skipped.length > 0)
    notes.push(`超过 ${MAX_COMPONENTS} 个，这次没跑：${plan.skipped.join(', ')}`)
  if (plan.broadFiles.length > 0)
    notes.push(`公共文件触发了代表组件：${plan.broadFiles.join(', ')}`)
  console.error(`[changed-components] ${notes.join('；')}`)
  if (values['github-output'] && process.env.GITHUB_OUTPUT)
    appendFileSync(process.env.GITHUB_OUTPUT, `count=${plan.components.length}\n`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]))
  main()
