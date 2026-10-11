import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

// 声明文件里的 CSS 副作用 import 解析不到类型，attw 会报 InternalResolutionError。
// 运行时的 js 仍然引入这些样式。
function stripCssImportsFromDts() {
  const pattern = /import\s+['"][^'"]+\.css['"];?\r?\n/g
  return {
    name: 'strip-css-imports-from-dts',
    generateBundle(_options: unknown, bundle: Record<string, { type: string, fileName?: string, code?: string, source?: string | Uint8Array }>) {
      for (const file of Object.values(bundle)) {
        if (!file.fileName?.endsWith('.d.ts'))
          continue
        if (file.type === 'chunk' && typeof file.code === 'string')
          file.code = file.code.replace(pattern, '')
        else if (file.type === 'asset' && typeof file.source === 'string')
          file.source = file.source.replace(pattern, '')
      }
    },
  }
}

export default defineConfig({
  entry: ['src/index.ts', 'src/*/index.ts'],
  format: ['esm'],
  platform: 'neutral',
  target: 'es2022',
  clean: true,
  plugins: [Vue({ isProduction: true }), stripCssImportsFromDts()],
  deps: {
    neverBundle: ['vue', /\.css$/],
  },
  dts: { vue: true },
})
