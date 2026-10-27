import type { InitGuide } from './commands/init.ts'

/** `init` prints: what to install, what to import, and what the managed block did. */

export function formatInitGuide(guide: InitGuide, files: readonly { path: string, action: string }[], locale: 'en' | 'zh', dense: boolean): string {
  const zh = locale === 'zh'
  const header = zh ? 'astryx-vue init — 交给 AI 助手的接入说明' : 'astryx-vue init — what an AI assistant has to wire up'
  const managerLine = guide.packageManager
    ? (zh
        ? `包管理器：${guide.packageManager}（来自 ${guide.packageManagerSource === 'packageManager' ? 'package.json 的 packageManager 字段' : guide.lockfile}）`
        : `Package manager: ${guide.packageManager} (from ${guide.packageManagerSource === 'packageManager' ? 'the packageManager field' : guide.lockfile})`)
    : (zh
        ? '包管理器：没探测到（没有 packageManager 字段，也没有锁文件），四种写法都列出来。'
        : 'Package manager: not detected (no packageManager field, no lockfile), so every form is listed.')
  const lines = [header, '', managerLine, '']

  if (!dense) {
    lines.push(zh ? '这个 catalog 覆盖的包：' : 'Packages this catalog covers:', '')
    for (const pkg of guide.packages) {
      const note = pkg.canary ? (zh ? '（canary，API 可能会变）' : ' (canary, the API may change)') : ''
      lines.push(`  ${pkg.name} ${pkg.version}${note}`)
      lines.push(`    ${pkg.description}`)
    }
    lines.push('')
  }

  for (const [index, step] of guide.steps.entries()) {
    lines.push(`${index + 1}. ${step.title}`)
    if (step.text)
      lines.push(...step.text.split('\n').map(line => `   ${line}`))
    if (step.code)
      lines.push('', ...step.code.split('\n').map(line => `   ${line}`), '')
    for (const command of step.commands ?? [])
      lines.push(`   ${command}`)
    lines.push('')
  }

  if (!dense) {
    const extras = guide.packages.filter(pkg => !['@astryx-vue/core', '@astryx-vue/themes'].includes(pkg.name))
    if (extras.length > 0) {
      lines.push(zh ? '按需安装（canary 的要带 @canary）：' : 'Install on demand (canary packages take the tag):', '')
      for (const pkg of extras)
        lines.push(...pkg.install.map(command => `  ${command}`))
      lines.push('')
    }
  }

  if (files.length > 0) {
    lines.push(zh ? '受管理的区块：' : 'Managed block:')
    for (const file of files)
      lines.push(`  ${blockAction(file, locale)}`)
    lines.push('')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

/** How one agent file was handled, in a sentence a reader can act on. */
function blockAction(file: { path: string, action: string }, locale: 'en' | 'zh'): string {
  const zh = locale === 'zh'
  if (file.action === 'created')
    return zh ? `已创建 ${file.path}` : `Created ${file.path}`
  if (file.action === 'appended')
    return zh ? `已追加受管理区块到 ${file.path}` : `Appended the managed block to ${file.path}`
  return zh ? `已更新受管理区块于 ${file.path}` : `Updated the managed block in ${file.path}`
}
