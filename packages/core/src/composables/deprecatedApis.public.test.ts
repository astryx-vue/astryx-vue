import type { ChatComposerTrigger } from '../Chat/types.js'
import type { TokenizerProps } from '../Tokenizer/types.js'
import type { BaseTypeaheadProps, TypeaheadProps } from '../Typeahead/types.js'
import type { UseGridFocusOptions } from './useGridFocus.js'
import type { UseListFocusOptions } from './useListFocus.js'
import type { UseResizableSingleOptions } from './useResizable.js'
import { describe, expect, it } from 'vitest'
import * as root from '../index.js'
import * as composables from './index.js'

/** 0.6 标为废弃、已经删掉的公共 API。这里守住它们不会回来。 */
describe('已删除的 0.6 废弃 API', () => {
  it('isImeKeyEvent 不从包入口和 composables 入口导出', () => {
    expect(composables).not.toHaveProperty('isImeKeyEvent')
    expect(root).not.toHaveProperty('isImeKeyEvent')
  })

  it('useGridFocus / useListFocus 不接受 isRtl，方向从容器读', () => {
    const grid: UseGridFocusOptions = {
      columns: 3,
      // @ts-expect-error isRtl 已删除，方向从容器的 direction 读
      isRtl: true,
    }
    const list: UseListFocusOptions = {
      // @ts-expect-error isRtl 已删除，方向从容器的 direction 读
      isRtl: false,
    }
    expect(grid.columns).toBe(3)
    expect(list).toBeDefined()
  })

  it('useResizable 不接受 minSizePx / maxSizePx，统一用 minSize / maxSize', () => {
    const min: UseResizableSingleOptions = {
      // @ts-expect-error minSizePx 已删除，改用 minSize
      minSizePx: 100,
    }
    const max: UseResizableSingleOptions = {
      // @ts-expect-error maxSizePx 已删除，改用 maxSize
      maxSizePx: 400,
    }
    expect([min, max]).toHaveLength(2)
  })

  it('typeahead、Tokenizer、ChatComposerInput 的触发项不接受 emptySearchResultsText', () => {
    const base = {
      // @ts-expect-error emptySearchResultsText 已删除，改用 emptySearchText
      emptySearchResultsText: 'none',
    } satisfies Partial<BaseTypeaheadProps>
    const typeahead = {
      // @ts-expect-error emptySearchResultsText 已删除，改用 emptySearchText
      emptySearchResultsText: 'none',
    } satisfies Partial<TypeaheadProps>
    const tokenizer = {
      // @ts-expect-error emptySearchResultsText 已删除，改用 emptySearchText
      emptySearchResultsText: 'none',
    } satisfies Partial<TokenizerProps>
    const trigger = {
      // @ts-expect-error emptySearchResultsText 已删除，改用 emptySearchText
      emptySearchResultsText: 'none',
    } satisfies Partial<ChatComposerTrigger>
    expect([base, typeahead, tokenizer, trigger]).toHaveLength(4)
  })
})
