import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseCssDurationMs, readToastMotionDurationMs } from './motionDuration.js'

const HERE = dirname(fileURLToPath(import.meta.url))

describe('toast 运动时长', () => {
  it('解析毫秒和秒', () => {
    expect(parseCssDurationMs('165ms')).toBe(165)
    expect(parseCssDurationMs('0.2s')).toBe(200)
    expect(parseCssDurationMs('fast')).toBeNull()
  })

  it('元素上没有变量时用 165 毫秒', () => {
    const element = document.createElement('div')
    expect(readToastMotionDurationMs(element)).toBe(165)
    expect(readToastMotionDurationMs(null)).toBe(165)
  })

  it('读到元素上写的时长', () => {
    const element = document.createElement('div')
    element.style.setProperty('--astryx-toast-motion-duration', '180ms')
    expect(readToastMotionDurationMs(element)).toBe(180)
  })

  it('样式和视口等待用的是同一个变量，源码里不再写死 250', () => {
    const css = readFileSync(resolve(HERE, '../../styles/toast.css'), 'utf8')
    const vue = readFileSync(resolve(HERE, './ToastViewport.vue'), 'utf8')
    expect(css).toContain('--astryx-toast-motion-duration:')
    expect(css).toContain('transition-duration: var(--astryx-toast-motion-duration, 165ms)')
    expect(vue).not.toContain('250')
    expect(vue).toContain('readToastMotionDurationMs')
  })
})
