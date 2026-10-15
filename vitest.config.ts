import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(viteConfig, defineConfig({
  // 文档站通过 source 条件在构建前加载组件源码。
  // pnpm test 跑在 pnpm build 之前，这里同样打开，否则
  // `@astryx-vue/core/Avatar` 这类子路径会落到还不存在的 dist。
  resolve: {
    conditions: ['source', 'module', 'browser', 'development|production'],
  },
  test: {
    environment: 'happy-dom',
    include: ['packages/**/*.test.ts', 'tests/**/*.test.ts'],
    // Vitest stubs every CSS import, including `?raw`. The playground reads
    // Neutral tokens from that source, so keep those files intact.
    css: {
      include: [/\.css\?raw(?:&|$)/],
    },
  },
}))
