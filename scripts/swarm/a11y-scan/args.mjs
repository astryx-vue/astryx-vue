/**
 * 解析 `pnpm a11y` 的命令行参数。
 */
import { parseArgs } from 'node:util'

export const DEFAULT_OUT_DIR = '.agents-work/upstream-sync/a11y'
export const KNOWN_ISSUES_FILE = 'scripts/guardrails/a11y-known-issues.json'
export const SCHEMES = ['light', 'dark']

export const USAGE = `用法: pnpm a11y [选项]

  --only <列表>          只扫这些组件页（slug，逗号分隔）。不给就扫全部
  --schemes <列表>       light、dark，逗号分隔，默认两种都扫
  --update               把名单里已经不再出现的条目删掉（只删不加）
  --init                 名单文件还不存在时，用这次结果建第一份名单
  --out <dir>            输出目录，默认 ${DEFAULT_OUT_DIR}
  --ours <url>           文档站地址（只写到域名），给了就不起服务
  --no-serve             假设 5172 端口上已经有本工作区的文档站
  --concurrency <n>      同一个浏览器里同时开几个页面，默认 2
  --lock-timeout <分钟>  等浏览器锁最多等多久，默认 30
  -h, --help             显示这段说明`

function list(value) {
  return value == null ? undefined : [...new Set(value.split(',').map(item => item.trim()).filter(Boolean))]
}

function positive(value, name) {
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0)
    throw new Error(`${name} 需要正数，收到 ${value}`)
  return number
}

/** 把 argv 解析成运行配置。出错时抛出带说明的 Error。 */
export function parseA11yArgs(argv) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'only': { type: 'string' },
      'schemes': { type: 'string' },
      'update': { type: 'boolean', default: false },
      'init': { type: 'boolean', default: false },
      'out': { type: 'string', default: DEFAULT_OUT_DIR },
      'ours': { type: 'string' },
      'no-serve': { type: 'boolean', default: false },
      'concurrency': { type: 'string', default: '2' },
      'lock-timeout': { type: 'string', default: '30' },
      'help': { type: 'boolean', short: 'h', default: false },
    },
  })
  if (values.help)
    return { help: true }
  if (positionals.length > 0)
    throw new Error(`不认识的参数：${positionals.join(' ')}`)
  const schemes = list(values.schemes) ?? SCHEMES
  const unknown = schemes.filter(scheme => !SCHEMES.includes(scheme))
  if (unknown.length > 0 || schemes.length === 0)
    throw new Error(`--schemes 只能是 light、dark，收到 ${values.schemes}`)
  if (values.update && values.init)
    throw new Error('--update 和 --init 不能同时用')
  return {
    help: false,
    only: list(values.only),
    schemes: SCHEMES.filter(scheme => schemes.includes(scheme)),
    update: values.update,
    init: values.init,
    outDir: values.out,
    oursOrigin: values.ours,
    serve: !values.ours && !values['no-serve'],
    concurrency: Math.floor(positive(values.concurrency, '--concurrency')),
    lockTimeoutMs: positive(values['lock-timeout'], '--lock-timeout') * 60 * 1000,
  }
}
