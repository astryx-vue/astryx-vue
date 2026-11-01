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
  constructor({ repo, owner, projectNumber }) {
    this.repo = repo
    this.owner = owner
    this.projectNumber = String(projectNumber)
    this.issues = null
    this.project = null
  }

  listIssues() {
    if (!this.issues) {
      this.issues = JSON.parse(gh([
        'issue',
        'list',
        '--repo',
        this.repo,
        '--state',
        'all',
        '--limit',
        '1000',
        '--json',
        'number,title,url',
      ]))
    }
    return this.issues
  }

  ensureIssue(input) {
    const existing = this.listIssues().find(issue => issue.title === input.title)
    if (existing)
      return { ...existing, created: false }
    const args = ['issue', 'create', '--repo', this.repo, '--title', input.title, '--body', input.body]
    for (const label of input.labels)
      args.push('--label', label)
    const url = gh(args).trim()
    const issue = { url, title: input.title, created: true }
    this.issues.push(issue)
    return issue
  }

  loadProject() {
    if (this.project)
      return this.project
    const project = JSON.parse(gh(['project', 'view', this.projectNumber, '--owner', this.owner, '--format', 'json']))
    const fields = JSON.parse(gh(['project', 'field-list', this.projectNumber, '--owner', this.owner, '--format', 'json'])).fields
    const items = JSON.parse(gh(['project', 'item-list', this.projectNumber, '--owner', this.owner, '--limit', '500', '--format', 'json'])).items
    this.project = { project, fields, items }
    return this.project
  }

  ensureProjectItem(issue, release, family) {
    const state = this.loadProject()
    let item = state.items.find(entry => entry.content?.url === issue.url)
    if (!item) {
      item = JSON.parse(gh([
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
      gh(['project', 'item-edit', '--id', item.id, '--project-id', state.project.id, '--field-id', field.id, '--text', value])
    }
    const editOption = (name, value) => {
      const field = state.fields.find(entry => entry.name === name)
      const option = field?.options?.find(entry => entry.name === value)
      if (!option)
        throw new Error(`路线图字段 ${name} 没有选项 ${value}`)
      gh(['project', 'item-edit', '--id', item.id, '--project-id', state.project.id, '--field-id', field.id, '--single-select-option-id', option.id])
    }
    editText('Upstream', release.to)
    editText('Node', family.id)
    editOption('Area', family.projectArea)
    editOption('Status', 'Todo')
  }
}
