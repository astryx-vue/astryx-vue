import { setTimeout } from 'node:timers/promises'

/** npm registry 传播常见等待上限（约 10 分钟）。 */
export const DEFAULT_NPM_VIEW_MAX_WAIT_MS = 10 * 60 * 1000

export const DEFAULT_NPM_VIEW_RETRY = {
  maxWaitMs: DEFAULT_NPM_VIEW_MAX_WAIT_MS,
  initialDelayMs: 5_000,
  maxDelayMs: 120_000,
  backoffFactor: 2,
}

/**
 * 判断 `npm view` 失败是否可能由 registry 传播延迟导致（可重试）。
 */
export function isRetryableNpmViewError(error) {
  const stderr = String(error?.stderr ?? '')
  const message = String(error?.message ?? '')
  const code = String(error?.code ?? '')
  const combined = `${code}\n${stderr}\n${message}`.toLowerCase()

  if (code === 'E404' || combined.includes('e404'))
    return true
  if (combined.includes('404 not found') || combined.includes('not found'))
    return true
  if (combined.includes('no match found'))
    return true

  return false
}

/**
 * 在总等待时间内对 fn 做指数退避重试；不可重试的错误立即抛出。
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxWaitMs = DEFAULT_NPM_VIEW_RETRY.maxWaitMs,
    initialDelayMs = DEFAULT_NPM_VIEW_RETRY.initialDelayMs,
    maxDelayMs = DEFAULT_NPM_VIEW_RETRY.maxDelayMs,
    backoffFactor = DEFAULT_NPM_VIEW_RETRY.backoffFactor,
    isRetryable = isRetryableNpmViewError,
    onRetry,
  } = options

  const started = Date.now()
  let attempt = 0
  let delayMs = initialDelayMs
  let lastError

  while (true) {
    attempt += 1
    try {
      return await fn(attempt)
    }
    catch (error) {
      lastError = error
      if (!isRetryable(error))
        throw error

      const elapsed = Date.now() - started
      const remaining = maxWaitMs - elapsed
      if (remaining <= 0)
        break

      const waitMs = Math.min(delayMs, remaining)
      onRetry?.({ attempt, error, waitMs, elapsed, remaining })
      await setTimeout(waitMs)
      delayMs = Math.min(delayMs * backoffFactor, maxDelayMs)
    }
  }

  throw lastError
}
