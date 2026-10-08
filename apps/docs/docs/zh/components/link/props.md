---
layout: component-docs
title: 链接
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Link Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接目标地址。未提供时渲染为 <code>&lt;button&gt;</code>。</td>
      </tr>
      <tr>
        <td><code>isExternalLink</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否在新标签页打开并显示外部链接标识。</td>
      </tr>
      <tr>
        <td><code>hasUnderline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否始终显示下划线。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>LinkColor</code></td>
        <td><code>'accent'</code></td>
        <td>链接颜色，可选 primary、secondary、accent、inherit。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用。</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML target 属性。</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML rel 属性。外部链接会自动追加 noopener noreferrer。</td>
      </tr>
      <tr>
        <td><code>download</code></td>
        <td><code>string | boolean</code></td>
        <td>-</td>
        <td>是否触发下载。</td>
      </tr>
    </tbody>
  </table>
</div>



## 事件

<div class="component-api-table" role="region" aria-label="Link 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>点击时触发。禁用时不会触发。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Link 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>链接文字内容。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<a>` 或 `<button>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
