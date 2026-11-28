/**
 * 解析 `pnpm visual` 的命令行参数。
 */
import process from 'node:process'
import { parseArgs } from 'node:util'
import { parseCombos } from './names.mjs'

export const DEFAULT_OUT_DIR = '.agents-work/upstream-sync/visual'
export const DEFAULT_PROXY = 'http://127.0.0.1:7890'

export const USAGE = `用法: pnpm visual <组件> [选项]

  <组件>                 上游英文名（Button、DropdownMenu）或我们的 slug（dropdown-menu）
  --section <s>          overview（默认，只截标题下的预览区）| all（两边整页长图，不算分）
  --combos <列表>        逗号分隔，默认 desktop-light,desktop-dark,mobile-light,mobile-dark
  --ours <url>           我们站点的地址（只写到域名，例如 http://localhost:5173），给了就不起服务
  --upstream <url>       上游站点地址，默认 https://astryx.atmeta.com
  --out <dir>            输出目录，默认 ${DEFAULT_OUT_DIR}
  --port <n>             自己起文档站时用的端口。默认取本工作区登记的槽位端口（5170 + 槽位号），没登记就用 5172
  --no-serve             假设端口上的文档站已经在跑，不自己起
  --proxy <url>          访问上游用的代理，默认取 https_proxy，再没有就用 ${DEFAULT_PROXY}
  --no-proxy             不走代理
  --lock-timeout <分钟>  等浏览器锁最多等多久，默认 30
  -h, --help             显示这段说明`

/** 把 argv 解析成运行配置。出错时抛出带说明的 Error。 */
export function parseVisualArgs(argv, env = process.env) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      'section': { type: 'string', default: 'overview' },
      'combos': { type: 'string' },
      'ours': { type: 'string' },
      'upstream': { type: 'string' },
      'out': { type: 'string', default: DEFAULT_OUT_DIR },
      'port': { type: 'string' },
      'no-serve': { type: 'boolean', default: false },
      'proxy': { type: 'string' },
      'no-proxy': { type: 'boolean', default: false },
      'lock-timeout': { type: 'string', default: '30' },
      'help': { type: 'boolean', short: 'h', default: false },
    },
  })
  if (values.help)
    return { help: true }
  if (positionals.length !== 1)
    throw new Error(`需要且只需要一个组件名，收到 ${positionals.length} 个`)
  if (!['overview', 'all'].includes(values.section))
    throw new Error(`--section 只能是 overview 或 all，收到 ${values.section}`)
  const port = values.port === undefined ? undefined : Number(values.port)
  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535))
    throw new Error(`--port 需要 1–65535 的整数，收到 ${values.port}`)
  const lockTimeoutMinutes = Number(values['lock-timeout'])
  if (!Number.isFinite(lockTimeoutMinutes) || lockTimeoutMinutes <= 0)
    throw new Error(`--lock-timeout 需要正数分钟，收到 ${values['lock-timeout']}`)
  return {
    help: false,
    component: positionals[0],
    section: values.section,
    combos: parseCombos(values.combos),
    oursOrigin: values.ours,
    upstreamOrigin: values.upstream,
    outDir: values.out,
    port,
    serve: !values.ours && !values['no-serve'],
    proxy: values['no-proxy'] ? undefined : (values.proxy ?? env.https_proxy ?? env.HTTPS_PROXY ?? DEFAULT_PROXY),
    lockTimeoutMs: lockTimeoutMinutes * 60 * 1000,
  }
}
