import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'
import { stripCssImportsFromDts } from '../../scripts/tsdown/strip-css-imports-from-dts.ts'

export default defineConfig({
  entry: ['src/index.ts', 'src/markdown.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  clean: true,
  plugins: [Vue({ isProduction: true }), stripCssImportsFromDts()],
  deps: {
    // vue、core 和 Lexical 由使用方安装，不打进包里。样式文件也保持外部引用：
    // 组件自己 `import` 它们，打包器交给使用方的 CSS 流程处理。
    neverBundle: ['vue', '@astryx-vue/core', 'lexical', /^@lexical\//, /\.css$/],
  },
  dts: { vue: true },
})
