---
layout: component-docs
title: Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Item props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>Primary text of the row. A string or a number truncates to one line; use the <code>label</code> slot for rich content.</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>Secondary text below the label, also truncated to one line. Use the <code>description</code> slot for several lines or rich content.</td></tr>
<tr><td><code>as</code></td><td><code>ItemElement</code> (tag name or component)</td><td><code>'div'</code></td><td>What the root renders as. Give a component only when the row carries a <code>role</code>, so the parent owns keyboard access and the row adds no second tab stop, and only when no control sits in <code>startContent</code> or <code>endContent</code>.</td></tr>
<tr><td><code>align</code></td><td><code>'center' | 'start'</code></td><td><code>'center'</code></td><td>Vertical alignment of the start and end content slots.</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td><code>'balanced'</code></td><td>Spacing. <code>compact</code> uses 4px block padding, <code>balanced</code> 8px, and <code>spacious</code> 12px of block and inline padding.</td></tr>
<tr><td><code>layout</code></td><td><code>'stacked' | 'inline'</code></td><td><code>'stacked'</code></td><td><code>stacked</code> puts the description on its own line. <code>inline</code> keeps both on one line, with the description ellipsizing first, so the row fits a fixed-height host.</td></tr>
<tr><td><code>labelLines</code></td><td><code>number</code></td><td>—</td><td>Maximum lines before the label truncates with an ellipsis. A string label truncates to one line when this is omitted.</td></tr>
<tr><td><code>descriptionLines</code></td><td><code>number</code></td><td>—</td><td>Maximum lines before the description truncates with an ellipsis. A string description truncates to one line when this is omitted.</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>Click handler. It renders a button that fills the row's content area, so the row gains button semantics and the hover and pressed states. Write <code>@click</code> in a template.</td></tr>
<tr><td><code>interactiveRef</code></td><td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td><td>—</td><td>A ref to a control inside the row that already carries its keyboard access and action, such as a checkbox in <code>startContent</code>. The row becomes an enlarged click target that forwards surface clicks to that control and renders no button of its own. Mutually exclusive with <code>onClick</code> and <code>href</code>, which are ignored while it is set.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Link URL. A link element is rendered inside the row. When the root is already a link component (see <code>as</code>), the address goes on that root instead and no extra element is drawn.</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>Link target, only used with <code>href</code>. <code>_blank</code> adds <code>noopener</code> and <code>noreferrer</code> automatically.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link relationship tokens, merged with the ones added automatically.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state. The row becomes inert and its content dims.</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Selected state. Written as <code>aria-selected="true"</code> when the row's role permits it, and as <code>aria-current="true"</code> otherwise.</td></tr>
<tr><td><code>isHighlighted</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Paints the highlighted state, which is the appearance keyboard focus and hover use.</td></tr>
<tr><td><code>swipeActions</code></td><td><code>ItemSwipeActions</code></td><td>—</td><td>Verbs a sideways touch drag uncovers, per side, outermost last, each <code>{ label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>. A mouse never starts the drag. Only on a row whose role permits interactive descendants, not on an option, a menu item, or the enlarged target of a native radio.</td></tr>
<tr><td><code>swipeBehavior</code></td><td><code>'reveal' | 'commit'</code></td><td><code>'reveal'</code></td><td><code>reveal</code> rests the row open with every entry a real button and fires the outermost on a long drag; <code>commit</code> slides the row out and fires on release, with nothing left resting.</td></tr>
</tbody></table>
</div>

## Slots

- `marker`: content before `startContent`, such as a list bullet or a counter.
- `startContent`: leading visual, such as an avatar, an icon, an image, or a checkbox.
- `label`: rich content replacing the `label` prop.
- `description`: rich content replacing the `description` prop.
- `endContent`: end-aligned content, such as badges, timestamps, or action buttons.

## Exposed

`element` (the root element), `focus()`, and `blur()`. Focusing lands on the control inside the row that can actually take focus.
