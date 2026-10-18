---
layout: component-docs
title: Top Nav Mega Menu Featured Card
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="TopNavMegaMenuFeaturedCard props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>Card title. Required.</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>Description text below the title.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Makes the whole card a link. With <code>linkLabel</code>, the link moves to the CTA at the bottom instead.</td></tr>
<tr><td><code>image</code></td><td><code>string</code></td><td>—</td><td>Optional image URL displayed above the body.</td></tr>
<tr><td><code>imageAlt</code></td><td><code>string</code></td><td>—</td><td>Alt text for the image. When omitted, the image is explicitly decorative (<code>alt=""</code>, <code>role="presentation"</code>, <code>aria-hidden</code>), usually correct since the card already has a visible title. Provide it only when the image conveys information beyond the title and description.</td></tr>
<tr><td><code>linkLabel</code></td><td><code>string</code></td><td>—</td><td>CTA link text, rendered at the bottom of the card. Needs <code>linkHref</code> or <code>href</code>.</td></tr>
<tr><td><code>linkHref</code></td><td><code>string</code></td><td>—</td><td>CTA link URL. Falls back to <code>href</code>.</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>Link root used by the card and the CTA. Only used when there is a URL.</td></tr>
</tbody></table>
</div>

## Slots

- `default`: custom content rendered below the standard body.
