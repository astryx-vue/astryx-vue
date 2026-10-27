#!/usr/bin/env node
// 把任务节点在 GitHub Project「astryx-vue 路线图」里的卡片状态改掉。
// 节点和 issue 的对照在 .agents-work/upstream-sync-0.7.1/nodes/issues.json。
//
// 用法：node scripts/swarm/project-status.mjs <节点ID> <Todo|In Progress|In Review|Blocked|Done>
//       node scripts/swarm/project-status.mjs --add <节点ID> <issue 号>   登记新节点的 issue
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const OWNER = 'astryx-vue'
const PROJECT_NUMBER = '1'
const STATUS_FIELD = 'Status'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const mapFile = join(root, '.agents-work/upstream-sync-0.7.1/nodes/issues.json')

/** gh 偶尔因网络抖动报「unknown owner type」之类的错，重试几次。 */
function gh(args, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return execFileSync('gh', args, { encoding: 'utf8', timeout: 90_000, stdio: ['ignore', 'pipe', 'pipe'] })
    }
    catch (error) {
      if (attempt >= attempts)
        throw error
      execFileSync('sleep', [String(attempt * 3)])
    }
  }
}

function readMap() {
  return JSON.parse(readFileSync(mapFile, 'utf8'))
}

function projectContext() {
  const project = JSON.parse(gh(['project', 'view', PROJECT_NUMBER, '--owner', OWNER, '--format', 'json']))
  const fields = JSON.parse(gh(['project', 'field-list', PROJECT_NUMBER, '--owner', OWNER, '--format', 'json'])).fields
  const status = fields.find(field => field.name === STATUS_FIELD)
  return { projectId: project.id, status }
}

function findItem(issue) {
  const items = JSON.parse(gh(['project', 'item-list', PROJECT_NUMBER, '--owner', OWNER, '--limit', '500', '--format', 'json'])).items
  return items.find(item => item.content?.number === issue)
}

function setStatus(node, statusName) {
  const issue = readMap()[node]
  if (issue == null)
    throw new Error(`节点 ${node} 还没有登记 issue，先用 --add 登记。`)
  const { projectId, status } = projectContext()
  const option = status.options.find(entry => entry.name === statusName)
  if (option == null)
    throw new Error(`没有「${statusName}」这个状态，可选：${status.options.map(entry => entry.name).join(' / ')}`)
  const item = findItem(issue)
  if (item == null)
    throw new Error(`issue #${issue} 不在 Project 里。`)
  gh(['project', 'item-edit', '--id', item.id, '--project-id', projectId, '--field-id', status.id, '--single-select-option-id', option.id])
  console.log(`${node} #${issue} → ${statusName}`)
}

function addNode(node, issue) {
  const map = readMap()
  map[node] = Number(issue)
  writeFileSync(mapFile, `${JSON.stringify(map, null, 2)}\n`)
  console.log(`已登记 ${node} → #${issue}`)
}

const args = process.argv.slice(2)
if (args[0] === '--add' && args.length === 3)
  addNode(args[1], args[2])
else if (args.length === 2)
  setStatus(args[0], args[1])
else
  console.error('用法：project-status.mjs <节点ID> <状态>，或 project-status.mjs --add <节点ID> <issue 号>')
