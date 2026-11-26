---
layout: component-docs
title: Internationalization Provider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { internationalizationProviderCalendar, internationalizationProviderOverrides, internationalizationProviderRtlDirection, internationalizationProviderShippedLocale } from '../../../../components/demos/internationalization-provider'
</script>

## Usage

Wraps your app to set the active locale and (optionally) merge additional translation catalogs + per-locale overrides. Astryx components inside the subtree resolve their strings against this context. If no provider is present, components fall back to the shipped English defaults.

```ts
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
```

`messages` and `overrides` are both a map from a BCP 47 tag to a catalog keyed by the original `@astryx.*` message keys, so the same JSON shape works for a whole language and for a handful of keys. The two layers merge per key: a catalog replaces the shipped text for that locale, and the sparse overrides are laid on top. Overrides are keyed by locale, so a runtime locale swap picks up the right set.

`dir` only sets the direction Astryx reads. It does not touch the DOM `dir` attribute: set that on `<html>` or a wrapping element yourself, and pass the same value to both. `getLocaleDirection(locale)` derives the value from a tag.

Nesting works: the inner provider wins for its subtree.

Set `calendar` to show `Calendar` in another calendar system and to write `Timestamp`, `PowerSearch`, and Lab's `Schedule` dates in it. A locale never selects the calendar: `fa-IR` shows Gregorian dates until you set `calendar="persian"`, and a `-u-ca-` keyword in `locale`, as in `th-TH-u-ca-buddhist`, keeps Gregorian dates too. Values stay Gregorian dates. See [Calendars](/en/guide/calendars).

To reword a string for one component, use that component's own prop, such as `placeholder` or `label`. `overrides` changes a string everywhere in the app; reach for it only when every instance should read the same way.

## Anatomy

| Element | Description |
| --- | --- |
| Provider boundary | Required. A nonvisual context boundary that supplies locale, message catalogs, overrides, and direction to descendant Astryx components. It renders no DOM element. |

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Give `messages` a whole-language catalog for your target locale, in the same shape as the Astryx locale JSON. |
| <Badge variant="success">Do</Badge> | Use a same-shape local catalog only when Astryx has not shipped that locale yet or you are testing in-progress translations. |
| <Badge variant="success">Do</Badge> | Use real BCP 47 tags such as `fr-FR`, `pt-BR`, or `ar-SA`; regional locales fall back to their base language before English. |
| <Badge variant="success">Do</Badge> | Set the `dir` attribute on `<html>` (or a wrapping element) yourself; the provider does not set it. Use `getLocaleDirection(locale)` to derive the value for both the provider and the DOM. |
| <Badge variant="error">Don't</Badge> | Cast custom catalog maps to `any`; `ProviderMessagesByLocale` and `ProviderOverrides` type a local catalog. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="internationalizationProviderShippedLocale" title="Load a shipped Astryx locale catalog" description="Pass a vendored locale JSON from @astryx-vue/core/locales to messages, keyed by its tag." locale="en" />

<DemoExample :demo="internationalizationProviderRtlDirection" title="Mirror the layout for right-to-left text" description="Pass the same direction to the provider and to the element that holds the content, so Astryx components and the page mirror together." locale="en" />

<DemoExample :demo="internationalizationProviderCalendar" title="Show dates in another calendar" description="Switch the provider's calendar and Calendar changes its months and year labels, while the value stays a Gregorian date." locale="en" />

<DemoExample :demo="internationalizationProviderOverrides" title="Change one Astryx string across your app" description="Override a small number of Astryx strings everywhere in the app without providing a full locale catalog." locale="en" />
