---
layout: component-docs
title: 头像组
outline: false
footer: false
---

## AvatarGroup Props

<div class="component-api-table" role="region" aria-label="AvatarGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>size</code></td>
        <td><code>AvatarSize</code></td>
        <td><code>'md'</code></td>
        <td>组内所有头像统一使用的尺寸，单个头像自身的 <code>size</code> 在组内不再生效。</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>AvatarShape</code></td>
        <td><code>'circle'</code></td>
        <td>组内所有头像统一使用的形状，单个头像自身的 <code>shape</code> 在组内不再生效。</td>
      </tr>
    </tbody>
  </table>
</div>

## AvatarGroupOverflow Props

<div class="component-api-table" role="region" aria-label="AvatarGroupOverflow Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>count</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>隐藏头像的数量，显示为 +N。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="AvatarGroup 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>组内的 <code>Avatar</code> 元素，末尾可放一个 <code>AvatarGroupOverflow</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<div role="group">`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
