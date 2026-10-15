---
layout: component-docs
title: Avatar
outline: false
footer: false
---

## Avatar Props

<div class="component-api-table" role="region" aria-label="Avatar Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>The avatar image URL.</td>
      </tr>
      <tr>
        <td><code>fallbackSrc</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Backup image URL used when the primary image fails to load.</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>User name. Used for initials fallback and accessible labeling.</td>
      </tr>
      <tr>
        <td><code>alt</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Accessible label. Takes precedence over <code>name</code>.</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>AvatarSize</code></td>
        <td><code>'md'</code></td>
        <td>Avatar size. Named size or numeric pixel value. See the table below for named sizes.</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>AvatarShape</code></td>
        <td><code>'circle'</code></td>
        <td>Avatar shape: <code>circle</code>, <code>rounded</code>, or <code>square</code>.</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Makes the avatar a link.</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>LinkRoot</code></td>
        <td>-</td>
        <td>Link root used when <code>href</code> is set. It receives <code>href</code> and <code>to</code>. Without an address the avatar stays a button or a <code>span</code>.</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Browsing context of the link. Applies only when <code>href</code> is set.</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>Link relationship. <code>noopener noreferrer</code> is added when <code>target</code> is <code>_blank</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

### Named sizes

| Name | Pixel value |
| --- | --- |
| `xsm` | 20px |
| `sm` | 24px |
| `md` | 36px |
| `lg` | 48px |
| `xl` | 128px |

### Numeric sizes

The `AvatarSize` type lists common pixel values for type hints and autocompletion:

`16 | 20 | 24 | 32 | 36 | 40 | 48 | 60 | 64 | 72 | 96 | 128 | 144 | 180`

The component does not restrict you to these values. Passing any number will still render the avatar at that pixel size.

## Avatar Slots

<div class="component-api-table" role="region" aria-label="Avatar Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>Custom content that replaces the default person icon. Only used when there is no image and no name.</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>Status indicator placed at the corner of the avatar, typically an <code>AvatarStatusDot</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Avatar Events

<div class="component-api-table" role="region" aria-label="Avatar Events" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>error</code></td>
        <td>Emitted when the primary image fails to load.</td>
      </tr>
    </tbody>
  </table>
</div>

## AvatarStatusDot Props

<div class="component-api-table" role="region" aria-label="AvatarStatusDot Props" tabindex="0">
  <table>
    <thead>
      <tr><th>Name</th><th>Type</th><th>Default</th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>AvatarStatusDotVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>Status dot color variant: <code>neutral</code>, <code>info</code>, <code>success</code>, <code>warning</code>, or <code>error</code>.</td>
      </tr>
    </tbody>
  </table>
</div>

## Native attributes

The root is a `<span>` by default. With `href` it is an `<a>` or the component passed to `as`. A click listener without an address makes it a `<button>`.

The following are passed to the root element:

- HTML attributes.
- `aria-*` attributes.
- `data-*` attributes.
- `class`.
- `style`.
