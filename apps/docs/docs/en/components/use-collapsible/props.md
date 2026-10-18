---
layout: component-docs
title: useCollapsible
outline: false
footer: false
---

## Parameters

<div class="component-api-table" role="region" aria-label="useCollapsible parameters" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isCollapsible</code></td>
        <td><code>boolean | CollapsibleConfig | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Whether collapsible behavior is active. <code>true</code> manages its own state and starts open. <code>false</code> disables folding. Pass a config object for controlled mode or a custom default.</td>
      </tr>
      <tr>
        <td><code>value</code></td>
        <td><code>string | undefined | MaybeRefOrGetter</code></td>
        <td>—</td>
        <td>Unique identifier within a <code>CollapsibleGroup</code>. When present and inside a group, the group owns the state.</td>
      </tr>
      <tr>
        <td><code>group</code></td>
        <td><code>CollapsibleGroupContextValue | null</code></td>
        <td>injected</td>
        <td>Group context. Read from the nearest <code>CollapsibleGroup</code> when omitted; pass it explicitly only when you are outside that tree.</td>
      </tr>
    </tbody>
  </table>
</div>

### CollapsibleConfig

<div class="component-api-table" role="region" aria-label="CollapsibleConfig" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean | undefined&gt;</code></td>
        <td>—</td>
        <td>Controlled open state, usually the <code>v-model:isOpen</code> model ref. Leave it out for uncontrolled state.</td>
      </tr>
      <tr>
        <td><code>defaultIsOpen</code></td>
        <td><code>boolean | MaybeRefOrGetter</code></td>
        <td><code>true</code></td>
        <td>Open state while <code>isOpen</code> stays unbound.</td>
      </tr>
      <tr>
        <td><code>onOpenChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>—</td>
        <td>Called with the requested state. In controlled usage it is the request; in uncontrolled usage it is the report.</td>
      </tr>
    </tbody>
  </table>
</div>

## Returns

<div class="component-api-table" role="region" aria-label="useCollapsible returns" tabindex="0">
  <table>
    <thead>
      <tr><th>Field</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isEnabled</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether collapsible behavior is active. False when <code>isCollapsible</code> is <code>false</code>.</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>ComputedRef&lt;boolean&gt;</code></td>
        <td>Whether the content is currently expanded.</td>
      </tr>
      <tr>
        <td><code>toggle</code></td>
        <td><code>() =&gt; void</code></td>
        <td>Toggle open/closed state. Dispatches to the group, the controlled ref, or internal state.</td>
      </tr>
    </tbody>
  </table>
</div>
