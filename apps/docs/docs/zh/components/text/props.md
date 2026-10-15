---
layout: component-docs
title: 文本
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Text Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>type</code></td>
        <td><code>TextType</code></td>
        <td><code>'body'</code></td>
        <td>语义文本类型，可选 body、large、label、supporting、code、display-1、display-2、display-3。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>TextSize</code></td>
        <td>-</td>
        <td>显式字号覆盖，可选 sm、md、lg、xl。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>TextColor</code></td>
        <td><code>'primary'</code></td>
        <td>文字颜色，可选 primary、secondary、accent、disabled、placeholder、inherit。</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>TextWeight</code></td>
        <td>-</td>
        <td>字重覆盖，可选 regular、normal、medium、semibold、bold。normal 与 regular 相同。</td>
      </tr>
      <tr>
        <td><code>textWrap</code></td>
        <td><code>TextWrap</code></td>
        <td>-</td>
        <td>换行方式，可选 wrap、nowrap、balance、pretty。</td>
      </tr>
      <tr>
        <td><code>wordBreak</code></td>
        <td><code>TextWordBreak</code></td>
        <td>-</td>
        <td>长词如何断开，可选 normal、break-word、break-all。</td>
      </tr>
      <tr>
        <td><code>hasStrikethrough</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>给文字加删除线。</td>
      </tr>
      <tr>
        <td><code>hasTabularNumbers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>使用等宽数字，方便多行数字对齐。</td>
      </tr>
      <tr>
        <td><code>display</code></td>
        <td><code>TextDisplay</code></td>
        <td><code>'inline'</code></td>
        <td>显示类型：<code>inline</code> 或 <code>block</code>。</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>TextAs</code></td>
        <td><code>'span'</code></td>
        <td>实际渲染的 HTML 元素，可选 span、p、div、label。</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>'start' | 'center' | 'end'</code></td>
        <td><code>'start'</code></td>
        <td>对齐方式。<code>start</code> 和 <code>end</code> 跟随书写方向。</td>
      </tr>
      <tr>
        <td><code>hasTruncateTooltip</code></td>
        <td><code>boolean | 'above' | 'below' | 'start' | 'end'</code></td>
        <td><code>true</code></td>
        <td>截断之后要不要把全文放进提示。<code>false</code> 关掉。没被截断时不会弹出。</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>最大显示行数，超出部分截断并显示省略号，0 表示不截断。大于 0 时会改成块级，省略号才有宽度可用。</td>
      </tr>
    </tbody>
  </table>
</div>



## 原生属性

根元素由 `as` 决定，默认为 `<span>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
