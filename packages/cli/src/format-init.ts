import type { InitGuide, InitPackage } from './commands/init.ts'

/** The two packages a new project starts with, so they are not repeated as extras. */
const STARTER_PACKAGES: readonly string[] = ['@astryx-vue/core', '@astryx-vue/themes']

/** What a package line says on top of its version, e.g. `(not on npm yet)`. */
function packageNote(pkg: InitPackage, zh: boolean): string {
  if (!pkg.published)
    return zh ? '（还没发布）' : ' (not on npm yet)'
  return pkg.canary ? (zh ? '（canary，API 可能会变）' : ' (canary, the API may change)') : ''
}

/** Why a package has no install command, in one line the reader can act on. */
function unpublishedReason(pkg: InitPackage, zh: boolean): string {
  if (pkg.canary) {
    return zh
      ? '以后只发 canary，装的时候要写 `@canary`'
      : 'when it ships it will be canary only, so it takes the `@canary` tag'
  }
  return zh ? '还没有发布计划上 npm 的版本' : 'no version is on npm, and none is scheduled'
}

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
      lines.push(`  ${pkg.name} ${pkg.version}${packageNote(pkg, zh)}`)
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
    const extras = guide.packages.filter(pkg => !STARTER_PACKAGES.includes(pkg.name))
    const installable = extras.filter(pkg => pkg.install.length > 0)
    if (installable.length > 0) {
      lines.push(zh ? '按需安装（canary 的要带 @canary）：' : 'Install on demand (canary packages take the tag):', '')
      for (const pkg of installable)
        lines.push(...pkg.install.map(command => `  ${command}`))
      lines.push('')
    }
    // Naming a package without an install command is the only honest thing to do
    // for one npm cannot serve: the reader learns it exists, and is not sent to a
    // failing command.
    const unpublished = extras.filter(pkg => pkg.install.length === 0)
    if (unpublished.length > 0) {
      lines.push(zh ? '还没发布到 npm，现在装不到（只列名字）：' : 'Not on npm yet, so there is nothing to install:', '')
      for (const pkg of unpublished)
        lines.push(`  ${pkg.name} — ${unpublishedReason(pkg, zh)}`)
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
