import { describe, expect, it } from 'vitest'
import {
  effectiveInputPresentation,
  effectivePickerPresentation,
  presentationFromNativePicker,
  resolveInputPresentation,
  resolvePickerPresentation,
} from './inputPresentation.js'

describe('inputPresentation', () => {
  it('显式 presentation 压过旧的 nativePicker', () => {
    expect(effectivePickerPresentation('popover', 'always')).toBe('popover')
    expect(effectiveInputPresentation('text-input', 'always', 'time')).toBe('text-input')
  })

  it('日期组件的 never 是自适应底栏，时间组件的 never 是文本框', () => {
    expect(presentationFromNativePicker('never', 'date')).toBe('adaptive-bottom-sheet')
    expect(presentationFromNativePicker('never', 'time')).toBe('text-input')
    expect(presentationFromNativePicker('touch', 'time')).toBe('adaptive-native')
    expect(presentationFromNativePicker('always', 'date')).toBe('native')
    expect(effectivePickerPresentation(undefined, 'never')).toBe('adaptive-bottom-sheet')
    expect(effectiveInputPresentation(undefined, undefined, 'date')).toBe('adaptive-native')
  })

  it('按指针类型决定真正画出来的表面', () => {
    expect(resolvePickerPresentation('adaptive-native', true)).toBe('native')
    expect(resolvePickerPresentation('adaptive-native', false)).toBe('desktop')
    expect(resolvePickerPresentation('adaptive-bottom-sheet', true)).toBe('sheet')
    expect(resolvePickerPresentation('adaptive-bottom-sheet', false)).toBe('desktop')
    expect(resolvePickerPresentation('popover', true)).toBe('desktop')
    expect(resolvePickerPresentation('bottom-sheet', false)).toBe('sheet')
    expect(resolvePickerPresentation('native', false)).toBe('native')
    expect(resolveInputPresentation('text-input', true)).toBe('text-input')
  })
})
