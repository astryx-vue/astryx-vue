import { describe, expect, it } from 'vitest'
import { parseArgs } from '../scripts/upstream-sync.mjs'
import { UpstreamSyncGitHub } from '../scripts/upstream-sync/github.mjs'

interface ProjectItem {
  id: string
  content?: { url?: string }
}

const FIELDS = [
  { id: 'field-upstream', name: 'Upstream' },
  { id: 'field-node', name: 'Node' },
  { id: 'field-area', name: 'Area', options: [{ id: 'option-themes', name: '主题包' }, { id: 'option-core', name: 'core' }] },
  { id: 'field-status', name: 'Status', options: [{ id: 'option-todo', name: 'Todo' }, { id: 'option-done', name: 'Done' }] },
]

/** 假的 gh：只回放项目查询，记录每次调用的参数，不碰网络。 */
function fakeGh(items: ProjectItem[] = []) {
  const calls: string[][] = []
  function run(args: string[]) {
    calls.push(args)
    const [command, subcommand] = args
    if (command === 'project' && subcommand === 'view')
      return JSON.stringify({ id: 'project-id' })
    if (command === 'project' && subcommand === 'field-list')
      return JSON.stringify({ fields: FIELDS })
    if (command === 'project' && subcommand === 'item-list')
      return JSON.stringify({ items })
    if (command === 'project' && subcommand === 'item-add') {
      const item = { id: 'item-new', content: { url: args[args.indexOf('--url') + 1] } }
      items.push(item)
      return JSON.stringify(item)
    }
    if (command === 'project' && subcommand === 'item-edit')
      return ''
    throw new Error(`意外的 gh 调用：${args.join(' ')}`)
  }
  return { calls, run }
}

const release = { to: 'v1.1.0' }
const family = { id: 'selectors', projectArea: 'core' }
const issue = { url: 'https://github.com/astryx-vue/astryx-vue/issues/7', title: '上游 v1.1.0：选择器家族' }

function edits(calls: string[][], fieldId: string) {
  return calls.filter(args => args.includes('item-edit') && args[args.indexOf('--field-id') + 1] === fieldId)
}

describe('同步 issue 进路线图', () => {
  it('命令行 --project 映射成路线图编号，不会传成 undefined', () => {
    const options = parseArgs(['--project', '7'])
    const gh = fakeGh()
    const github = new UpstreamSyncGitHub({ ...options, run: gh.run })

    expect(github.projectNumber).toBe('7')
    github.ensureProjectItem(issue, release, family)

    const view = gh.calls.find(args => args[0] === 'project' && args[1] === 'view')
    expect(view).toEqual(['project', 'view', '7', '--owner', options.owner, '--format', 'json'])
    expect(gh.calls.flat()).not.toContain('undefined')
  })

  it('新卡片加入路线图并默认 Todo', () => {
    const gh = fakeGh()
    const github = new UpstreamSyncGitHub({ repo: 'astryx-vue/astryx-vue', owner: 'astryx-vue', project: '1', run: gh.run })

    github.ensureProjectItem(issue, release, family)

    const added = gh.calls.find(args => args.includes('item-add'))
    expect(added).toEqual(['project', 'item-add', '1', '--owner', 'astryx-vue', '--url', issue.url, '--format', 'json'])
    expect(edits(gh.calls, 'field-status').map(args => args.at(-1))).toEqual(['option-todo'])
    expect(edits(gh.calls, 'field-upstream').map(args => args.at(-1))).toEqual(['v1.1.0'])
    expect(edits(gh.calls, 'field-node').map(args => args.at(-1))).toEqual(['selectors'])
    expect(edits(gh.calls, 'field-area').map(args => args.at(-1))).toEqual(['option-core'])
  })

  it('已有卡片保留原状态，只补齐上游字段', () => {
    const gh = fakeGh([{ id: 'item-7', content: { url: issue.url } }])
    const github = new UpstreamSyncGitHub({ repo: 'astryx-vue/astryx-vue', owner: 'astryx-vue', project: '1', run: gh.run })

    github.ensureProjectItem(issue, release, family)

    expect(gh.calls.some(args => args.includes('item-add'))).toBe(false)
    expect(edits(gh.calls, 'field-status')).toEqual([])
    expect(edits(gh.calls, 'field-upstream').map(args => args.at(-1))).toEqual(['v1.1.0'])
    expect(edits(gh.calls, 'field-node').map(args => args.at(-1))).toEqual(['selectors'])
    expect(edits(gh.calls, 'field-area').map(args => args.at(-1))).toEqual(['option-core'])
    expect(gh.calls.flat()).not.toContain('option-todo')
    expect(gh.calls.flat()).not.toContain('option-done')
  })
})
