/**
 * 命令行参数解析。纯函数，测试不用起浏览器。
 *
 * node scripts/swarm/playground-diff.mjs <slug> <light|dark> <本地端口> [--json 输出路径]
 */
export const USAGE = `用法：node scripts/swarm/playground-diff.mjs <模板 slug> <light|dark> <本地端口> [--json 输出路径]

  模板 slug     演练场模板名，例如 table、dashboard、login
  颜色模式      light 或 dark
  本地端口      本地 docs preview 的端口，站点要事先 docs:build
  --json 路径   把完整结果写成 JSON

必须包在 browser-lock 里跑：
  node scripts/swarm/browser-lock.mjs run --purpose "演练场对比 table" -- \\
    node scripts/swarm/playground-diff.mjs table light 5181

退出码：0 = 偏差 ≤ 3 且没有缺失；1 = 不通过；2 = 用法错。`

export const SCHEMES = ['light', 'dark']

export class UsageError extends Error {}

/**
 * 解析参数。返回 { slug, scheme, port, jsonPath }，参数不对时抛 UsageError。
 */
export function parseDiffArgs(argv) {
  const positionals = []
  let jsonPath = null
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h')
      return { help: true }
    if (arg === '--json') {
      const value = argv[index + 1]
      if (!value || value.startsWith('--'))
        throw new UsageError('--json 后面要跟输出路径')
      jsonPath = value
      index += 1
      continue
    }
    if (arg.startsWith('--json=')) {
      jsonPath = arg.slice('--json='.length)
      if (!jsonPath)
        throw new UsageError('--json 后面要跟输出路径')
      continue
    }
    if (arg.startsWith('-'))
      throw new UsageError(`不认识的选项：${arg}`)
    positionals.push(arg)
  }

  const [slug, scheme, port, ...rest] = positionals
  if (!slug)
    throw new UsageError('缺少模板 slug')
  if (!scheme)
    throw new UsageError('缺少颜色模式（light 或 dark）')
  if (!SCHEMES.includes(scheme))
    throw new UsageError(`颜色模式只能是 ${SCHEMES.join('/')}：${scheme}`)
  if (!port)
    throw new UsageError('缺少本地端口')
  if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65_535)
    throw new UsageError(`本地端口不像个端口号：${port}`)
  if (rest.length)
    throw new UsageError(`多余的参数：${rest.join(' ')}`)

  return { slug, scheme, port: Number(port), jsonPath }
}

/** 两个要打开的地址。原版只能走代理，本地走 127.0.0.1。 */
export function playgroundUrls(slug, port) {
  const query = `?template=${encodeURIComponent(slug)}`
  return {
    upstreamUrl: `https://astryx.atmeta.com/playground${query}`,
    ourUrl: `http://127.0.0.1:${port}/playground/${query}`,
  }
}
