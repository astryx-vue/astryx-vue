---
layout: component-docs
title: Toggle Button
outline: false
footer: false
---

## ToggleButton Props

<div class="component-api-table" role="region" aria-label="ToggleButton Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>required</td>
        <td>Accessible name of the button. It names the control when the default slot supplies visible content, doubles as <code>aria-label</code> in icon-only mode, and is the visible text when nothing else is provided.</td>
      </tr>
      <tr>
        <td><code>isPressed</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether the button is pressed, bound with <code>v-model:is-pressed</code>. Leave it unbound and the button owns the pressed state, starting unpressed. Inside a ToggleButtonGroup the group owns it and this prop is ignored.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>Button size. It falls back to the size of the enclosing group, then to <code>md</code>.</td>
      </tr>
      <tr>
        <td><code>elevation</code></td>
        <td><code>'none' | 'low' | 'med' | 'high'</code></td>
        <td><code>'none'</code></td>
        <td>Resting shadow depth for floating (FAB-style) toggles, matching Button. A grouped button keeps its own elevation.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables interaction. A disabled group disables every member, and an enabled group never re-enables a member that disabled itself. With a tooltip the button switches to <code>aria-disabled</code> so focus stays available to read the reason.</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Shows the loading state: the content gives way to a spinner and <code>aria-busy</code> is set.</td>
      </tr>
      <tr>
        <td><code>isIconOnly</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Renders a square, icon-only button that uses label as its accessible name; no label text and no width reservation are rendered.</td>
      </tr>
      <tr>
        <td><code>pressedChangeAction</code></td>
        <td><code>(isPressed: boolean) =&gt; void | Promise&lt;void&gt;</code></td>
        <td>—</td>
        <td>Action for an API- or navigation-backed toggle. It runs after <code>pressedChange</code> unless that handler prevents the click default. While it is pending the button previews the next state with a spinner and stays clickable, so another click reverses the unsettled toggle. Ignored for a group member with a value.</td>
      </tr>
      <tr>
        <td><code>tooltip</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Text shown on hover and keyboard focus, usually to name an icon-only toggle.</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Value identifier inside a ToggleButtonGroup; the group uses it to decide the pressed state. It is not a form value.</td>
      </tr>
    </tbody>
  </table>
</div>

## ToggleButtonGroup Props

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>required</td>
        <td>Accessible name of the group, rendered as <code>aria-label</code> on the <code>role="group"</code> container.</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'single' | 'multiple'</code></td>
        <td><code>'single'</code></td>
        <td>Selection mode. <code>single</code> keeps one member pressed and clears on a second click; <code>multiple</code> lets members switch on their own.</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string | null | string[]</code></td>
        <td><code>null</code></td>
        <td>The current selection, bound with <code>v-model:value</code>. A string or <code>null</code> in single mode, an array of strings in multiple mode (an empty array when none is pressed).</td>
      </tr>
      <tr>
        <td><code>orientation</code></td>
        <td><code>'horizontal' | 'vertical'</code></td>
        <td><code>'horizontal'</code></td>
        <td>Layout direction of the members. A vertical group stretches each member to the full width.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>Size the members inherit; a member with its own <code>size</code> wins.</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Disables every member. A member that disables itself stays disabled as well.</td>
      </tr>
    </tbody>
  </table>
</div>

## Events

<div class="component-api-table" role="region" aria-label="ToggleButton Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Payload</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>pressedChange</code></td>
        <td><code>(isPressed: boolean, event: MouseEvent)</code></td>
        <td>The state the click asks for, with the originating click event. Call <code>event.preventDefault()</code> to own the toggle: the component then neither changes the state nor runs <code>pressedChangeAction</code>.</td>
      </tr>
      <tr>
        <td><code>update:isPressed</code></td>
        <td><code>(isPressed: boolean)</code></td>
        <td>Backs <code>v-model:is-pressed</code>. It is not emitted when the handler prevents the click default.</td>
      </tr>
      <tr>
        <td><code>click</code></td>
        <td><code>(event: MouseEvent)</code></td>
        <td>The originating click, forwarded after the toggle has been requested. It is not emitted while the button is disabled.</td>
      </tr>
      <tr>
        <td><code>change</code></td>
        <td><code>(value: string | null | string[])</code></td>
        <td>The group selection: a string or <code>null</code> in single mode, an array in multiple mode.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="ToggleButton Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Visible content. It replaces label as the visible text while label stays the accessible name; with nothing in it, label is rendered.</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td>Decorative icon before the label, or the only content of an icon-only button. Put an icon class in a sized element, such as <code>&lt;span class="i-carbon-filter" style="width: 16px; height: 16px" /&gt;</code>, so it matches the button's icon box.</td>
      </tr>
      <tr>
        <td><code>pressedIcon</code></td>
        <td>Icon shown while pressed, typically a filled version of <code>icon</code>. Falls back to <code>icon</code> when empty. The artwork owns its own color, so pass an element that already carries it, such as <code>&lt;span class="i-carbon-stop-filled" style="color: var(--astryx-icon-error-foreground)" /&gt;</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

ToggleButtonGroup takes its members through the default slot:

<div class="component-api-table" role="region" aria-label="ToggleButtonGroup Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>The ToggleButton members. Each one needs its own <code>value</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Keyboard

| Key | Behavior |
| --- | --- |
| `Tab` | Moves through every available toggle; a group does not collapse its members into a single tab stop. |
| `Enter` / `Space` | Toggles the focused button, exactly like a click. |

The group does not take over the arrow keys: each member is its own tab stop, so `Tab` walks them one by one and the arrow keys do not move focus between members — unlike `ButtonGroup`. Disabled members are skipped, while a disabled member that carries a tooltip stays focusable so its reason can be read.

## Template ref

`ToggleButton` exposes:

- `element`: `HTMLButtonElement | HTMLAnchorElement | HTMLElement | null`.
- `focus(options?: FocusOptions)`: focuses the button.
- `blur()`: removes focus from the button.

## Native attributes

The root element is `<button type="button">`.

It receives:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
- Native event listeners.

The component sets `aria-pressed` from the pressed state, and uses `data-pressed`, `data-variant="ghost"`, and `data-size` for theming; leave those to the component. In icon-only mode `aria-label` comes from `label`.
