import { describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_NPM_VIEW_MAX_WAIT_MS,
  isRetryableNpmViewError,
  retryWithBackoff,
} from '../scripts/npm-view-retry.mjs'

describe('isRetryableNpmViewError', () => {
  it('treats npm E404 as retryable', () => {
    expect(isRetryableNpmViewError({ code: 'E404', stderr: '404 Not Found' })).toBe(true)
  })

  it('treats version-not-yet-visible messages as retryable', () => {
    expect(isRetryableNpmViewError({ stderr: 'No match found for version' })).toBe(true)
  })

  it('does not retry auth or validation failures', () => {
    expect(isRetryableNpmViewError({ code: 'E401', message: 'Unauthorized' })).toBe(false)
  })
})

describe('retryWithBackoff', () => {
  it('returns immediately on success', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    await expect(retryWithBackoff(fn, { maxWaitMs: 1_000, initialDelayMs: 10 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries retryable errors until success', async () => {
    vi.useFakeTimers()
    const fn = vi
      .fn()
      .mockRejectedValueOnce({ code: 'E404' })
      .mockRejectedValueOnce({ code: 'E404' })
      .mockResolvedValue({ version: '0.2.0' })

    const promise = retryWithBackoff(fn, {
      maxWaitMs: 60_000,
      initialDelayMs: 1_000,
      maxDelayMs: 4_000,
      backoffFactor: 2,
    })

    await vi.runAllTimersAsync()
    await expect(promise).resolves.toEqual({ version: '0.2.0' })
    expect(fn).toHaveBeenCalledTimes(3)
    vi.useRealTimers()
  })

  it('throws after max wait when still failing', async () => {
    const error = { code: 'E404', stderr: '404' }
    const fn = vi.fn().mockRejectedValue(error)

    await expect(retryWithBackoff(fn, {
      maxWaitMs: 80,
      initialDelayMs: 25,
      maxDelayMs: 40,
      backoffFactor: 2,
    })).rejects.toEqual(error)

    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('does not retry non-retryable errors', async () => {
    const error = { code: 'E401' }
    const fn = vi.fn().mockRejectedValue(error)
    await expect(retryWithBackoff(fn, { maxWaitMs: 10_000 })).rejects.toEqual(error)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('defaults to about ten minutes max wait', () => {
    expect(DEFAULT_NPM_VIEW_MAX_WAIT_MS).toBe(600_000)
  })
})
