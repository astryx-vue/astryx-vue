import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Timestamp from './Timestamp.vue'
import { formatTooltipLines } from './tooltipEntries.js'

const INSTANT = new Date('2026-02-20T02:00:00Z')
// 固定下来的时区取一个不是宿主时区的：UTC 机器上选 UTC 会在没有继承的情况下也通过。
const HOST_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone
const PINNED = HOST_ZONE === 'Asia/Tokyo' ? 'Australia/Sydney' : 'Asia/Tokyo'
const PINNED_SYSTEM_DATE_TIME = PINNED === 'Asia/Tokyo' ? '2026-02-20 11:00:00' : '2026-02-20 13:00:00'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('timestamp timezoneID', () => {
  it('writes absolute text in the named zone, whatever the viewer zone', async () => {
    const wrapper = mount(Timestamp, {
      props: { value: INSTANT.toISOString(), format: 'system_date_time', timezoneID: PINNED, hasTooltip: false },
    })
    await nextTick()
    expect(wrapper.get('time').text()).toBe(PINNED_SYSTEM_DATE_TIME)
  })

  it('keeps the viewer zone for the default card row and falls back for an unknown zone with one warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(Timestamp, {
      props: { value: INSTANT.toISOString(), format: 'system_date_time', timezoneID: 'Not/AZone', hasTooltip: false },
    })
    await nextTick()
    expect(wrapper.get('time').text()).toMatch(/^2026-02-\d\d \d\d:\d\d:\d\d$/)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('timezoneID')
  })
})

describe('tooltip lines under a pinned zone', () => {
  it('lets an entry without a zone follow the pinned zone', () => {
    const [line] = formatTooltipLines(INSTANT, [{ format: 'system_date_time' }], 'en-US', PINNED)
    expect(line?.value).toBe(PINNED_SYSTEM_DATE_TIME)
  })

  it('keeps an explicit local entry in the viewer zone under a default', () => {
    const [local, named] = formatTooltipLines(
      INSTANT,
      [
        { timezoneID: 'local', format: 'system_date_time' },
        { timezoneID: HOST_ZONE, format: 'system_date_time' },
      ],
      'en-US',
      PINNED,
    )
    expect(local?.value).toBe(named?.value)
  })

  it('counts the pinned zone when labelling a viewer-zone row', () => {
    const entries = [{ timezoneID: 'local', format: 'date_time' as const }]
    const [labelled] = formatTooltipLines(INSTANT, entries, 'en-US', PINNED)
    const [alone] = formatTooltipLines(INSTANT, entries, 'en-US')
    expect(labelled?.value).not.toBe(alone?.value)
  })
})
