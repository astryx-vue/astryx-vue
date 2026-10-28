// node tpl-probe.mjs <ours|up> <template> <scriptfile>
import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
const [which, tpl, file] = process.argv.slice(2)
const fn = (await import(pathToFileURL(file).href)).default
const up = which === 'up'
const browser = await chromium.launch(up ? { proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' } } : {})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto((up ? 'https://astryx.atmeta.com' : 'http://127.0.0.1:5173') + '/playground?template=' + tpl, { waitUntil: 'domcontentloaded', timeout: 60000 })
let f
for (let i = 0; i < 40 && !f; i++) {
  await page.waitForTimeout(1500)
  for (const fr of page.frames()) {
    if (fr === page.mainFrame()) continue
    const ok = await fr.evaluate(() => document.body && document.body.innerText.length > 200 && !/Building/.test(document.body.innerText.slice(0, 200))).catch(() => false)
    if (ok) { f = fr; break }
  }
}
if (!f) { console.log('no frame', page.frames().map(x => x.url().slice(0, 80))); process.exit(1) }
await page.waitForTimeout(1500)
console.log(JSON.stringify(await f.evaluate(fn)))
await browser.close()
