const COMMIT_URL = 'https://github.com/meta/astryx/commit/'
const ITEM = /^- \[([ xX])\] \[`([0-9a-f]{9})`\]/

/** 汇总 PR 固定用这个分支和清单文件，工作流每周只更新它们，不再按版本开 issue。 */
export const PENDING_BRANCH = 'upstream-sync/pending'
export const PENDING_FILE = 'docs/upstream-sync/pending.md'

function countCommits(families) {
  return families.reduce((sum, family) => sum + family.commits.length, 0)
}

/** 把逐版本的计划翻成逐组件族：移植是按族分工的，同一族的提交放在一起才好认领。 */
export function groupByFamily(plan) {
  const families = new Map()
  for (const release of plan) {
    for (const family of release.families) {
      if (!families.has(family.id))
        families.set(family.id, { ...family, releases: [] })
      families.get(family.id).releases.push({ to: release.to, commits: family.commits })
    }
  }
  return [...families.values()]
}

/**
 * 从上一版清单里读出已勾选的提交和挂在提交下面的备注。
 * 清单每周整份重写，不读回来的话，大家勾掉的条目和写的「不适用」理由都会被冲掉。
 */
export function readProgress(markdown = '') {
  const progress = new Map()
  let current = null
  for (const line of markdown.split('\n')) {
    const match = ITEM.exec(line)
    if (match) {
      current = { checked: match[1] !== ' ', notes: [] }
      progress.set(match[2], current)
    }
    else if (current && line.startsWith('  ') && line.trim()) {
      current.notes.push(line)
    }
    else {
      current = null
    }
  }
  return progress
}

function renderCommit(commit, progress) {
  const hash = commit.hash.slice(0, 9)
  const previous = progress.get(hash)
  const box = previous?.checked ? 'x' : ' '
  const breaking = commit.breaking ? '**[破坏性]** ' : ''
  return [`- [${box}] [\`${hash}\`](${COMMIT_URL}${hash}) ${breaking}${commit.subject}`, ...(previous?.notes ?? [])]
}

/** 清单文件：按组件族、再按版本列出全部待核对的上游提交。 */
export function renderPendingChecklist(plan, { from, to }, previous = '') {
  const progress = readProgress(previous)
  const families = groupByFamily(plan)
  const total = plan.reduce((sum, release) => sum + countCommits(release.families), 0)
  const lines = [
    '<!-- 由 Upstream Sync 工作流生成。可以直接勾选、在条目下缩进两格写备注，下次生成会保留。 -->',
    '',
    '# 上游待同步清单',
    '',
    `上游范围：\`${from}..${to}\`，${families.length} 个组件族，${total} 个提交。`,
    '',
    '逐条核实后再勾选：采纳的在条目下写上对应 PR；不适用的在条目下写明理由。Vue 版不机械照搬 React 实现。',
    '',
  ]
  for (const family of families) {
    lines.push(`## ${family.title}${family.area ? `（area:${family.area}）` : ''}`, '')
    for (const release of family.releases) {
      lines.push(`### ${release.to}`, '')
      for (const commit of release.commits)
        lines.push(...renderCommit(commit, progress))
      lines.push('')
    }
  }
  return lines.join('\n')
}

/** 汇总 PR 的标题和正文。正文只放统计，逐条清单在文件里，避免超过 GitHub 的正文长度上限。 */
export function renderPendingPullRequest(plan, { from, to }, checklist = '') {
  const families = groupByFamily(plan)
  const progress = readProgress(checklist)
  const done = [...progress.values()].filter(item => item.checked).length
  const total = plan.reduce((sum, release) => sum + countCommits(release.families), 0)
  const familyRows = families.map((family) => {
    const commits = family.releases.flatMap(release => release.commits)
    const breaking = commits.filter(commit => commit.breaking).length
    return `| ${family.title} | ${family.area ?? '—'} | ${commits.length} | ${breaking || '—'} |`
  })
  const releaseRows = plan.map(release => `| ${release.to} | ${release.families.length} | ${countCommits(release.families)} |`)
  const body = [
    '<!-- upstream-sync:pending -->',
    '',
    `上游范围：\`${from}..${to}\`，共 ${total} 个提交，已核对 ${done} 个。逐条清单见 \`${PENDING_FILE}\`。`,
    '',
    '这个 PR 由 Upstream Sync 工作流每周更新，只放清单，不放移植代码：',
    '',
    '- 移植改动各自开 PR 进 main，在清单里勾掉对应提交并写上 PR 链接。',
    '- 不适用的提交也勾掉，在条目下写明理由。',
    `- 全部核对完后，在这个 PR 里把 \`package.json\` 的 \`upstream.syncedTo\` 改成 \`${to}\`，再合并收尾。`,
    '',
    '## 按组件族',
    '',
    '| 组件族 | area | 提交 | 破坏性 |',
    '| --- | --- | --- | --- |',
    ...familyRows,
    '',
    '## 按版本',
    '',
    '| 版本 | 组件族 | 提交 |',
    '| --- | --- | --- |',
    ...releaseRows,
    '',
  ]
  return { title: `上游同步：${from} → ${to}`, body: body.join('\n'), labels: ['upstream-sync'] }
}
