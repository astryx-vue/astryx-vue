/**
 * rebase 停在冲突上时，判断并处理「能交给 `pnpm sync` 重新生成」的那部分冲突。
 *
 * 两类文件，清单都取自 scripts/sync-exports.mjs，不在这里另写：
 * - 整份生成的文件（generatedFiles）：取节点这一边，之后由 sync 重写；
 * - 部分字段生成的 JSON 文件（partlyGeneratedFiles，目前是 packages/core/package.json）：
 *   对共同祖先、基线、节点三份做 JSON 三方合并。归 sync 管的字段不比较，先取基线版，
 *   节点新增的生成条目交给随后的 sync 补上；其它字段两边的改动都保留；
 *   两边把同一个字段改成不同的值，就算人工冲突。
 * 其余文件的冲突一律交给人处理。
 */
import { writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { generatedFiles, partlyGeneratedFiles } from '../../sync-exports.mjs'
import { git, gitOk } from './git.mjs'
import { formatJsonPath, mergeJson } from './json-merge.mjs'

/**
 * 当前工作区里两类生成文件，路径相对工作区根目录。
 * @returns {{ whole: Set<string>, partial: Map<string, (path: string[]) => boolean> }} 整份生成的文件、部分生成的文件及其字段判断
 */
export function syncManagedFiles(root) {
  const whole = new Set([...generatedFiles(root).keys()].map(file => relative(root, file)))
  const partial = new Map([...partlyGeneratedFiles(root)].map(([file, isOwned]) => [relative(root, file), isOwned]))
  return { whole, partial }
}

/** 冲突文件里不归 sync 管、必须由人处理的那些。 */
export function manualConflicts(conflicts, managed) {
  return conflicts.filter(file => !managed.whole.has(file) && !managed.partial.has(file))
}

/** 冲突的整份生成文件取节点这一边（rebase 里的 theirs）并加进暂存区；节点这边删掉了就跟着删。 */
function takeNodeSide(path, files) {
  for (const file of files) {
    if (gitOk(path, ['checkout', '--theirs', '--', file]))
      git(path, ['add', '--', file])
    else
      git(path, ['rm', '--quiet', '-f', '--', file])
  }
}

/** 冲突文件在某个暂存区阶段的内容：1 共同祖先，2 基线这边，3 节点这边。没有这个阶段时返回 null。 */
function stageText(path, stage, file) {
  const result = git(path, ['show', `:${stage}:${file}`], { allowFail: true })
  return result.status === 0 ? result.stdout : null
}

function parseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) }
  }
  catch {
    return { ok: false }
  }
}

/**
 * 对一个部分生成的 JSON 文件做三方合并。
 * @returns {{ text: string } | { problems: string[] }} 合并后的文本，或者不能自动合并的原因
 */
function mergePartialFile(path, file, isOwned) {
  const [baseText, oursText, theirsText] = [1, 2, 3].map(stage => stageText(path, stage, file))
  if (oursText === null || theirsText === null)
    return { problems: ['一边删掉了这个文件'] }
  const parsed = [baseText ?? 'null', oursText, theirsText].map(parseJson)
  if (parsed.some(item => !item.ok))
    return { problems: ['有一边不是合法的 JSON'] }
  const [base, ours, theirs] = parsed.map(item => item.value)
  const { value, conflicts } = mergeJson({ base: baseText === null ? undefined : base, ours, theirs, isOwned })
  if (conflicts.length > 0)
    return { problems: conflicts.map(field => `两边都改了 ${formatJsonPath(field)}，改法不同`) }
  const eol = oursText.includes('\r\n') ? '\r\n' : '\n'
  const body = JSON.stringify(value, null, 2).replaceAll('\n', eol)
  return { text: oursText.endsWith(eol) ? `${body}${eol}` : body }
}

/**
 * 处理一个提交上全部归 sync 管的冲突：部分生成的文件先做 JSON 合并，整份生成的文件取节点版本，
 * 都加进暂存区。之后调用方要跑一次 sync 重新生成。
 * 有任何一个部分生成的文件不能自动合并时，什么都不写，返回各文件的原因。
 * @returns {{ ok: true } | { ok: false, problems: Map<string, string[]> }} 处理结果
 */
export function resolveSyncConflicts(path, conflicts, managed) {
  const merged = new Map()
  const problems = new Map()
  for (const file of conflicts.filter(item => managed.partial.has(item))) {
    const result = mergePartialFile(path, file, managed.partial.get(file))
    if (result.problems)
      problems.set(file, result.problems)
    else
      merged.set(file, result.text)
  }
  if (problems.size > 0)
    return { ok: false, problems }
  for (const [file, text] of merged) {
    writeFileSync(join(path, file), text)
    git(path, ['add', '--', file])
  }
  takeNodeSide(path, conflicts.filter(item => managed.whole.has(item)))
  return { ok: true }
}

/** 工作区里相对暂存区变化了的文件，含未跟踪的新文件。 */
function unstagedFiles(path) {
  const changed = git(path, ['diff', '--name-only']).stdout.split('\n')
  const untracked = git(path, ['ls-files', '--others', '--exclude-standard']).stdout.split('\n')
  return [...new Set([...changed, ...untracked].filter(Boolean))]
}

/**
 * 跑完 sync 后把它改过的文件加进暂存区。
 * @returns {string[]} sync 改到的、生成范围以外的文件；非空时什么都没加
 */
export function stageSyncOutputs(path, managed) {
  const changed = unstagedFiles(path)
  const unexpected = changed.filter(file => !managed.whole.has(file) && !managed.partial.has(file))
  if (unexpected.length === 0 && changed.length > 0)
    git(path, ['add', '-A', '--', ...changed])
  return unexpected
}
