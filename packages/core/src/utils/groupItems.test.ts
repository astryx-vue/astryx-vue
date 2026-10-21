import { describe, expect, it } from 'vitest'
import { getItemGroup, groupItems } from './groupItems.js'

describe('groupItems', () => {
  it('没有任何组名时合成一组', () => {
    const items = [{ id: '1' }, { id: '2', auxiliaryData: {} }]
    expect(groupItems(items)).toEqual([{ heading: null, items }])
  })

  it('按第一次出现的顺序分组，没组名的放在最后', () => {
    const home = { id: '1', auxiliaryData: { group: 'Navigation' } }
    const settings = { id: '2', auxiliaryData: { group: 'Navigation' } }
    const dark = { id: '3', auxiliaryData: { group: 'Preferences' } }
    const help = { id: '4' }
    expect(groupItems([home, settings, dark, help])).toEqual([
      { heading: 'Navigation', items: [home, settings] },
      { heading: 'Preferences', items: [dark] },
      { heading: null, items: [help] },
    ])
  })

  it('ungroupedFirst 时把没组名的放在最前', () => {
    const named = { id: '1', auxiliaryData: { group: 'A' } }
    const loose = { id: '2' }
    expect(groupItems([named, loose], { ungroupedFirst: true })).toEqual([
      { heading: null, items: [loose] },
      { heading: 'A', items: [named] },
    ])
  })

  it('空字符串仍是组名，数字和对象以外的附加数据不算组', () => {
    expect(getItemGroup({ auxiliaryData: { group: '' } })).toBe('')
    expect(getItemGroup({ auxiliaryData: { group: 1 } })).toBeUndefined()
    expect(getItemGroup({ auxiliaryData: 'Navigation' })).toBeUndefined()
    expect(getItemGroup({})).toBeUndefined()
  })
})
