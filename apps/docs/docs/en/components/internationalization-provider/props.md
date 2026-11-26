---
layout: component-docs
title: Internationalization Provider
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="InternationalizationProvider props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>locale</code></td><td><code>string</code></td><td>—</td><td>BCP 47 language tag for the active locale (e.g. <code>"en"</code>, <code>"pt"</code>, <code>"pt-BR"</code>, <code>"zh-Hans"</code>). Regional tags fall back to their base language, then to the shipped <code>"en"</code> catalog. Required.</td></tr>
<tr><td><code>messages</code></td><td><code>ProviderMessagesByLocale</code></td><td>—</td><td>Map of BCP 47 tag to a catalog keyed by the original <code>@astryx.*</code> message keys. A catalog replaces the shipped text for that locale. The built-in <code>"en"</code> and <code>"zh-CN"</code> catalogs are always available and do not need to be listed.</td></tr>
<tr><td><code>overrides</code></td><td><code>ProviderOverrides</code></td><td>—</td><td>Sparse per-locale key overrides applied on top of the <code>messages</code> catalog, or on top of the built-in text when there is none. Overrides are locale-keyed so a runtime locale swap picks up the correct set.</td></tr>
<tr><td><code>calendar</code></td><td><code>CalendarSystem</code></td><td><code>'gregory'</code></td><td>Calendar system of the subtree, such as <code>'persian'</code>, <code>'hebrew'</code>, or <code>'buddhist'</code>. <code>Calendar</code> shows its months, and <code>Timestamp</code>, <code>PowerSearch</code>, and Lab's <code>Schedule</code> write their dates in it. A locale never selects it, not even with a <code>-u-ca-</code> keyword. A component's own <code>calendar</code> wins. Values stay Gregorian dates. An unknown identifier (such as <code>'islamic'</code>) or a calendar the runtime cannot show falls back to Gregorian and warns once in development.</td></tr>
<tr><td><code>dir</code></td><td><code>'ltr' | 'rtl'</code></td><td>derived from <code>locale</code></td><td>Explicit text direction for the context. When omitted, direction is derived from the locale. It sets the direction Astryx reads, but it does NOT set the DOM <code>dir</code> attribute; set that yourself on <code>&lt;html&gt;</code> or a wrapping element and keep the two in sync.</td></tr>
</tbody></table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="InternationalizationProvider slots" tabindex="0">
<table><thead><tr><th>Slot</th><th>Description</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>The subtree that reads this locale, catalog set, and direction.</td></tr>
</tbody></table>
</div>

## Exports

<div class="component-api-table" role="region" aria-label="InternationalizationProvider exports" tabindex="0">
<table><thead><tr><th>Export</th><th>Type</th><th>Description</th></tr></thead><tbody>
<tr><td><code>getLocaleDirection</code></td><td><code>(locale: string) =&gt; 'ltr' | 'rtl'</code></td><td>Direction for a language tag. Uses <code>Intl.Locale#getTextInfo</code> when the runtime has it, otherwise a right-to-left language list. An unparseable tag reads as <code>'ltr'</code>.</td></tr>
<tr><td><code>useLocaleDirection</code></td><td><code>() =&gt; ComputedRef&lt;'ltr' | 'rtl'&gt;</code></td><td>The direction of the nearest provider, or one derived from the nearest locale.</td></tr>
<tr><td><code>ProviderMessagesByLocale</code></td><td><code>Record&lt;string, AstryxUpstreamCatalog&gt;</code></td><td>Type of <code>messages</code>. The catalog value is a <code>Record&lt;string, string | { defaultMessage: string }&gt;</code> keyed by <code>@astryx.*</code>.</td></tr>
<tr><td><code>ProviderOverrides</code></td><td><code>ProviderMessagesByLocale</code></td><td>Type of <code>overrides</code>.</td></tr>
</tbody></table>
</div>

## Native attributes

The component renders no element of its own, so <code>class</code> and <code>style</code> are not forwarded.
