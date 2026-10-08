---
layout: component-docs
title: Avatar Group
outline: false
footer: false
---

## AvatarGroup Props

<div class="component-api-table" role="region" aria-label="AvatarGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>size</code></td>
        <td><code>AvatarSize</code></td>
        <td><code>'md'</code></td>
        <td>Uniform size for all avatars in the group.</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>AvatarShape</code></td>
        <td><code>'circle'</code></td>
        <td>Uniform shape for all avatars in the group.</td>
      </tr>
    </tbody>
  </table>
</div>

## AvatarGroupOverflow Props

<div class="component-api-table" role="region" aria-label="AvatarGroupOverflow Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>Number of hidden avatars, displayed as +N.</td>
      </tr>
    </tbody>
  </table>
</div>

## Slots

<div class="component-api-table" role="region" aria-label="AvatarGroup Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td><code>Avatar</code> elements, optionally ending with an <code>AvatarGroupOverflow</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root element is a `<div role="group">`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
