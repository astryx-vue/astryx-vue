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
