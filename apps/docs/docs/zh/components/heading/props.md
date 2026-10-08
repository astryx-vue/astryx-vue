---
layout: component-docs
title: 标题
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Heading Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>level</code></td>
        <td><code>HeadingLevel</code></td>
        <td>-</td>
        <td>标题层级（1–6），决定渲染 h1–h6 中的哪个语义元素。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>HeadingType</code></td>
        <td>-</td>
        <td>视觉类型变体，可选 display-1、display-2、display-3、body、large、label、supporting。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>HeadingColor</code></td>
        <td><code>'primary'</code></td>
        <td>标题的文字颜色，可选 primary、secondary、accent、inherit。</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>HeadingWeight</code></td>
        <td>-</td>
        <td>字重覆盖，可选 regular、medium、semibold、bold。</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>HeadingDisplay</code></td>
        <td><code>'block'</code></td>
        <td>显示类型：<code>block</code> 或 <code>inline</code>。</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>最大显示行数，超出部分截断并显示省略号，0 表示不截断。</td>
      </tr>
    </tbody>
  </table>
</div>



## 原生属性

根元素为 `<h1>` 至 `<h6>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
