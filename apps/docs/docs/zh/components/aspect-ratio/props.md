---
layout: component-docs
title: 宽高比
outline: false
footer: false
---

## Aspect Ratio Props

<div class="component-api-table" role="region" aria-label="Aspect Ratio Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>ratio</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>宽除以高。<code>16 / 9</code> 是宽屏。写在 <code>--astryx-aspect-ratio</code> 上，不写成行内 <code>aspect-ratio</code>。</td>
      </tr>
      <tr>
        <td><code>shape</code></td>
        <td><code>'rectangle' | 'ellipse'</code></td>
        <td><code>'rectangle'</code></td>
        <td>容器外形。两种外形都遵循 <code>ratio</code>。<code>ellipse</code> 且 <code>ratio</code> 为 <code>1</code> 时是正圆。</td>
      </tr>
      <tr>
        <td><code>fit</code></td>
        <td><code>'cover' | 'contain' | 'center'</code></td>
        <td>-</td>
        <td>子元素如何填满比例框。<code>cover</code> 裁切，<code>contain</code> 留边，<code>center</code> 保持原始尺寸。不传时子元素自己负责尺寸。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Aspect Ratio Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>放进比例框的内容。传了 <code>fit</code> 时只放一个子元素。</td>
      </tr>
    </tbody>
  </table>
</div>

## CSS 变量

<div class="component-api-table" role="region" aria-label="Aspect Ratio CSS Variables" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-aspect-ratio</code></td>
        <td>宽高比。样式表可以覆盖这个变量，也可以直接覆盖 <code>aspect-ratio</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

`AspectRatio` 的根元素是 `<div>`。HTML 属性、<code>aria-*</code>、<code>data-*</code>、<code>class</code> 和 <code>style</code> 都落到这个元素上。<code>class</code> 会合并。根元素同时写 <code>data-shape</code>。
