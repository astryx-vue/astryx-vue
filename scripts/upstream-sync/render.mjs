const COMMIT_URL = 'https://github.com/meta/astryx/commit/'
const MAX_FILES = 8

function fileList(files) {
  const shown = files.slice(0, MAX_FILES).map(file => `\`${file}\``).join('、')
  return files.length > MAX_FILES ? `${shown} 等 ${files.length} 个` : shown
}

function renderCommit(commit) {
  const lines = [
    `- [ ] \`${commit.hash.slice(0, 9)}\` ${commit.breaking ? '**[破坏性]** ' : ''}${commit.subject}`,
    `  - 文件：${fileList(commit.files)}`,
    `  - 链接：${COMMIT_URL}${commit.hash}`,
  ]
  return lines.join('\n')
}

export function issueTitle(tag, family) {
  return `上游 ${tag}：${family.title}`
}

export function renderIssue(release, family) {
  const labels = ['upstream-sync']
  if (family.area)
    labels.push(`area:${family.area}`)
  const body = [
    `<!-- upstream-sync:${release.to}:${family.id} -->`,
    '',
    `上游范围：\`${release.from}..${release.to}\`。由每周同步工作流生成，同名 issue 不会重复创建。`,
    '',
    '逐条核实后再勾选：采纳时关联对应 PR；不适用时在该条下面写明理由。Vue 版不机械照搬 React 实现。',
    '',
    `## 提交清单（${family.commits.length}）`,
    '',
    ...family.commits.map(renderCommit),
    '',
  ]
  return { title: issueTitle(release.to, family), body: body.join('\n'), labels }
}

/**
 * 一个上游版本只开一个 issue：组件族的提交全部收在下面各自的小节里。
 * 按族拆开会给每个版本留下二十来个 issue，仓库里很快就只剩同步噪音。
 */
/** 版本清单里的提交只留标题和链接：整版清单会超过 GitHub 的正文长度上限。 */
function renderCompactCommit(commit) {
  return `- [ ] \`${commit.hash.slice(0, 9)}\` ${commit.breaking ? '**[破坏性]** ' : ''}${commit.subject}`
}

export function renderReleaseIssue(release) {
  const labels = new Set(['upstream-sync'])
  for (const family of release.families) {
    if (family.area)
      labels.add(`area:${family.area}`)
  }
  const total = release.families.reduce((sum, family) => sum + family.commits.length, 0)
  const sections = release.families.map((family) => {
    const summary = `<summary>${family.title}${family.area ? `（area:${family.area}）` : ''} · ${family.commits.length} 个提交</summary>`
    return ['<details>', summary, '', ...family.commits.map(renderCompactCommit), '', '</details>', ''].join('\n')
  })
  const body = [
    `<!-- upstream-sync:${release.to}:all -->`,
    '',
    `上游范围：\`${release.from}..${release.to}\`。由每周同步工作流生成，同名 issue 不会重复创建。`,
    '',
    '逐条核实后再勾选：采纳时关联对应 PR；不适用时在该条下面写明理由。Vue 版不机械照搬 React 实现。',
    '',
    `## 提交清单（${total}）`,
    '',
    ...sections,
  ]
  return { title: `上游 ${release.to}：同步清单`, body: body.join('\n'), labels: [...labels] }
}
