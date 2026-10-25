import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  clean: true,
  dts: true,
  deps: {
    // d3 和 vue 由使用方安装，不打进包里。
    neverBundle: ['vue', /^d3-/],
  },
})
