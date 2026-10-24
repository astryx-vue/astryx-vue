import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { holdScrollbarGutter } from './scrollbarGutter.js'

// happy-dom 没有布局，用桩把视口宽度、窗口宽度和 body 宽度喂进去。
let viewportWidth = 1000
let windowWidth = 1015
let bodyWidth = 1000

beforeEach(() => {
  viewportWidth = 1000
  windowWidth = 1015
  bodyWidth = 1000
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockImplementation(() => viewportWidth)
  vi.spyOn(window, 'innerWidth', 'get').mockImplementation(() => windowWidth)
  vi.spyOn(document.body, 'getBoundingClientRect').mockImplementation(() => ({ width: bodyWidth }) as DOMRect)
})

afterEach(() => {
  vi.restoreAllMocks()
  document.documentElement.style.scrollbarGutter = ''
  document.body.style.paddingRight = ''
})

describe('holdScrollbarGutter', () => {
  it('有占地方的滚动条要被藏掉时，留住它的位置', () => {
    const hold = holdScrollbarGutter(document.body)
    expect(document.documentElement.style.scrollbarGutter).toBe('stable')
    hold.settle()
    hold.release()
    expect(document.documentElement.style.scrollbarGutter).toBe('')
  })

  it('悬浮滚动条不占地方，什么都不碰', () => {
    windowWidth = 1000
    const hold = holdScrollbarGutter(document.body)
    hold.settle()
    expect(document.documentElement.style.scrollbarGutter).toBe('')
    expect(document.body.style.paddingRight).toBe('')
  })

  it('留住之后元素没变宽就不补 padding；变宽了才补，叠在页面自己的 padding 上', () => {
    const still = holdScrollbarGutter(document.body)
    still.settle()
    expect(document.body.style.paddingRight).toBe('')
    still.release()

    document.body.style.paddingRight = '8px'
    const grew = holdScrollbarGutter(document.body)
    bodyWidth = 1015
    grew.settle()
    grew.settle()
    expect(document.body.style.paddingRight).toBe('23px')
    grew.release()
    expect(document.body.style.paddingRight).toBe('8px')
  })

  it('还原页面自己设的 scrollbar-gutter，而不是清空', () => {
    document.documentElement.style.scrollbarGutter = 'stable both-edges'
    const hold = holdScrollbarGutter(document.body)
    hold.release()
    expect(document.documentElement.style.scrollbarGutter).toBe('stable both-edges')
  })

  it('没有布局可量时什么都不做', () => {
    viewportWidth = 0
    const hold = holdScrollbarGutter(document.body)
    hold.settle()
    expect(document.documentElement.style.scrollbarGutter).toBe('')
  })
})
