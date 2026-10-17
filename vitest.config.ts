import process from 'node:process'
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// 测试必须跑在非生产模式。Vue 在 production 下会跳过 devtools 的
// `component:emit` 通知，而 @vue/test-utils 的 wrapper.emitted() 正是靠它
// 记录事件。父进程若带着 NODE_ENV=production（例如从生产模式的服务进程
// 继承），整个测试集都会因为 emitted() 返回 undefined 而失败。
// 必须在加载 Vue 之前设置，模块初始化时就会读取这个值。
process.env.NODE_ENV = 'test'

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
