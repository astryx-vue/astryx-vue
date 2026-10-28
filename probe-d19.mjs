// 用法: node probe.mjs <out.json> <chunkIndex> <chunkCount>
import { chromium } from 'playwright'
import { readdirSync, writeFileSync } from 'node:fs'
const [out, ci = '0', cc = '1'] = process.argv.slice(2)
const BASE = 'http://127.0.0.1:5173'
const dir = '/Users/shenqingchuan/workspace/astryx-vue-wt/D19/apps/docs/docs/en/components'
const pages = readdirSync(dir).filter(n => !n.includes('.')).sort().filter((_, i) => i % Number(cc) === Number(ci))
const SEL = {
  table: '.astryx-table',
  th: '.astryx-table th',
  td: '.astryx-table tbody tr:first-child td',
  group: '.astryx-table td.astryx-table__group',
  panel: '.astryx-table td.astryx-table__panel',
  select: '.astryx-table__select',
  toolbar: '.astryx-toolbar',
  tablist: '.astryx-tab-list',
  token: '.astryx-token',
  h3: '.astryx-markdown h3',
  h4: '.astryx-markdown h4',
  mdtable: '.astryx-markdown table',
  progress: '.astryx-progress-bar',
  textinput: '.astryx-text-input',
  textcontrol: '.astryx-text-input-control',
  icon: '.astryx-icon',
  button: '.astryx-button',
}
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const result = {}
for (const name of pages) {
  try {
    await page.goto(`${BASE}/components/${name}`, { waitUntil: 'load', timeout: 20000 })
    await page.waitForTimeout(250)
    result[name] = await page.evaluate((SEL) => {
      const o = {}
      for (const [k, s] of Object.entries(SEL)) {
        const els = [...document.querySelectorAll(s)].slice(0, 60)
        if (!els.length) continue
        o[k] = els.map((e) => {
          const r = e.getBoundingClientRect()
          const c = getComputedStyle(e)
          const extra = {}
          if (k === 'table') { extra.layout = c.tableLayout; extra.minw = c.minWidth }
          if (['th', 'td', 'group', 'panel', 'select'].includes(k)) extra.pad = c.padding
          if (k === 'toolbar') extra.pad = c.padding
          if (k === 'tablist') extra.pad = c.padding
          if (k === 'h3' || k === 'h4') extra.m = c.margin
          if (k === 'token') extra.va = c.verticalAlign
          if (k === 'icon') { const sv = e.querySelector(':scope > svg, :scope > span > svg'); if (sv) extra.fill = getComputedStyle(sv).fill }
          return [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10, extra]
        })
      }
      return o
    }, SEL)
  } catch (e) { result[name] = { error: String(e).slice(0, 100) } }
}
writeFileSync(out, JSON.stringify(result))
await browser.close()
console.log('pages', pages.length)
