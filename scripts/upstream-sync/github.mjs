import { execFileSync } from 'node:child_process'
import process from 'node:process'

function gh(args, attempts = 4) {
  for (let attempt = 1; ; attempt++) {
    try {
      return execFileSync('gh', args, {
        encoding: 'utf8',
        timeout: 90_000,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, GH_PROMPT_DISABLED: '1' },
      })
    }
    catch (error) {
      if (attempt >= attempts)
        throw error
      execFileSync('sleep', [String(attempt * 3)])
    }
  }
}

export class UpstreamSyncGitHub {
  /** run 默认真的调用 gh；测试时传入假的执行器。project 是 CLI 的 --project 编号。 */
  constructor({ repo, owner, project, run = gh }) {
    this.repo = repo
    this.owner = owner
    this.projectNumber = String(project)
    this.run = run
    this.project = null
  }

  /** 汇总 PR 所在分支上已经开着的 PR；没有就返回 null。 */
  findOpenPullRequest(branch) {
    const prs = JSON.parse(this.run([
      'pr',
      'list',
      '--repo',
      this.repo,
      '--head',
      branch,
      '--state',
      'open',
      '--json',
      'number,url',
    ]))
    return prs[0] ?? null
  }

  /** 已有 PR 就更新标题和正文，没有就新开一个。分支要先推上去。 */
  ensurePullRequest({ branch, base, title, body, labels }, existing = this.findOpenPullRequest(branch)) {
    if (existing) {
      this.run(['pr', 'edit', String(existing.number), '--repo', this.repo, '--title', title, '--body', body])
      return { ...existing, created: false }
    }
    const args = ['pr', 'create', '--repo', this.repo, '--base', base, '--head', branch, '--title', title, '--body', body]
    for (const label of labels)
      args.push('--label', label)
    const url = this.run(args).trim()
    return { url, number: Number(url.split('/').at(-1)), created: true }
  }

  loadProject() {
    if (this.project)
      return this.project
    const project = JSON.parse(this.run(['project', 'view', this.projectNumber, '--owner', this.owner, '--format', 'json']))
    const fields = JSON.parse(this.run(['project', 'field-list', this.projectNumber, '--owner', this.owner, '--format', 'json'])).fields
    const items = JSON.parse(this.run(['project', 'item-list', this.projectNumber, '--owner', this.owner, '--limit', '500', '--format', 'json'])).items
    this.project = { project, fields, items }
    return this.project
  }

  ensureProjectItem(issue, release, family) {
    const state = this.loadProject()
    let item = state.items.find(entry => entry.content?.url === issue.url)
    const isNew = !item
    if (isNew) {
      item = JSON.parse(this.run([
        'project',
        'item-add',
        this.projectNumber,
        '--owner',
        this.owner,
        '--url',
        issue.url,
        '--format',
        'json',
      ]))
      state.items.push(item)
    }
    const editText = (name, value) => {
      const field = state.fields.find(entry => entry.name === name)
      if (!field)
        throw new Error(`路线图缺少 ${name} 字段`)
      this.run(['project', 'item-edit', '--id', item.id, '--project-id', state.project.id, '--field-id', field.id, '--text', value])
    }
    const editOption = (name, value) => {
      const field = state.fields.find(entry => entry.name === name)
      const option = field?.options?.find(entry => entry.name === value)
      if (!option)
        throw new Error(`路线图字段 ${name} 没有选项 ${value}`)
      this.run(['project', 'item-edit', '--id', item.id, '--project-id', state.project.id, '--field-id', field.id, '--single-select-option-id', option.id])
    }
    editText('Upstream', release.to)
    editText('Node', family.id)
    editOption('Area', family.projectArea)
    // 只有新卡片落到 Todo；已有卡片可能已经在做或做完了，同步不能把它退回去。
    if (isNew)
      editOption('Status', 'Todo')
  }
}
