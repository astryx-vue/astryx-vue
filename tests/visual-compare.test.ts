import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  acquireBrowserLock,
  isLockStale,
  lockStatus,
  parseLockCli,
  tryAcquire,
  withBrowserLock,
} from '../scripts/swarm/browser-lock.mjs'
import { parseVisualArgs } from '../scripts/swarm/visual-compare/args.mjs'
import { relativeLuminance, schemeFromLuminance } from '../scripts/swarm/visual-compare/capture.mjs'
import {
  backgroundColor,
  compareImages,
  contentBox,
  PAD_COLOR,
  padTo,
  readPng,
  sideBySide,
  verdictFor,
  writePng,
} from '../scripts/swarm/visual-compare/image.mjs'
import { COMBOS, componentUrls, outputPaths, parseCombos, toSlug, toUpstreamName } from '../scripts/swarm/visual-compare/names.mjs'
import { buildReportJson, buildReportMd, sizeDelta } from '../scripts/swarm/visual-compare/report.mjs'

type RGB = [number, number, number]

function solid(width: number, height: number, color: RGB): PNG {
  const png = new PNG({ width, height })
  for (let i = 0; i < png.data.length; i += 4) {
    png.data[i] = color[0]
    png.data[i + 1] = color[1]
    png.data[i + 2] = color[2]
    png.data[i + 3] = 255
  }
  return png
}

function fill(png: PNG, x: number, y: number, w: number, h: number, color: RGB): PNG {
  for (let row = y; row < y + h; row++) {
    for (let col = x; col < x + w; col++) {
      const o = (row * png.width + col) * 4
      png.data[o] = color[0]
      png.data[o + 1] = color[1]
      png.data[o + 2] = color[2]
    }
  }
  return png
}

function pixel(png: PNG, x: number, y: number): number[] {
  const o = (y * png.width + x) * 4
  return [png.data[o], png.data[o + 1], png.data[o + 2]]
}

describe('组件名映射', () => {
  it.each([
    ['Button', 'button'],
    ['DropdownMenu', 'dropdown-menu'],
    ['HStack', 'h-stack'],
    ['VStack', 'v-stack'],
    ['AvatarGroupOverflow', 'avatar-group-overflow'],
    ['useClipboard', 'use-clipboard'],
    ['DropdownMenuSubMenu', 'dropdown-menu-submenu'],
  ])('%s ↔ %s', (name, slug) => {
    expect(toSlug(name)).toBe(slug)
    expect(toUpstreamName(slug)).toBe(name)
    expect(toUpstreamName(name)).toBe(name)
  })

  it('slug 原样传入时保持不变', () => {
    expect(toSlug('dropdown-menu')).toBe('dropdown-menu')
    expect(toSlug('button')).toBe('button')
  })
})

describe('uRL 生成', () => {
  it('默认地址：上游 PascalCase，我们用英文页 slug', () => {
    expect(componentUrls('DropdownMenu')).toEqual({
      name: 'DropdownMenu',
      slug: 'dropdown-menu',
      upstream: 'https://astryx.atmeta.com/components/DropdownMenu',
      ours: 'http://localhost:5172/en/components/dropdown-menu',
    })
  })

  it('自定义地址会去掉末尾斜杠', () => {
    const urls = componentUrls('button', { upstreamOrigin: 'https://example.com/', oursOrigin: 'http://127.0.0.1:4000/' })
    expect(urls.upstream).toBe('https://example.com/components/Button')
    expect(urls.ours).toBe('http://127.0.0.1:4000/en/components/button')
  })
})

describe('截图组合与参数', () => {
  it('四种组合的视口和颜色', () => {
    expect(COMBOS['desktop-light']).toMatchObject({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', deviceScaleFactor: 1 })
    expect(COMBOS['mobile-dark']).toMatchObject({ viewport: { width: 390, height: 844 }, colorScheme: 'dark', deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  })

  it('parseCombos 去重、保序，未知名字报错', () => {
    expect(parseCombos(undefined)).toEqual(['desktop-light', 'desktop-dark', 'mobile-light', 'mobile-dark'])
    expect(parseCombos('mobile-dark, desktop-light,mobile-dark')).toEqual(['mobile-dark', 'desktop-light'])
    expect(() => parseCombos('tablet-light')).toThrow(/tablet-light/)
  })

  it('parseVisualArgs 解析选项', () => {
    const opts = parseVisualArgs(['Button', '--combos', 'desktop-dark', '--ours', 'http://localhost:5173', '--section', 'all'], {})
    expect(opts).toMatchObject({ component: 'Button', combos: ['desktop-dark'], section: 'all', serve: false, oursOrigin: 'http://localhost:5173' })
    expect(parseVisualArgs(['Button'], {})).toMatchObject({ serve: true, proxy: 'http://127.0.0.1:7890', section: 'overview' })
    expect(parseVisualArgs(['Button', '--no-serve'], { https_proxy: 'http://p:1' })).toMatchObject({ serve: false, proxy: 'http://p:1' })
    expect(parseVisualArgs(['Button', '--no-proxy'], {}).proxy).toBeUndefined()
    expect(() => parseVisualArgs([], {})).toThrow()
    expect(() => parseVisualArgs(['Button', '--section', 'top'], {})).toThrow(/section/)
  })
})

describe('输出路径', () => {
  it('按 组件/组合/文件 命名', () => {
    const p = outputPaths('/out', 'Button', 'mobile-dark')
    expect(p).toMatchObject({
      componentDir: join('/out', 'Button'),
      upstream: join('/out', 'Button', 'mobile-dark', 'upstream.png'),
      ours: join('/out', 'Button', 'mobile-dark', 'ours.png'),
      sideBySide: join('/out', 'Button', 'mobile-dark', 'side-by-side.png'),
      reportJson: join('/out', 'Button', 'report.json'),
      reportMd: join('/out', 'Button', 'report.md'),
    })
    expect(outputPaths('/out', 'Button').comboDir).toBeUndefined()
  })
})

describe('差异分数', () => {
  it('两张相同的图分数为 0', () => {
    const a = fill(solid(100, 80, [240, 240, 240]), 40, 30, 4, 4, [0, 0, 0])
    const b = readPng(writePng(a))
    const r = compareImages(a, b)
    expect(r.diffPixels).toBe(0)
    expect(r.diffPercent).toBe(0)
    expect(r.contentDiffPercent).toBe(0)
    expect(r.verdict).toBe('same')
  })

  it('整图分数按整张画布算，内容区分数按内容框并集算', () => {
    const a = fill(solid(100, 100, [255, 255, 255]), 40, 40, 4, 4, [0, 0, 0])
    const b = fill(solid(100, 100, [255, 255, 255]), 40, 40, 2, 4, [0, 0, 0])
    const r = compareImages(a, b)
    expect(r.diffPixels).toBe(8)
    expect(r.diffPercent).toBe(0.08)
    expect(r.contentBox).toEqual({ x: 40, y: 40, width: 4, height: 4 })
    expect(r.contentBoxes).toEqual({ a: { x: 40, y: 40, width: 4, height: 4 }, b: { x: 40, y: 40, width: 2, height: 4 } })
    expect(r.contentDiffPercent).toBe(50)
    expect(r.verdict).toBe('different')
  })

  it('尺寸不同时补白到最大宽高，水平居中贴顶', () => {
    const small = solid(2, 2, [0, 0, 0])
    const padded = padTo(small, 6, 4)
    expect(padded.width).toBe(6)
    expect(padded.height).toBe(4)
    expect(pixel(padded, 2, 0)).toEqual([0, 0, 0])
    expect(pixel(padded, 0, 0)).toEqual(PAD_COLOR)
    expect(pixel(padded, 2, 3)).toEqual(PAD_COLOR)
    const r = compareImages(small, solid(6, 4, [0, 0, 0]))
    expect(r.width).toBe(6)
    expect(r.height).toBe(4)
    expect(r.diffPixels).toBe(20)
  })

  it('背景色取内缩一圈里最常见的颜色，内容框排除背景和圆角边缘', () => {
    const png = fill(solid(100, 100, [20, 20, 20]), 40, 42, 5, 3, [250, 250, 250])
    // 模拟圆角外的透明区：四角各一块不同颜色，不能算进内容框。
    for (const [x, y] of [[0, 0], [90, 0], [0, 90], [90, 90]])
      fill(png, x, y, 10, 10, [255, 255, 255])
    expect(backgroundColor(png)).toEqual([20, 20, 20])
    expect(contentBox(png)).toEqual({ x: 40, y: 42, width: 5, height: 3 })
    expect(contentBox(solid(10, 10, [1, 2, 3]))).toBeNull()
  })

  it('结论阈值', () => {
    expect(verdictFor(1.99)).toBe('same')
    expect(verdictFor(2)).toBe('review')
    expect(verdictFor(10)).toBe('review')
    expect(verdictFor(10.01)).toBe('different')
  })

  it('对照图：左右并排，中间 16px 分隔，顶部留标签条', () => {
    const out = sideBySide(solid(10, 5, [255, 0, 0]), solid(8, 7, [0, 0, 255]), { leftLabel: 'up', rightLabel: 'ours' })
    expect(out.width).toBe(10 + 16 + 8)
    const bar = out.height - 7
    expect(bar).toBeGreaterThan(0)
    expect(pixel(out, 0, bar)).toEqual([255, 0, 0])
    expect(pixel(out, 12, bar)).toEqual([160, 160, 160])
    expect(pixel(out, 26, bar)).toEqual([0, 0, 255])
  })
})

describe('颜色模式判断', () => {
  it('按背景亮度区分深浅', () => {
    expect(schemeFromLuminance(relativeLuminance([27, 27, 27]))).toBe('dark')
    expect(schemeFromLuminance(relativeLuminance([23, 24, 26]))).toBe('dark')
    expect(schemeFromLuminance(relativeLuminance([241, 241, 241]))).toBe('light')
    expect(schemeFromLuminance(relativeLuminance([245, 245, 245]))).toBe('light')
  })
})

describe('报告', () => {
  it('report.md 用相对路径引用图片，写出分数和尺寸差', () => {
    const files = outputPaths('/out', 'Button', 'desktop-light')
    const report = buildReportJson({
      component: 'Button',
      slug: 'button',
      section: 'overview',
      urls: { upstream: 'u', ours: 'o' },
      startedAt: 't0',
      finishedAt: 't1',
      toolVersion: '1.0.0',
      playwrightVersion: '1.63.0',
    }, [
      {
        combo: 'desktop-light',
        ok: true,
        upstream: { width: 912, height: 513 },
        ours: { width: 912, height: 500 },
        sizeDelta: sizeDelta({ width: 912, height: 513 }, { width: 912, height: 500 }),
        score: {
          diffPercent: 3.2,
          contentDiffPercent: 5.5,
          verdict: 'review',
          upstreamContentBox: { x: 0, y: 0, width: 300, height: 40 },
          oursContentBox: null,
        },
        files: { sideBySide: files.sideBySide, diff: files.diff },
      },
      { combo: 'mobile-dark', ok: false, error: 'boom' },
    ])
    const md = buildReportMd(report, files.componentDir)
    expect(md).toContain('](desktop-light/side-by-side.png)')
    expect(md).toContain('| desktop-light | 5.5% | 3.2% | 有差异，需要看图 | 912×513 | 912×500 | 宽 0，高 -13 | 300×40 / 空 |')
    expect(md).toContain('失败：boom')
    expect(report.tool).toEqual({ name: 'visual-compare', version: '1.0.0', playwright: '1.63.0' })
  })
})

describe('浏览器锁', () => {
  let root: string
  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'swarm-lock-test-'))
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('依次占用两个槽，第三个拿不到，释放后能再拿', () => {
    const a = tryAcquire(root, 'a')
    const b = tryAcquire(root, 'b')
    expect(a?.slot).toBe('browser-1')
    expect(b?.slot).toBe('browser-2')
    expect(tryAcquire(root, 'c')).toBeNull()
    const owner = JSON.parse(readFileSync(join(root, 'browser-1', 'owner.json'), 'utf8'))
    expect(owner).toMatchObject({ pid: process.pid, purpose: 'a' })
    expect(typeof owner.cwd).toBe('string')
    expect(Number.isFinite(Date.parse(owner.startedAt))).toBe(true)
    a!.release()
    a!.release()
    expect(readdirSync(root)).toEqual(['browser-2'])
    expect(tryAcquire(root, 'c')?.slot).toBe('browser-1')
    expect(lockStatus(root).map(s => s.held)).toEqual([true, true])
  })

  it('持有进程已不在，或持有超过 2 小时，视为失效并回收', () => {
    const now = Date.parse('2026-01-01T03:00:00Z')
    const alive = () => true
    expect(isLockStale({ pid: 1, startedAt: '2026-01-01T02:00:00Z' }, { now, pidAlive: alive })).toBe(false)
    expect(isLockStale({ pid: 1, startedAt: '2026-01-01T00:59:00Z' }, { now, pidAlive: alive })).toBe(true)
    expect(isLockStale({ pid: 1, startedAt: '2026-01-01T02:00:00Z' }, { now, pidAlive: () => false })).toBe(true)
    expect(isLockStale(null, { now })).toBe(false)

    for (const slot of ['browser-1', 'browser-2']) {
      mkdirSync(join(root, slot))
      writeFileSync(join(root, slot, 'owner.json'), JSON.stringify({ pid: 999_999_999, startedAt: new Date().toISOString() }))
    }
    const lock = tryAcquire(root, 'reclaim')
    expect(lock?.slot).toBe('browser-1')
    expect(JSON.parse(readFileSync(join(root, 'browser-1', 'owner.json'), 'utf8')).purpose).toBe('reclaim')
  })

  it('释放时不会删掉别人后来拿到的同一个槽', () => {
    const mine = tryAcquire(root, 'mine')!
    writeFileSync(join(root, 'browser-1', 'owner.json'), JSON.stringify({ pid: 42, startedAt: 'later' }))
    mine.release()
    expect(readdirSync(root)).toEqual(['browser-1'])
  })

  it('排队：重试间隔内拿不到就继续等，超时抛错', async () => {
    tryAcquire(root, 'a')
    tryAcquire(root, 'b')
    const logs: string[] = []
    await expect(acquireBrowserLock('c', { root, timeoutMs: 30, retryMs: 10, log: (m: string) => logs.push(m) }))
      .rejects
      .toThrow(/拿不到浏览器锁/)
    expect(logs.some(m => m.includes('排队中'))).toBe(true)
  })

  it('排队中有槽释放后能继续', async () => {
    const a = tryAcquire(root, 'a')!
    tryAcquire(root, 'b')
    setTimeout(() => a.release(), 30)
    const lock = await acquireBrowserLock('c', { root, timeoutMs: 2_000, retryMs: 10, log: () => {} })
    expect(lock.slot).toBe('browser-1')
  })

  it('withBrowserLock 在函数抛错时也释放', async () => {
    await expect(withBrowserLock('x', async () => {
      expect(readdirSync(root)).toEqual(['browser-1'])
      throw new Error('fail')
    }, { root, handleSignals: false })).rejects.toThrow('fail')
    expect(readdirSync(root)).toEqual([])
    await expect(withBrowserLock('y', async lock => lock.slot, { root })).resolves.toBe('browser-1')
    expect(readdirSync(root)).toEqual([])
  })

  it('命令行参数解析', () => {
    expect(parseLockCli(['run', '--purpose', '手动看图', '--timeout', '5', '--', 'node', '-e', '1'])).toEqual({
      command: 'run',
      purpose: '手动看图',
      timeoutMs: 5 * 60 * 1000,
      cmd: ['node', '-e', '1'],
    })
  })
})
