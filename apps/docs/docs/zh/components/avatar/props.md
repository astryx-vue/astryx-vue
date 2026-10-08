---
layout: component-docs
title: 头像
outline: false
footer: false
---

## Avatar Props

<div class="component-api-table" role="region" aria-label="Avatar Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>头像的主图片地址。</td>
      </tr>
      <tr>
        <td><code>fallbackSrc</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>主图片加载失败时改用的备用图片地址。</td>
      </tr>
      <tr>
        <td><code>name</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>用户名，用于生成首字母回退文字和无障碍标签。</td>
      </tr>
      <tr>
        <td><code>alt</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>头像的无障碍标签，设置后优先于 <code>name</code> 作为朗读文本。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>AvatarSize</code></td>
        <td><code>'md'</code></td>
        <td>头像尺寸，支持命名尺寸或像素数值。命名尺寸见下表。</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>AvatarShape</code></td>
        <td><code>'circle'</code></td>
        <td>头像形状，可选 <code>circle</code>、<code>rounded</code>、<code>square</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

### 命名尺寸

| 名称 | 像素值 |
| --- | --- |
| `xsm` | 20px |
| `sm` | 24px |
| `md` | 36px |
| `lg` | 48px |
| `xl` | 128px |

### 像素尺寸

`AvatarSize` 类型列出了常用的像素值，便于获得类型提示和自动补全：

`16 | 20 | 24 | 32 | 36 | 40 | 48 | 60 | 64 | 72 | 96 | 128 | 144 | 180`

组件本身并不限制只能使用这些数值。如果传入列表外的数字，头像仍会按该像素值渲染。

## Avatar 插槽

<div class="component-api-table" role="region" aria-label="Avatar 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>替代默认人物图标的自定义内容。仅在无图片且无姓名时生效。</td>
      </tr>
      <tr>
        <td><code>status</code></td>
        <td>头像角落的状态指示器，通常放置 <code>AvatarStatusDot</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## Avatar 事件

<div class="component-api-table" role="region" aria-label="Avatar 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>error</code></td>
        <td>主图片加载失败时触发。</td>
      </tr>
    </tbody>
  </table>
</div>

## AvatarStatusDot Props

<div class="component-api-table" role="region" aria-label="AvatarStatusDot Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>AvatarStatusDotVariant</code></td>
        <td><code>'neutral'</code></td>
        <td>状态点颜色变体：<code>neutral</code>、<code>info</code>、<code>success</code>、<code>warning</code>、<code>error</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
