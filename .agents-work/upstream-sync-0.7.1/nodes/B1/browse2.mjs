import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
const dir = '/tmp/verify-B1/b1copy'
const require = createRequire(dir + '/package.json')
const { chromium } = require('playwright')
const port = 5171
const srv = spawn('pnpm', ['--filter', '@astryx-vue/docs', 'dev', '--port', String(port), '--strictPort'], { cwd: dir, detached: true, stdio: 'ignore', env: { ...process.env, NODE_ENV: 'development' } })
const kill = () => { try { process.kill(-srv.pid, 'SIGTERM') } catch {} }
process.on('exit', kill)
let browser
try {
  for (let i = 0; i < 180; i++) { try { if ((await fetch(`http://localhost:${port}/en/vt2`)).ok) break } catch {} await new Promise(r => setTimeout(r, 1000)) }
  browser = await chromium.launch()
  const page = await (await browser.newContext({ viewport: { width: 900, height: 700 } })).newPage()
  await page.goto(`http://localhost:${port}/en/vt2`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForSelector('#m-dark .astryx-media-theme', { timeout: 60000 })
  const media = () => page.evaluate(() => ({
    ...Object.fromEntries(['m-dark', 'm-light'].map(id => [id, document.querySelector(`#${id} .astryx-media-theme`).getAttribute('data-astryx-media') ?? 'off'])),
    scheme: getComputedStyle(document.querySelector('.astryx-theme')).colorScheme,
    painted: (() => { const s = document.createElement('span'); s.style.color = 'var(--astryx-color-text-primary)'; document.getElementById('m-dark').appendChild(s); const c = getComputedStyle(s).color; s.remove(); return c })(),
  }))
  const set = async (m) => { await page.evaluate((m) => globalThis.__setMode(m), m); await page.waitForTimeout(700) }
  console.log('A mount light      ->', JSON.stringify(await media()))
  await set('dark'); console.log('A then switch dark ->', JSON.stringify(await media()))
  await set('light'); console.log('A then switch light->', JSON.stringify(await media()))
  await page.goto(`http://localhost:${port}/en/vt2?dark`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#m-dark .astryx-media-theme'); await page.waitForTimeout(700)
  console.log('B mount dark       ->', JSON.stringify(await media()))
  await set('light'); console.log('B then switch light->', JSON.stringify(await media()))
} catch (e) { console.log('ERR', String(e)) } finally { await browser?.close().catch(() => {}); kill() }
