import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { buildLedger, main, parseArgs, UnmatchedFilesError, writeLedger } from '../scripts/upstream-ledger.mjs'
import { ORPHAN_HEADING, readAnnotations, stripAnnotations } from '../scripts/upstream-ledger/annotations.mjs'
import { commitType, isBreaking, parseLog, pullRequestNumber } from '../scripts/upstream-ledger/commits.mjs'
import { isSpecDoc, isTestFile } from '../scripts/upstream-ledger/render.mjs'
import { classifyPath, NODES, validateRules } from '../scripts/upstream-ledger/rules.mjs'

function nodesOf(path: string) {
  return classifyPath(path)?.nodes ?? null
}

describe('归类规则', () => {
  it('规则表只用到登记过的节点', () => {
    expect(validateRules()).toEqual([])
  })

  it.each([
    ['packages/core/src/Selector/Selector.tsx', ['C3']],
    ['packages/core/src/DropdownMenu/DropdownMenuItem.tsx', ['C6']],
    ['packages/core/src/Field/InputClearButton.tsx', ['C1']],
    ['packages/core/src/theme/tokens.stylex.ts', ['B1']],
    ['packages/core/src/theme/syntax/SyntaxTheme.tsx', ['B1', 'C9']],
    ['packages/core/src/reset.css', ['B2']],
    ['packages/core/src/inputFontFloor.test.ts', ['B2']],
    ['packages/core/src/hooks/useFocusTrap.ts', ['B3']],
    ['packages/core/src/utils/pressGesture.ts', ['B3']],
    ['packages/core/src/Layer/useLayer.tsx', ['B4']],
    ['packages/core/src/Overlay/Overlay.tsx', ['B4']],
    ['packages/core/src/Icon/globalIconRegistry.tsx', ['B5', 'C16']],
    ['packages/core/locales/zh-CN.json', ['B5']],
    ['packages/core/src/BaseProps.ts', ['B6']],
    ['packages/core/src/naming.ts', ['B6']],
    ['packages/core/src/SizeContext/SizeContext.ts', ['B6']],
    ['packages/core/src/utils/timeParser.ts', ['B7']],
    ['packages/core/src/HStack/HStack.tsx', ['C14']],
    ['packages/core/src/VisuallyHidden/VisuallyHidden.tsx', ['C14']],
    ['packages/themes/neutral/src/neutralTheme.ts', ['D1']],
    ['packages/themes/matcha/src/matchaTheme.ts', ['D2']],
    ['packages/themes/probe/src/probeTheme.ts', ['D3']],
    ['packages/cli/assets/templates/pages/ide/page.tsx', ['D5']],
    ['packages/cli/assets/codemods/transforms/next/index.mjs', ['D6']],
    ['packages/cli/clients/cli/commands/upgrade.mjs', ['D6']],
    ['packages/cli/api/search/search.mjs', ['D4']],
    ['packages/cli/assets/templates/themes/neutral/neutralTheme.ts', ['D1']],
    ['packages/richtext/src/markdownTable.ts', ['F1a']],
    ['packages/richtext/src/RichTextEditor.tsx', ['F1b']],
    ['packages/richtext/src/RichTextEditor.doc.mjs', ['F1c']],
    ['packages/charts/src/formatters.ts', ['F2a']],
    ['packages/charts/src/Chart.tsx', ['F2b']],
    ['packages/lab/src/TransferList/TransferList.tsx', ['F3a']],
    ['packages/lab/src/Schedule/Schedule.tsx', ['F3b']],
    ['packages/lab/src/Drawer/Drawer.tsx', ['F3c']],
    ['packages/lab/src/ThreeD/ThreeD.tsx', ['F3d']],
    ['packages/lab/src/ChatReasoning/ChatReasoning.tsx', ['F3e']],
    ['packages/lab/src/BottomSheet/BottomSheet.tsx', ['C8']],
    ['packages/vega/src/VegaChart.tsx', ['F5']],
    ['packages/build/src/vite.ts', ['F6']],
    ['apps/docsite/src/app/playground/PreviewStage.tsx', ['D8']],
    ['docs/specs/AST-059-layer-viewport-inset/spec.md', ['B4']],
  ])('%s 归到 %j', (path, nodes) => {
    expect(nodesOf(path)).toEqual(nodes)
  })

  it.each([
    'apps/storybook/stories/Button.stories.tsx',
    'apps/example-nextjs/app/page.tsx',
    'apps/docsite/src/components/SiteFooter.tsx',
    '.husky/pre-commit',
    '.changeset/brave-lions.md',
    'packages/core/CHANGELOG.md',
    'packages/core/package.json',
    'packages/core/src/index.ts',
    'packages/core/src/stylexValidation.source-build.test.mjs',
    'internal/eslint-plugin-astryx/no-raw-color.js',
  ])('%s 是无关文件，并带原因', (path) => {
    const result = classifyPath(path)
    expect(result?.nodes).toEqual([])
    expect(result?.reason).toBeTruthy()
  })

  it('上游新出现的未知路径不被任何规则命中', () => {
    expect(classifyPath('brand-new-dir/file.ts')).toBeNull()
    expect(classifyPath('packages/core/src/BrandNewWidget/BrandNewWidget.tsx')).toBeNull()
  })
})

describe('提交解析', () => {
  it.each([
    ['feat(core)!: drop it', '', true],
    ['fix!: drop it', '', true],
    ['feat(core): add it', 'BREAKING CHANGE: the prop is gone', true],
    ['feat(core): add it', 'BREAKING-CHANGE: the prop is gone', true],
    ['feat(core): add it', 'not breaking', false],
    ['Revert "feat!: x"', '', false],
  ])('%s / %s → 破坏性 %s', (subject, body, expected) => {
    expect(isBreaking(subject, body)).toBe(expected)
  })

  it('读出提交类型和 PR 编号', () => {
    expect(commitType('feat(selectors)!: FR10 (#7341)')).toBe('feat')
    expect(commitType('Wait for Storybook (#6646)')).toBeNull()
    expect(pullRequestNumber('feat(selectors)!: FR10 (#7341)')).toBe(7341)
    expect(pullRequestNumber('chore: no number')).toBeNull()
  })

  it('解析 git log 输出，文件去重排序，提交按时间排序', () => {
    const output = '\x1Ebbb\x1F20\x1Fsecond\x1F\x1F\0\nz.ts\0a.ts\0\x1Eaaa\x1F10\x1Ffirst\x1Fbody\x1F\0\nb.ts\0b.ts\0'
    expect(parseLog(output)).toEqual([
      { hash: 'aaa', time: 10, subject: 'first', body: 'body', files: ['b.ts'] },
      { hash: 'bbb', time: 20, subject: 'second', body: '', files: ['a.ts', 'z.ts'] },
    ])
  })

  it('识别规范文档和测试文件', () => {
    expect(isSpecDoc('packages/core/src/Selector/Selector.spec.md')).toBe(true)
    expect(isSpecDoc('packages/cli/assets/docs/theme.doc.zh.mjs')).toBe(true)
    expect(isSpecDoc('packages/core/src/Selector/Selector.tsx')).toBe(false)
    expect(isTestFile('packages/core/src/Selector/Selector.fr10.test.tsx')).toBe(true)
    expect(isTestFile('packages/core/src/reset.a11y.chromium.spec.ts')).toBe(true)
    expect(isTestFile('packages/core/src/Selector/Selector.spec.md')).toBe(false)
  })

  it('命令行参数', () => {
    expect(parseArgs(['--from', 'a', '--to', 'b', '--check'])).toMatchObject({ from: 'a', to: 'b', check: true })
    expect(() => parseArgs(['--bogus'])).toThrow('无法识别的参数')
    expect(() => parseArgs(['--from'])).toThrow('无法识别的参数')
  })
})

describe('在临时仓库上生成台账', () => {
  let repo: string
  let base: string
  let unmatchedTip: string
  const noPins = { pins: {}, breaking: { nodes: [], reason: '' } }
  let seconds = 0

  function git(...args: string[]) {
    return execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args], {
      cwd: repo,
      encoding: 'utf8',
      env: { ...process.env, GIT_AUTHOR_DATE: `@${1_700_000_000 + seconds} +0000`, GIT_COMMITTER_DATE: `@${1_700_000_000 + seconds} +0000` },
    }).trim()
  }

  function commit(message: string, files: string[]) {
    seconds += 60
    for (const file of files) {
      mkdirSync(dirname(join(repo, file)), { recursive: true })
      writeFileSync(join(repo, file), `${message}\n`)
    }
    git('add', '-A')
    git('commit', '-q', '--allow-empty', '-m', message)
    return git('rev-parse', 'HEAD')
  }

  beforeAll(() => {
    repo = mkdtempSync(join(tmpdir(), 'upstream-ledger-'))
    git('init', '-q', '-b', 'main')
    base = commit('chore: start', ['README.md'])
    commit('fix(Selector): keep focus (#1)', ['packages/core/src/Selector/Selector.tsx', 'packages/core/src/Selector/Selector.test.tsx'])
    commit('feat(selectors): share a trigger with menus (#2)', ['packages/core/src/Selector/Selector.tsx', 'packages/core/src/DropdownMenu/DropdownMenu.tsx', 'packages/core/src/Selector/Selector.spec.md'])
    commit('feat(theme)!: remove the old surface (#3)', ['packages/core/src/theme/tokens.stylex.ts'])
    commit('refactor(Button): tidy\n\nBREAKING CHANGE: the size prop is gone', ['packages/core/src/Button/Button.tsx', 'packages/core/src/Button/Button.doc.mjs'])
    commit('ci: bump storybook (#5)', ['apps/storybook/stories/Button.stories.tsx', '.changeset/x.md'])
    git('tag', 'v1')
    unmatchedTip = commit('chore: add a strange folder (#6)', ['brand-new-dir/file.ts', 'packages/core/src/BrandNewWidget/BrandNewWidget.tsx'])
  })

  afterAll(() => {
    rmSync(repo, { recursive: true, force: true })
  })

  function build(options = noPins) {
    return buildLedger({ upstream: repo, from: base, to: 'v1', ...options })
  }

  it('普通提交只出现在一个节点', () => {
    const files = build()
    expect(files.get('C3.md')).toContain('fix(Selector): keep focus (#1)')
    for (const [name, content] of files) {
      if (name !== 'C3.md' && name !== '_summary.md')
        expect(content).not.toContain('keep focus')
    }
  })

  it('跨节点提交两边都有，并互相标出还涉及', () => {
    const files = build()
    const c3 = files.get('C3.md')!
    const c6 = files.get('C6.md')!
    expect(c3).toContain('share a trigger with menus (#2)')
    expect(c6).toContain('share a trigger with menus (#2)')
    expect(c3).toMatch(/share a trigger[\s\S]*?还涉及：C6/)
    expect(c6).toMatch(/share a trigger[\s\S]*?还涉及：C3/)
    expect(c3).toContain('规范文档：Selector/Selector.spec.md')
  })

  it('识别两种写法的破坏性提交', () => {
    const files = build()
    const b1 = files.get('B1.md')!
    const c16 = files.get('C16.md')!
    expect(b1).toContain('共 1 个提交 · 其中破坏性 1 个')
    expect(b1.indexOf('remove the old surface')).toBeLessThan(b1.indexOf('## 新功能'))
    expect(c16).toContain('其中破坏性 1 个')
    expect(c16.indexOf('refactor(Button): tidy')).toBeLessThan(c16.indexOf('## 新功能'))
    expect(c16).toContain('规范文档：Button/Button.doc.mjs')
  })

  it('全是无关文件的提交进 _unrelated.md，并写明原因', () => {
    const files = build()
    const unrelated = files.get('_unrelated.md')!
    expect(unrelated).toContain('ci: bump storybook (#5)')
    expect(unrelated).toMatch(/bump storybook[\s\S]*?原因：.*Storybook/)
    expect(files.get('C16.md')).not.toContain('bump storybook')
  })

  it('破坏性提交默认追加到 D7，按 PR 编号可追加节点', () => {
    const files = build({ pins: { 1: { nodes: ['B6'], reason: '测试追加' } } as never, breaking: { nodes: ['D7'], reason: '测试破坏性' } })
    const d7 = files.get('D7.md')!
    expect(d7).toContain('remove the old surface')
    expect(d7).toContain('refactor(Button): tidy')
    expect(d7).toContain('归入原因：测试破坏性')
    expect(files.get('B6.md')).toContain('keep focus (#1)')
    expect(files.get('C3.md')).toMatch(/keep focus[\s\S]*?还涉及：B6/)
  })

  it('有文件落空时报错并列出这些文件', () => {
    let error: unknown
    try {
      buildLedger({ upstream: repo, from: base, to: unmatchedTip, ...noPins })
    }
    catch (caught) {
      error = caught
    }
    expect(error).toBeInstanceOf(UnmatchedFilesError)
    expect((error as UnmatchedFilesError).files).toEqual(['brand-new-dir/file.ts', 'packages/core/src/BrandNewWidget/BrandNewWidget.tsx'])
  })

  it('跑两次产物逐字节相同，--check 能发现改动', () => {
    expect([...build()]).toEqual([...build()])
    const out = mkdtempSync(join(tmpdir(), 'upstream-ledger-out-'))
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const args = ['--upstream', repo, '--from', base, '--to', 'v1', '--out', out]
      expect(main(args)).toBe(0)
      const first = readFileSync(join(out, 'C3.md'), 'utf8')
      expect(main(args)).toBe(0)
      expect(readFileSync(join(out, 'C3.md'), 'utf8')).toBe(first)
      expect(main([...args, '--check'])).toBe(0)
      writeFileSync(join(out, 'C3.md'), `${first}手改\n`)
      expect(main([...args, '--check'])).toBe(1)
      writeFileSync(join(out, 'Z9.md'), '多余\n')
      writeFileSync(join(out, 'README.md'), '人维护\n')
      expect(main(args)).toBe(0)
      expect(main([...args, '--check'])).toBe(0)
      expect(readFileSync(join(out, 'README.md'), 'utf8')).toBe('人维护\n')
    }
    finally {
      log.mockRestore()
      err.mockRestore()
      rmSync(out, { recursive: true, force: true })
    }
  })

  it('重新生成保留勾选和备注，--check 忽略它们', () => {
    const out = mkdtempSync(join(tmpdir(), 'upstream-ledger-keep-'))
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      const args = ['--upstream', repo, '--from', base, '--to', 'v1', '--out', out]
      expect(main(args)).toBe(0)
      const fresh = readFileSync(join(out, 'C3.md'), 'utf8')
      const hash = /`([0-9a-f]{9})` fix\(Selector\): keep focus/.exec(fresh)![1]
      // 节点打勾，并在链接下面写结论。
      const annotated = fresh
        .replace(`- [ ] \`${hash}\``, `- [x] \`${hash}\``)
        .replace(/(keep focus[\s\S]*? {2}- 链接：\S+)/, '$1\n  - 结论：不适用：我们已经保留焦点\n    证据在 Selector.test.ts')
      writeFileSync(join(out, 'C3.md'), annotated)
      expect(main([...args, '--check'])).toBe(0)
      expect(main(args)).toBe(0)
      expect(readFileSync(join(out, 'C3.md'), 'utf8')).toBe(annotated)
      expect(log.mock.calls.at(-1)![0]).toContain('保留了 1 条')
      // 生成的部分被手改仍然会被 --check 发现。
      const tampered = annotated.replace(/(keep focus[\s\S]*? {2}- 文件：)[^\n]+/, '$1手改.tsx')
      expect(tampered).not.toBe(annotated)
      writeFileSync(join(out, 'C3.md'), tampered)
      expect(main([...args, '--check'])).toBe(1)
    }
    finally {
      log.mockRestore()
      err.mockRestore()
      rmSync(out, { recursive: true, force: true })
    }
  })

  it('提交不再归这个节点时，旧结论移到文件末尾；整份台账消失且有结论时拒绝写入', () => {
    const out = mkdtempSync(join(tmpdir(), 'upstream-ledger-orphan-'))
    try {
      writeLedger(out, build())
      const c3 = readFileSync(join(out, 'C3.md'), 'utf8')
      const hash = /`([0-9a-f]{9})` feat\(selectors\): share a trigger/.exec(c3)![1]
      writeFileSync(join(out, 'C3.md'), c3.replace(`- [ ] \`${hash}\``, `- [x] \`${hash}\``))
      // 模拟改了归类：这次生成的 C3 里没有这个提交。
      const files = build()
      const blocks = files.get('C3.md')!.split('\n- ')
      files.set('C3.md', blocks.filter(block => !block.includes(hash)).join('\n- '))
      const result = writeLedger(out, files)
      expect(result.orphans.get('C3.md')).toEqual([hash])
      const written = readFileSync(join(out, 'C3.md'), 'utf8')
      expect(written).toContain(`${ORPHAN_HEADING}\n`)
      expect(written.slice(written.indexOf(ORPHAN_HEADING))).toContain(`- [x] \`${hash}\` feat(selectors): share a trigger with menus (#2)`)
      expect(stripAnnotations(written)).toBe(files.get('C3.md'))
      // 下一次生成又归回来了，结论认回原位，末尾那一节消失。
      writeLedger(out, build())
      const back = readFileSync(join(out, 'C3.md'), 'utf8')
      expect(back).not.toContain(ORPHAN_HEADING)
      expect(back).toContain(`- [x] \`${hash}\``)

      const withoutC3 = build()
      withoutC3.delete('C3.md')
      expect(() => writeLedger(out, withoutC3)).toThrow(/C3\.md/)
      expect(readFileSync(join(out, 'C3.md'), 'utf8')).toBe(back)
    }
    finally {
      rmSync(out, { recursive: true, force: true })
    }
  })

  it('只认节点台账里人写的内容', () => {
    const text = [
      '- [x] `abc123456` feat: a',
      '  - 文件：a.ts',
      '  - 结论：已采纳',
      '  - 链接：https://x',
      '- [ ] `def123456` fix: b',
      '  - 文件：b.ts',
      '',
    ].join('\n')
    expect([...readAnnotations(text)]).toEqual([['abc123456', { checked: true, notes: ['  - 结论：已采纳'], title: 'feat: a' }]])
    expect(stripAnnotations(text)).toBe(text.replace('- [x]', '- [ ]').replace('  - 结论：已采纳\n', ''))
  })

  it('总表列出每个节点', () => {
    const summary = build().get('_summary.md')!
    for (const node of Object.keys(NODES))
      expect(summary).toContain(`| ${NODES[node as keyof typeof NODES]} |`)
    expect(summary).toContain('## 需要总控确认')
  })
})
