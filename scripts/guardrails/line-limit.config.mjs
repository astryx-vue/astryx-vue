// 500 行检查的配置。脚本在 scripts/check-line-limit.mjs。

/** 单个源码文件允许的最多物理行数，口径和 `wc -l` 一致。 */
export const LINE_LIMIT = 500

/** 统计哪些扩展名的文件。文档（.md）和样式（.css）不算源码，不在这里。 */
export const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.mts', '.js', '.mjs', '.cjs', '.vue']

/** 白名单文件：记录已经超标的旧文件和它们现在的行数，只能越变越短。 */
export const ALLOWLIST_FILE = 'scripts/guardrails/line-limit-allowlist.json'

/**
 * 不统计的文件。路径是相对仓库根目录、用 `/` 分隔的写法。
 * 每条都要写清楚为什么排除。
 */
export const EXCLUDES = [
  {
    pattern: /\.(?:test|spec)\.[^/]+$/,
    reason: '测试文件。测试要把各种情况写全，长一些是正常的。',
  },
  {
    pattern: /(?:^|\/)tests\//,
    reason: '测试目录里的文件都是测试。',
  },
  {
    pattern: /^packages\/core\/src\/index\.ts$/,
    reason: '由 pnpm sync 生成（scripts/sync-exports.mjs 的 generatedFiles）。',
  },
  {
    pattern: /^packages\/core\/src\/composables\/index\.ts$/,
    reason: '由 pnpm sync 生成（scripts/sync-exports.mjs 的 generatedFiles）。',
  },
  {
    pattern: /^packages\/core\/src\/locale\/messages\.ts$/,
    reason: '由 pnpm sync 生成（scripts/sync-exports.mjs 的 generatedFiles）。',
  },
  {
    pattern: /^packages\/cli\/src\/generated\//,
    reason: '由 pnpm --filter @astryx-vue/cli generate 生成。',
  },
  {
    pattern: /(?:^|\/)dist\//,
    reason: '构建产物。',
  },
  {
    pattern: /^apps\/docs\/public\//,
    reason: '文档站原样发布的静态资源，可能是打包好的第三方代码。',
  },
]
