import { describe, expect, it } from 'vitest'
import { dateTimeFormatFor } from './dateTimeFormatCache'
import { plainDateFormat } from './plainDate'

describe('dateTimeFormatFor', () => {
  it('shares one formatter per locale and options, whatever the key order', () => {
    const a = dateTimeFormatFor('en', { month: 'long', year: 'numeric' })
    const b = dateTimeFormatFor('en', { year: 'numeric', month: 'long' })
    expect(b).toBe(a)
    expect(dateTimeFormatFor('en', { month: 'short' })).not.toBe(a)
    expect(dateTimeFormatFor('fr', { month: 'long', year: 'numeric' })).not.toBe(a)
  })
})

describe('plainDateFormat with the cache', () => {
  const pd = { year: 2026, month: 2, day: 1 }

  it('formats date fields the same in every locale', () => {
    expect(plainDateFormat(pd, { month: 'long', year: 'numeric' }, 'en')).toBe('February 2026')
    expect(plainDateFormat(pd, { month: 'long', year: 'numeric' }, 'fr')).toBe('février 2026')
  })

  it('keeps the day when the host zone is far from UTC', () => {
    const original = process.env.TZ
    try {
      for (const zone of ['Pacific/Kiritimati', 'Pacific/Pago_Pago']) {
        process.env.TZ = zone
        expect(plainDateFormat(pd, { month: 'long', day: 'numeric' }, 'en')).toBe('February 1')
      }
    }
    finally {
      if (original === undefined) {
        delete process.env.TZ
      }
      else {
        process.env.TZ = original
      }
    }
  })
})
