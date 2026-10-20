#!/usr/bin/env node
/**
 * 任务树看板工具：ROADMAP.md 是唯一的进度来源，这个脚本负责读它、查它、改它。
 *
 *   node scripts/swarm/status.mjs check
 *   node scripts/swarm/status.mjs ready
 *   node scripts/swarm/status.mjs show
 *   node scripts/swarm/status.mjs set <节点> <状态> [--round N] [--impl 名字] [--verify 名字] [--result 文本] [--pr 文本] [--force] [--dry-run]
 *
 * 所有子命令都接受 --file <路径>，默认是本仓库的 .agents-work/upstream-sync/ROADMAP.md。
 * 退出码：0 正常；1 check 发现问题或 set 被拒绝；2 参数或文件格式不对。
 */
import { readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { EDITABLE_FIELDS, planSet, StatusEditError } from './status/edit.mjs'
import { checkRoadmap, formatShow, readyNodes } from './status/model.mjs'
import { parseRoadmap, RoadmapParseError } from './status/roadmap.mjs'
import { describeStates, resolveState } from './status/states.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const DEFAULT_ROADMAP = resolve(ROOT, '.agents-work/upstream-sync/ROADMAP.md')

export const USAGE = `用法: node scripts/swarm/status.mjs <子命令> [选项]

  check                      检查进度树状图和总表是否一致、依赖是否合理
  ready                      列出该改成「可开工」的节点和正在等派发的节点，按下游数量排序
  show                       按阶段打印每个节点的现状
  set <节点> <状态> [选项]   同时改树状图和总表；节点完成后自动解锁下游

set 的选项：
  --round N    --impl 名字    --verify 名字    --result 文本    --pr 文本
  --force      允许不合规的流转（比如跳过验收），慎用
  --dry-run    只打印会改哪些行，不写盘

通用选项：
  --file <路径>   ROADMAP 文件，默认 ${DEFAULT_ROADMAP}

状态可以写中文、英文简写或 emoji：
${describeStates()}`

class UsageError extends Error {}

export function parseStatusArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'file': { type: 'string' },
      'round': { type: 'string' },
      'impl': { type: 'string' },
      'verify': { type: 'string' },
      'result': { type: 'string' },
      'pr': { type: 'string' },
      'force': { type: 'boolean', default: false },
      'dry-run': { type: 'boolean', default: false },
      'help': { type: 'boolean', short: 'h', default: false },
    },
  })
  const [command, ...rest] = positionals
  if (values.help || !command)
    return { command: 'help' }
  if (!['check', 'ready', 'show', 'set'].includes(command))
    throw new UsageError(`不认识的子命令：${command}`)
  const file = resolve(values.file ?? DEFAULT_ROADMAP)
  if (command !== 'set') {
    if (rest.length > 0)
      throw new UsageError(`${command} 不需要位置参数，收到 ${rest.join(' ')}`)
    return { command, file }
  }
  if (rest.length !== 2)
    throw new UsageError('set 需要两个参数：<节点> <状态>')
  const [id, stateText] = rest
  const state = resolveState(stateText)
  if (!state)
    throw new UsageError(`不认识的状态：${stateText}`)
  if (values.round !== undefined && !/^\d+$/.test(values.round))
    throw new UsageError(`--round 需要非负整数，收到 ${values.round}`)
  const fields = {}
  for (const [option, field] of Object.entries(EDITABLE_FIELDS)) {
    if (values[option] !== undefined)
      fields[field] = values[option]
  }
  return { command, file, id, state, fields, force: values.force, dryRun: values['dry-run'] }
}

function formatProblems(problems) {
  return problems.map(p => `  ${p.id}：${p.message}`).join('\n')
}

function formatReady({ unlockable, queued }) {
  const list = items => items.map(item => `  ${item.id.padEnd(4)} ${item.name}（下游 ${item.downstream} 个）`).join('\n')
  const out = []
  out.push(unlockable.length > 0
    ? `依赖已全部完成、还标着「未开始」，应改成「可开工」：\n${list(unlockable)}`
    : '没有需要改成「可开工」的节点。')
  out.push(queued.length > 0
    ? `已是「可开工」、等待派发（按下游数量排序，这就是派活顺序）：\n${list(queued)}`
    : '没有等待派发的「可开工」节点。')
  return out.join('\n\n')
}

/** 先写临时文件再改名；写之前确认文件没被别人改过。 */
function writeIfUnchanged(file, original, next) {
  if (readFileSync(file, 'utf8') !== original)
    throw new StatusEditError(`${file} 在读取之后被改过，没有写入，请重跑`)
  const temp = `${file}.status-${process.pid}.tmp`
  writeFileSync(temp, next)
  renameSync(temp, file)
}

/**
 * 执行一条命令。返回 { code, stdout, stderr }，不直接写终端，方便测试。
 */
export function runStatus(argv) {
  let options
  try {
    options = parseStatusArgs(argv)
  }
  catch (error) {
    return { code: 2, stdout: '', stderr: `${error.message}\n\n${USAGE}` }
  }
  if (options.command === 'help')
    return { code: 0, stdout: USAGE, stderr: '' }
  let text
  try {
    text = readFileSync(options.file, 'utf8')
  }
  catch (error) {
    return { code: 2, stdout: '', stderr: `读不到 ${options.file}：${error.message}` }
  }
  try {
    const roadmap = parseRoadmap(text)
    if (options.command === 'check') {
      const problems = checkRoadmap(roadmap)
      return problems.length === 0
        ? { code: 0, stdout: `ROADMAP 一致：${roadmap.table.length} 个节点，树状图与总表状态相同，依赖都满足。`, stderr: '' }
        : { code: 1, stdout: '', stderr: `ROADMAP 有 ${problems.length} 处不一致：\n${formatProblems(problems)}` }
    }
    if (options.command === 'ready')
      return { code: 0, stdout: formatReady(readyNodes(roadmap)), stderr: '' }
    if (options.command === 'show')
      return { code: 0, stdout: formatShow(roadmap), stderr: '' }

    const plan = planSet(text, options)
    const lines = plan.text.split(roadmap.eol)
    const out = [`${options.dryRun ? '将要' : '已'}把 ${options.id} 改成「${options.state.name}」，改动 ${plan.changedLines.length} 行：`]
    for (const index of plan.changedLines)
      out.push(`  ${index + 1}: ${lines[index].trim()}`)
    if (plan.unlocked.length > 0)
      out.push(`下游自动改成「可开工」：${plan.unlocked.join('、')}`)
    if (!options.dryRun)
      writeIfUnchanged(options.file, text, plan.text)
    const stderr = plan.warnings.length > 0 ? `注意：ROADMAP 本来就有这些不一致，这次没有处理：\n${formatProblems(plan.warnings)}` : ''
    return { code: 0, stdout: out.join('\n'), stderr }
  }
  catch (error) {
    if (error instanceof RoadmapParseError)
      return { code: 2, stdout: '', stderr: `ROADMAP 格式不对：${error.message}` }
    if (error instanceof StatusEditError)
      return { code: 1, stdout: '', stderr: error.message }
    throw error
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const { code, stdout, stderr } = runStatus(process.argv.slice(2))
  if (stdout)
    console.log(stdout)
  if (stderr)
    console.error(stderr)
  process.exitCode = code
}
