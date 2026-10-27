import process from 'node:process'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// 测试结果不能随外部 NODE_ENV 变，要和 CI（不设 NODE_ENV）完全一样。两件事都靠这一行：
// - 运行时：Vue 在 production 下会跳过 devtools 的 `component:emit` 通知，
//   @vue/test-utils 的 wrapper.emitted() 正是靠它记录事件。
// - 模板编译：vite.config.ts 在这之后才加载 @vitejs/plugin-vue，vue 因此选中开发版编译器。
//   开发版会保留模板注释，根节点前带注释的组件根是 Fragment，测试要用选择器找元素。
// tests/test-env.test.ts 检查这两点。
process.env.NODE_ENV = 'test'

export default defineConfig(async env => mergeConfig(await viteConfig(env), defineConfig({
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
})))
