---
title: Calendars
---

# Calendars

Date components show the Gregorian calendar by default. An application can switch to the Persian, Hebrew, Hijri, Buddhist, Japanese, Chinese, and other calendars. Whatever calendar is shown, **values stay Gregorian dates**: `v-model`, `min`, `max`, and events carry Gregorian `Date` objects, so your data, server code, and existing handlers keep working.

## Choose a calendar

Set `calendar` on `InternationalizationProvider` and the whole subtree shows it:

```vue
<script setup lang="ts">
import { Calendar } from '@astryx-vue/core/Calendar'
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
import { ref } from 'vue'

// Shows Aban 1405 in the Persian calendar; the value stays 2026-10-30
const date = ref<Date | null>(new Date(2026, 9, 30))
</script>

<template>
  <InternationalizationProvider locale="fa-IR" calendar="persian">
    <Calendar v-model="date" />
  </InternationalizationProvider>
</template>
```

These follow `calendar`:

- `Calendar`: the grid shows the calendar's months, and the header, day numbers, screen reader names, and month paging (including Page Up / Page Down and Shift + Page Up / Page Down) follow it.
- `Timestamp`: date-bearing formats write the date in it; `system_*` and `unix_seconds` stay Gregorian ISO or plain numbers in every calendar.
- `PowerSearch`: absolute date values are written in it.
- Lab's `Schedule`: titles and dates are written in it, while the grid keeps Gregorian months and weeks.

Calendar and language are independent: `locale="en" calendar="hebrew"` shows Hebrew dates in English. A locale never selects the calendar on its own: `fa-IR` without `calendar` shows Gregorian dates in Persian, and a `-u-ca-` keyword in the locale (such as `th-TH-u-ca-buddhist`) keeps Gregorian dates too. Set `calendar` to choose one.

`Calendar` also takes its own `calendar`, which wins over the provider. Use it when one screen shows two calendars side by side.

Outside a component, the `calendar` returned by `useLocale()` is the calendar in effect.

## Supported calendars

| Calendar | Identifiers |
| --- | --- |
| Gregorian | `gregory`, `iso8601` |
| Buddhist | `buddhist` |
| Minguo | `roc` |
| Japanese | `japanese` |
| Persian | `persian` |
| Indian National | `indian` |
| Hebrew | `hebrew` |
| Hijri | `islamic-umalqura`, `islamic-civil`, `islamic-tbla` |
| Chinese | `chinese` |
| Dangi | `dangi` |
| Coptic | `coptic` |
| Ethiopic | `ethiopic`, `ethioaa` |

Any other identifier, such as `islamic`, shows Gregorian dates and warns once in development.

Month lengths, leap months, and years come from the runtime's built-in `Intl`, so no extra library or polyfill is needed. Where a runtime's `Intl` cannot show a calendar, components show Gregorian dates and warn once in development.

## Server rendering

Components resolve the calendar and its months during render, and the server and the browser each read their own `Intl`. When both have the same ICU data (Node.js ships full ICU by default), they render the same markup.

In the lunisolar calendars (Chinese and Dangi), months start on new moons computed from astronomy, and ICU versions occasionally disagree by a day on when one month starts. When a server and a browser disagree on that day, that month renders again in the browser. When identical markup matters, give the server an ICU version close to the browsers you target.

## Week numbers

`Calendar`'s `hasWeekNumbers` shows ISO 8601 week numbers in every calendar.
