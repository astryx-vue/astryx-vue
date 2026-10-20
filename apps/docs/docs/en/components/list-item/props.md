---
layout: component-docs
title: List Item
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="ListItem props" tabindex="0">
<table><thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string | number</code></td><td>—</td><td>Primary text of the row. A string or a number truncates to one line; use the <code>label</code> slot for rich content.</td></tr>
<tr><td><code>description</code></td><td><code>string | number</code></td><td>—</td><td>Secondary text below the label, also truncated to one line. Use the <code>description</code> slot for several lines or rich content.</td></tr>
<tr><td><code>density</code></td><td><code>ItemDensity</code> (<code>'compact' | 'balanced' | 'spacious'</code>)</td><td>inherited from the list</td><td>Overrides the density of the surrounding <code>List</code>. Outside a list the default is <code>'balanced'</code>.</td></tr>
<tr><td><code>onClick</code></td><td><code>(event: MouseEvent) =&gt; void</code></td><td>—</td><td>Click handler. It renders a button that fills the row's content area and turns on the hover and pressed states. Write <code>@click</code> in a template.</td></tr>
<tr><td><code>interactiveRef</code></td><td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td><td>—</td><td>A ref to a control inside the row that already carries its keyboard access and action, such as a checkbox in <code>startContent</code>. The row becomes an enlarged click target that forwards surface clicks to that control and renders no button of its own, so it adds no second tab stop. Mutually exclusive with <code>onClick</code> and <code>href</code>, which are ignored while it is set.</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>Link URL. A link element is rendered inside the row.</td></tr>
<tr><td><code>target</code></td><td><code>'_blank' | '_self'</code></td><td>—</td><td>Where the link opens, only used with <code>href</code>. <code>_blank</code> adds <code>noopener</code> and <code>noreferrer</code> automatically.</td></tr>
<tr><td><code>rel</code></td><td><code>string</code></td><td>—</td><td>Link relationship tokens, merged with the ones added automatically.</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Disabled state. The row becomes inert, its content dims, and <code>aria-disabled="true"</code> is written.</td></tr>
<tr><td><code>isSelected</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Selected state. Written as <code>aria-selected="true"</code> when the row's role permits it, and as <code>aria-current="true"</code> otherwise. An <code>aria-current</code> you pass yourself wins.</td></tr>
<tr><td><code>swipeActions</code></td><td><code>ItemSwipeActions</code></td><td>—</td><td>Verbs a sideways touch drag uncovers, per side, each <code>{ label, icon?, onActivate, isDisabled?, variant?, hasRemoval? }</code>. A mouse never starts the drag. Give every verb a second home inside the row, or it is unreachable by keyboard and by mouse.</td></tr>
<tr><td><code>swipeBehavior</code></td><td><code>'reveal' | 'commit'</code></td><td><code>'reveal'</code></td><td><code>reveal</code> rests the row open and fires the outermost verb on a long drag; <code>commit</code> slides the row out and fires on release, with nothing left open.</td></tr>
</tbody></table>
</div>

## Slots

- `startContent`: content before the label area, such as an icon or an avatar.
- `label`: rich content replacing the `label` prop.
- `description`: rich content replacing the `description` prop.
- `endContent`: content after the label area, such as a badge, a count, or a timestamp.

## Exposed

`element` (the root element), `focus()`, and `blur()`. Focusing lands on the control inside the row that can actually take focus.
