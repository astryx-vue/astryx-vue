import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { InfoTip as CoreInfoTip } from '@astryx-vue/core/InfoTip'
import { describe, expect, it } from 'vitest'
import { InfoTip } from './index.js'

describe('lab InfoTip', () => {
  it('is the Core component', () => {
    expect(InfoTip).toBe(CoreInfoTip)
  })

  it('marks each of its exports deprecated', () => {
    // 只是静态元数据：编辑器和类型检查会显示它，运行时不会有警告。
    const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'index.ts'), 'utf8')
    for (const name of ['InfoTip', 'InfoTipProps', 'InfoTipSize']) {
      const comment = new RegExp(String.raw`/\*\*((?:(?!\*/)[\s\S])*)\*/\nexport (?:const|type) ${name}\b`).exec(source)
      expect(comment?.[1], name).toContain('@deprecated')
    }
  })
})
