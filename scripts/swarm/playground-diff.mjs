#!/usr/bin/env node
/**
 * 演练场模板和原版自动对比：同一个模板，原版（astryx.atmeta.com）和本地 docs preview
 * 各开一次，在预览 iframe 里采集「有文字的元素 + 图标」，配对后按位置、尺寸、
 * 字号、字重、颜色、背景色判偏差，给出可以当标准的数字。
 *
 * 用法：node scripts/swarm/playground-diff.mjs <slug> <light|dark> <本地端口> [--json 输出路径]
 * 必须用 browser-lock 包着跑（本脚本自己不开锁）：
 *   node scripts/swarm/browser-lock.mjs run --purpose "演练场对比 table" -- \
 *     node scripts/swarm/playground-diff.mjs table light 5181
 *
 * 本地站点要先 `pnpm docs:build`，再 `pnpm --filter @astryx-vue/docs preview --port 5181`。
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import process from 'node:process'
import { parseDiffArgs, playgroundUrls, USAGE, UsageError } from './playground-diff/args.mjs'
import { collectPlaygroundFrame } from './playground-diff/collect.mjs'
import { compareSides } from './playground-diff/compare.mjs'
import { launchBrowser, openSide } from './playground-diff/page.mjs'
import { buildJsonPayload, renderReport } from './playground-diff/report.mjs'

const MAX_DEVIATIONS = 3

function log(message) {
  process.stderr.write(`${message}\n`)
}

async function main() {
  let parsed
  try {
    parsed = parseDiffArgs(process.argv.slice(2))
  }
  catch (error) {
    if (error instanceof UsageError) {
      log(`${error.message}\n\n${USAGE}`)
      return 2
    }
    throw error
  }
  if (parsed.help) {
    process.stdout.write(`${USAGE}\n`)
    return 0
  }

  const { slug, scheme, port, jsonPath } = parsed
  const { upstreamUrl, ourUrl } = playgroundUrls(slug, port)
  log(`演练场对比：${slug} · ${scheme}`)
  log(`  原版 ${upstreamUrl}`)
  log(`  我们 ${ourUrl}`)

  const browser = await launchBrowser()
  try {
    const upstream = await openSide(browser, upstreamUrl, { scheme, local: false })
    const upstreamCollected = await upstream.frame.evaluate(collectPlaygroundFrame)
    await upstream.context.close()

    const ours = await openSide(browser, ourUrl, { scheme, local: true })
    const ourCollected = await ours.frame.evaluate(collectPlaygroundFrame)
    await ours.context.close()

    const result = compareSides(upstreamCollected.items, ourCollected.items)
    const meta = {
      slug,
      scheme,
      port,
      upstreamUrl,
      ourUrl,
      maxDeviations: MAX_DEVIATIONS,
      collect: {
        upstream: { items: upstreamCollected.items.length, scans: upstreamCollected.scanned, scrollers: upstreamCollected.scrollers },
        ours: { items: ourCollected.items.length, scans: ourCollected.scanned, scrollers: ourCollected.scrollers },
      },
    }

    process.stdout.write(renderReport(meta, result))
    if (jsonPath) {
      mkdirSync(dirname(jsonPath), { recursive: true })
      writeFileSync(jsonPath, `${JSON.stringify(buildJsonPayload(meta, result), null, 2)}\n`)
      log(`完整结果写入 ${jsonPath}`)
    }

    const passed = result.deviationCount <= MAX_DEVIATIONS && result.staticMissingCount === 0
    return passed ? 0 : 1
  }
  finally {
    await browser.close()
  }
}

process.exit(await main())
