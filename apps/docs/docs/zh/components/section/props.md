---
layout: component-docs
title: 区块
outline: false
footer: false
---

## Section Props

<div class="component-api-table" role="region" aria-label="Section Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>variant</code></td>
        <td><code>'section' | 'transparent' | 'muted'</code></td>
        <td><code>'section'</code></td>
        <td>背景。<code>section</code> 用表面色，<code>muted</code> 用弱化底，<code>transparent</code> 不铺底。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td><code>4</code></td>
        <td>四边内边距。<code>0</code> 表示内容贴边。</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>行向内边距，覆盖这一轴上的 <code>padding</code>。</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>行起始边内边距，只覆盖这一边。物理方向随书写方向翻转。</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>行结束边内边距，只覆盖这一边。</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>块向内边距，覆盖这一轴上的 <code>padding</code>。</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>块起始边内边距，只覆盖这一边。</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>块结束边内边距，只覆盖这一边。</td>
      </tr>
      <tr>
        <td><code>dividers</code></td>
        <td><code>Array&lt;'top' | 'bottom' | 'start' | 'end'&gt;</code></td>
        <td>-</td>
        <td>哪些边画 1px 分隔线。<code>start</code> 和 <code>end</code> 随书写方向翻转。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>宽度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>高度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>最大宽度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>最小高度。数字按像素处理，字符串原样使用。</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` 的取值是 `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`。

## 插槽

<div class="component-api-table" role="region" aria-label="Section Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>区块里的内容。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

`Section` 的根元素是 `<div>`。HTML 属性、<code>aria-*</code>、<code>data-*</code>、<code>class</code> 和 <code>style</code> 都落到这个元素上。<code>class</code> 会合并。内层元素写 <code>data-variant</code>，并为每一条请求的边写 <code>data-divider-*</code>。
