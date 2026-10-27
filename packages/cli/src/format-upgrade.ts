import type { UpgradeReport } from './commands/upgrade.ts'

/**
 * `upgrade` prints: where the project stands, what the upgrade guide says to do,
 * and which of the project's own lines still use an old name. Nothing is
 * changed, so the last line says so.
 */
export function formatUpgradeReport(report: UpgradeReport, dense: boolean): string {
  const zh = report.locale === 'zh'
  const lines: string[] = []

  if (report.status === 'not-installed') {
    lines.push(zh ? `这个项目还没有安装 ${report.package}。` : `${report.package} is not in this project yet.`)
    lines.push('', zh ? '安装：' : 'Install:')
    for (const command of report.notes)
      lines.push(`  ${command}`)
    lines.push('', `${zh ? '文档' : 'Docs'}: ${report.guideUrl}`, '')
    return `${lines.join('\n')}`
  }

  const head = report.status === 'outdated'
    ? (zh
        ? `${report.package} ${report.current} → ${report.latest}`
        : `${report.package} ${report.current} → ${report.latest}`)
    : report.status === 'up-to-date'
      ? (zh
          ? `${report.package} ${report.current} 已经是最新（这个 CLI 认的版本是 ${report.latest}），不用升级。`
          : `${report.package} ${report.current} is the latest this CLI knows (${report.latest}). Nothing to upgrade.`)
      : (zh
          ? `${report.package} 的版本写法是 ${JSON.stringify(report.current)}，看不出是不是最新。`
          : `This CLI cannot read the ${report.package} version as a number, so it cannot say whether it is current.`)
  lines.push(head, '')

  if (report.status !== 'outdated') {
    lines.push(`${zh ? '更新日志' : 'Changelog'}: ${report.changelogUrl}`, '')
    return `${lines.join('\n')}`
  }

  lines.push(zh ? `升级指南：${report.guideUrl}` : `Upgrade guide: ${report.guideUrl}`, '')

  if (!dense) {
    for (const [index, section] of report.sections.entries()) {
      lines.push(`${index + 1}. ${section.title}`, '')
      lines.push(...section.body.split('\n').map(line => (line ? `   ${line}` : '')))
      lines.push('')
    }
  }
  else {
    for (const section of report.sections)
      lines.push(`- ${section.title}`)
    lines.push('')
  }

  if (report.renames.length > 0) {
    lines.push(zh ? '旧名字（在你项目里搜这些）：' : 'Old names to look for in this project:', '')
    for (const rename of report.renames)
      lines.push(`  ${rename.from} → ${rename.to}`)
    lines.push('')
  }

  if (report.hits.length === 0) {
    lines.push(zh ? '项目里没有命中这些旧名字。' : 'None of the old names appear in this project.', '')
  }
  else {
    lines.push(zh
      ? `命中 ${report.hits.length}${report.truncated ? '+' : ''} 处，自己改这几行：`
      : `${report.hits.length}${report.truncated ? '+' : ''} place(s) still use an old name:`, '')
    for (const hit of report.hits)
      lines.push(`  ${hit.file}:${hit.line}  ${hit.from} → ${hit.to}`, `    ${hit.text}`)
    lines.push('', zh ? '只读：upgrade 不改任何文件。' : 'Read only: upgrade changes no file.', '')
  }
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd()}\n`
}
