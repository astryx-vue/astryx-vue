// 让 Node 直接加载 core 的 TypeScript 源码：源码里写的是 `./foo.js`，磁盘上是 `foo.ts`。
// 类型由 Node 自带的类型擦除处理，这里只负责把扩展名对上。
import { existsSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

registerHooks({
  resolve(specifier, context, nextResolve) {
    const relative = specifier.startsWith('.') || specifier.startsWith('/')
    if (relative && specifier.endsWith('.js') && context.parentURL?.endsWith('.ts')) {
      const url = new URL(specifier.replace(/\.js$/, '.ts'), context.parentURL)
      if (existsSync(fileURLToPath(url)))
        return nextResolve(url.href, context)
    }
    return nextResolve(specifier, context)
  },
})
