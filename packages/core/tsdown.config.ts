import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'
import { stripCssImportsFromDts } from '../../scripts/tsdown/strip-css-imports-from-dts.ts'

export default defineConfig({
  // `src/*/index.ts` 只匹配一层目录。Markdown 这三个子路径在第二层，
  // package.json 的 exports 已经指向它们的 dist；不写进 entry 就不会产出文件。
  entry: [
    'src/index.ts',
    'src/*/index.ts',
    'src/Icon/plugin.ts',
    'src/Markdown/parser/index.ts',
    'src/Markdown/plugin-protocol/index.ts',
    'src/Markdown/plugin-renderer/index.ts',
  ],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  clean: true,
  plugins: [Vue({ isProduction: true }), stripCssImportsFromDts()],
  deps: {
    neverBundle: ['vue', /^node:/, /\.css$/],
  },
  dts: { vue: true },
})
