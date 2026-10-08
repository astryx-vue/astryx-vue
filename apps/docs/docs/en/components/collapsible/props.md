---
layout: component-docs
title: Collapsible
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Collapsible Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>trigger</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Plain-text label for the trigger. Use the <code>trigger</code> slot instead when the label needs a heading, an icon, or extra controls; the slot replaces this prop.</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>Controlled open state. While bound, the component renders exactly this value and a click only requests an update; leave it unbound to let the component manage its own state.</td>
      </tr>
      <tr>
        <td><code>defaultIsOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether the content starts expanded while <code>isOpen</code> is unbound.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Dims the trigger, marks it <code>aria-disabled</code>, and takes it out of the tab order. Clicks no longer toggle the content, and content that is already open stays open.</td>
      </tr>
      <tr>
        <td><code>chevronPosition</code></td>
        <td><code>CollapsibleChevronPosition</code></td>
        <td><code>'end'</code></td>
        <td>Logical position of the disclosure chevron. <code>end</code> (default) follows the label, pointing down while collapsed and up while expanded; <code>start</code> leads the label, pointing into the content while collapsed (mirrored under RTL) and down while expanded.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="Collapsible Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The content hidden while collapsed and revealed while expanded.</td>
      </tr>
      <tr>
        <td><code>trigger</code></td>
        <td>The trigger label. Accepts headings, icons, and other markup, and replaces the <code>trigger</code> prop.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events and template ref

<div class="component-api-table" role="region" aria-label="Collapsible Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Signature</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Emitted when the trigger asks for a new open state. In uncontrolled usage it reports the change; in controlled usage it is the request to update the bound value.</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>Listened to automatically by <code>v-model:isOpen</code>; you rarely handle it yourself.</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLDivElement | null</code></td>
        <td>The root element, exposed through a template ref.</td>
      </tr>
    </tbody>
  </table>
</div>

## Theming

```css
.my-collapsible {
  --astryx-collapsible-trigger-foreground: #171717;
  --astryx-collapsible-content-foreground: #525252;
}
```

- `--astryx-collapsible-trigger-foreground`: trigger label color.
- `--astryx-collapsible-content-foreground`: content text color.
- `--astryx-collapsible-pressed-overlay`: overlay painted on the trigger while it is held down, and only then.
- `--astryx-collapsible-focus`: keyboard focus outline color.
- `--astryx-spacing-1`, `--astryx-text-large-size`, `--astryx-text-body-size`: the padding and both type sizes reuse the global tokens.

The neutral theme adapts to light and dark mode on its own.

## Native attributes

The root element is a `<div>`.

The following go to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.

The trigger is a `<button type="button">` inside the root element; its `aria-expanded`, `aria-controls`, `aria-disabled`, and `tabindex` are maintained by the component. Disabling never sets the native `disabled` attribute, so assistive technology keeps perceiving the trigger.
