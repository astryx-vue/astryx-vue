import { defineConfig } from 'vite'

// 动态加载 @vitejs/plugin-vue。它一加载就会加载 vue，vue 再按「那一刻」的 NODE_ENV
// 选开发版或生产版的模板编译器。写成静态 import 的话，加载时机早于 vitest.config.ts
// 设置 NODE_ENV 的那一行（配置文件会被打包，外部依赖的 import 会被提到最前面）。
export default defineConfig(async () => {
  const { default: vue } = await import('@vitejs/plugin-vue')
  return { plugins: [vue()] }
})
