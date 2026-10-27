import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/markdown.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  clean: true,
  deps: {
    // vue、core 和 Lexical 由使用方安装，不打进包里；两者都不是本包的运行时依赖。
    neverBundle: ['vue', '@astryx-vue/core', 'lexical', /^@lexical\//],
  },
})
