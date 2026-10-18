---
layout: component-docs
title: useListFocus
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useListFocus parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseListFocusOptions</code></td>
        <td><code>{}</code></td>
        <td>Configuration object for the list focus behavior. All fields are optional.</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td><code>'[role="menuitem"]'</code></td>
        <td>Selector for the focusable items within the list.</td>
      </tr>
      <tr>
        <td><code>options.boundarySelector</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>Selector identifying a list boundary, for lists that contain nested lists of the same kind (e.g. a menu with submenu flyouts). When set, item collection and key handling are scoped to this level's own container. Typically <code>'[role="menu"]'</code>.</td>
      </tr>
      <tr>
        <td><code>options.wrap</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether arrow navigation wraps around at the ends.</td>
      </tr>
      <tr>
        <td><code>options.onEscape</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>Callback when Escape is pressed (e.g. close the menu). Supplying it also consumes the key (<code>preventDefault</code>); without it Escape passes through to the surrounding layer.</td>
      </tr>
      <tr>
        <td><code>options.orientation</code></td>
        <td><code>'horizontal' | 'vertical' | 'both'</code></td>
        <td><code>'vertical'</code></td>
        <td>Navigation orientation. <code>'horizontal'</code> uses ArrowLeft/ArrowRight, <code>'vertical'</code> uses ArrowUp/ArrowDown, <code>'both'</code> accepts all four arrows. A horizontal list follows the container's writing direction, so RTL swaps the two arrow keys.</td>
      </tr>
      <tr>
        <td><code>options.hasHomeEnd</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>Whether Home/End jump to the first/last enabled item.</td>
      </tr>
      <tr>
        <td><code>options.hasPaging</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Whether PageDown/PageUp page through a scrolling list: PageDown moves to the last enabled item fully visible in the container, and pressed there again one viewport further; PageUp mirrors it. Neither wraps; in a list that does not scroll they act as End/Home.</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>Opt into roving-tabindex ownership: the hook stamps a single tab stop (one item <code>tabindex="0"</code>, the rest <code>-1</code>), repairs it as items mount, unmount, or toggle disabled, and moves it with arrow navigation. When false, the hook only moves focus and never touches <code>tabindex</code>.</td>
      </tr>
      <tr>
        <td><code>options.hasCaretGuard</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>When true, arrow keys are not stolen from a nested text input/textarea whose caret is not at the boundary in the direction of travel (or that has a selection), and are never stolen from a nested contenteditable. Preserves inline text editing within the list.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useListFocus return value" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>listRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>Bind to the list container element.</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>Key down handler to attach to the list container.</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>(event: FocusEvent) =&gt; void</code></td>
        <td>Focus handler for the container. Keeps the roving tab stop in sync when <code>hasRovingTabIndex</code> is enabled; a no-op otherwise, so it is always safe to attach.</td>
      </tr>
      <tr>
        <td><code>focusItem</code></td>
        <td><code>(index: number) =&gt; void</code></td>
        <td>Focus a specific item by index, clamped to the valid range.</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>Focus the first enabled item. Returns true when an item was focused.</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; boolean</code></td>
        <td>Focus the last enabled item. Returns true when an item was focused.</td>
      </tr>
      <tr>
        <td><code>ownsEvent</code></td>
        <td><code>(event: KeyboardEvent) =&gt; boolean</code></td>
        <td>Whether a key event belongs to this list level rather than a nested list sharing the same <code>boundarySelector</code>. Always true when no <code>boundarySelector</code> is set. Use it to guard consumer-added key handling (Enter/Space, typeahead).</td>
      </tr>
      <tr>
        <td><code>getItems</code></td>
        <td><code>() =&gt; HTMLElement[]</code></td>
        <td>This level's focusable items in DOM order, already scoped by <code>boundarySelector</code> and with hidden ones dropped. Build typeahead targets from this instead of re-querying.</td>
      </tr>
    </tbody>
  </table>
</div>
