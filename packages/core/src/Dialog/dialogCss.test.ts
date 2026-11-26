import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const styles = resolve(dirname(fileURLToPath(import.meta.url)), '../../styles')

describe('模态遮罩', () => {
  it.each(['dialog.css', 'drawer.css', 'mobile-nav.css'])('%s 的遮罩只有主题的暗色，没有模糊', (file) => {
    expect(readFileSync(resolve(styles, file), 'utf8')).not.toContain('backdrop-filter')
  })
})
