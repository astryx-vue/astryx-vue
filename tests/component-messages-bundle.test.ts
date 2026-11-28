// @vitest-environment node
import type { Rollup } from 'vite'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { build } from 'vite'
import { describe, expect, it } from 'vitest'
import { chatMessages } from '../packages/core/src/locale/messages/chat.ts'
import { commentsMessages } from '../packages/core/src/locale/messages/comments.ts'
import { emojiPickerMessages } from '../packages/core/src/locale/messages/emoji-picker.ts'
import { powerSearchMessages } from '../packages/core/src/locale/messages/power-search.ts'
import { tableMessages } from '../packages/core/src/locale/messages/table.ts'

// 组件按命名空间读内置文案：只引入某个组件的子路径时，打出来的包里不该出现别的组件的文案。
// 这里真正打一次包，再在产物里找几个与这些组件无关的命名空间的英文。

const coreSrc = join(dirname(fileURLToPath(import.meta.url)), '../packages/core/src')

async function bundle(component: string): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [vue()],
    build: {
      write: false,
      minify: false,
      lib: { entry: join(coreSrc, component, 'index.ts'), formats: ['es'], fileName: 'entry' },
      rollupOptions: { external: [/^vue(?:\/|$)/, /^@vue\//, /\.css$/] },
    },
  })
  const outputs = (Array.isArray(result) ? result : [result]) as Rollup.RollupOutput[]
  return outputs
    .flatMap(output => output.output)
    .filter((file): file is Rollup.OutputChunk => file.type === 'chunk')
    .map(chunk => chunk.code)
    .join('\n')
}

/** 一份内置文案里够长、不会和组件自己的代码撞上的英文字符串。 */
function distinctiveStrings(tree: object): string[] {
  return Object.values(tree).flatMap((value) => {
    if (typeof value === 'string')
      return value.length >= 12 ? [value] : []
    if (value != null && typeof value === 'object')
      return distinctiveStrings(value)
    return []
  })
}

const foreignEnglish = [
  ...distinctiveStrings(chatMessages.en),
  ...distinctiveStrings(commentsMessages.en),
  ...distinctiveStrings(emojiPickerMessages.en),
  ...distinctiveStrings(powerSearchMessages.en),
  ...distinctiveStrings(tableMessages.en),
]

describe('component bundles carry only their own built-in strings', () => {
  it('has enough foreign strings to look for', () => {
    expect(foreignEnglish.length).toBeGreaterThan(20)
  })

  it.each(['Button', 'Spinner', 'Token', 'Switch', 'TextInput'])('%s leaves other components\' English out', async (component) => {
    const code = await bundle(component)
    expect(foreignEnglish.filter(text => code.includes(text))).toEqual([])
  }, 60_000)

  it('keeps the component\'s own strings in both built-in languages', async () => {
    const code = await bundle('Spinner')
    expect(code).toMatch(/["']Loading["']/)
    expect(code).toContain('加载中')
  }, 60_000)
})
