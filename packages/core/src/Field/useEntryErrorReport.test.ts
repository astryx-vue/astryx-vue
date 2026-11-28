import type { FieldStatusInput } from './types.js'
import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import { isSameEntryError, useEntryErrorReport } from './useEntryErrorReport.js'

interface Entry { kind: string, text: string, value?: number }

function setup(precedence: 'always' | 'withCallback', hasListener: boolean) {
  const entry = shallowRef<Entry | null>(null)
  const message = shallowRef<string | null>(null)
  const status = shallowRef<FieldStatusInput | undefined>(undefined)
  const report = vi.fn()
  const scope = effectScope()
  const result = scope.run(() => useEntryErrorReport<Entry>({
    entryError: () => entry.value,
    rejectionMessage: () => message.value,
    status: () => status.value,
    callerErrorPrecedence: precedence,
    hasListener: () => hasListener,
    report,
  }))!
  return { entry, message, status, report, scope, ...result }
}

describe('isSameEntryError', () => {
  it('compares every field', () => {
    expect(isSameEntryError({ kind: 'a', text: 'x' }, { kind: 'a', text: 'x' })).toBe(true)
    expect(isSameEntryError({ kind: 'a', text: 'x' }, { kind: 'a', text: 'y' })).toBe(false)
    expect(isSameEntryError({ kind: 'a', text: 'x', value: 1 }, { kind: 'a', text: 'x' })).toBe(false)
    expect(isSameEntryError(null, null)).toBe(true)
    expect(isSameEntryError(null, { kind: 'a', text: 'x' })).toBe(false)
  })
})

describe('useEntryErrorReport', () => {
  it('shows the field message as an error status while a rejection stands, else the caller status', () => {
    const state = setup('always', false)
    expect(state.fieldStatus.value).toBeUndefined()
    state.message.value = 'Invalid'
    expect(state.fieldStatus.value).toEqual({ type: 'error', message: 'Invalid' })
    state.status.value = { type: 'warning', message: 'Careful' }
    expect(state.fieldStatus.value).toEqual({ type: 'error', message: 'Invalid' })
    state.status.value = { type: 'error', message: 'Caller words it' }
    expect(state.fieldStatus.value).toEqual({ type: 'error', message: 'Caller words it' })
    state.message.value = null
    expect(state.fieldStatus.value).toEqual({ type: 'error', message: 'Caller words it' })
  })

  it('lets the caller error win only with a listener when the precedence is withCallback', () => {
    const quiet = setup('withCallback', false)
    quiet.message.value = 'Invalid'
    quiet.status.value = { type: 'error', message: 'Caller words it' }
    expect(quiet.fieldStatus.value).toEqual({ type: 'error', message: 'Invalid' })
    const listening = setup('withCallback', true)
    listening.message.value = 'Invalid'
    listening.status.value = { type: 'error', message: 'Caller words it' }
    expect(listening.fieldStatus.value).toEqual({ type: 'error', message: 'Caller words it' })
  })

  it('repeats an unchanged caller error message once through the alert while a rejection starts', async () => {
    const state = setup('always', true)
    state.status.value = { type: 'error', message: 'Caller words it' }
    await nextTick()
    state.message.value = 'Invalid'
    await nextTick()
    expect(state.alertMessage.value).toBe('Caller words it')
    state.status.value = { type: 'error', message: 'Reworded' }
    await nextTick()
    expect(state.alertMessage.value).toBe('')
  })

  it('reports each changed rejection once, and null when the scope ends during one', async () => {
    const state = setup('always', true)
    state.entry.value = { kind: 'a', text: 'x' }
    await nextTick()
    state.entry.value = { kind: 'a', text: 'x' }
    await nextTick()
    state.entry.value = { kind: 'b', text: 'x' }
    await nextTick()
    expect(state.report.mock.calls).toEqual([[{ kind: 'a', text: 'x' }], [{ kind: 'b', text: 'x' }]])
    state.scope.stop()
    expect(state.report).toHaveBeenLastCalledWith(null)
  })

  it('reports nothing at the end of a scope with no rejection', () => {
    const state = setup('always', true)
    state.scope.stop()
    expect(state.report).not.toHaveBeenCalled()
  })
})
