// 用法: node run-d19.mjs <页面路径> <脚本文件>  脚本导出 default 函数在页面里执行
import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
const [path, file, base = 'http://127.0.0.1:5173'] = process.argv.slice(2)
const fn = (await import(pathToFileURL(file).href)).default
const browser = await chromium.launch(base.includes('127.0.0.1') ? {} : { proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' } })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
await page.goto(base + path, { waitUntil: 'load', timeout: 30000 })
await page.waitForTimeout(500)
console.log(JSON.stringify(await page.evaluate(fn), null, 1))
await browser.close()
