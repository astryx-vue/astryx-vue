---
layout: component-docs
title: 居中容器
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Center Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>axis</code></td>
        <td><code>'both' | 'horizontal' | 'vertical'</code></td>
        <td><code>'both'</code></td>
        <td>居中哪条轴。both 同时居中主轴与交叉轴，horizontal 只居中行内方向，vertical 只居中块方向。单轴取值落在 flex 的对齐属性上，纵向书写时跟随的是 flex 主轴与交叉轴。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>容器宽度。数字按像素处理，字符串按原样作为 CSS 值使用。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>容器高度。数字按像素处理。垂直居中需要有可分配的高度，所以默认的 both 和 vertical 通常会用到它。</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>容器最大宽度。数字按像素处理。</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>容器最小高度。数字按像素处理。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>四边的内边距，使用 Astryx 间距刻度。</td>
      </tr>
      <tr>
        <td><code>paddingInline</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>行内轴内边距，覆盖该轴上的 padding。</td>
      </tr>
      <tr>
        <td><code>paddingInlineStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>行内起始边内边距，只覆盖这一条边，优先级高于 paddingInline 与 padding。物理边取决于书写模式和方向。</td>
      </tr>
      <tr>
        <td><code>paddingInlineEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>行内结束边内边距，只覆盖这一条边，优先级高于 paddingInline 与 padding。物理边取决于书写模式和方向。</td>
      </tr>
      <tr>
        <td><code>paddingBlock</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>块轴内边距，覆盖该轴上的 padding。</td>
      </tr>
      <tr>
        <td><code>paddingBlockStart</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>块起始边内边距，只覆盖这一条边，优先级高于 paddingBlock 与 padding。物理边取决于书写模式。</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>—</td>
        <td>块结束边内边距，只覆盖这一条边，优先级高于 paddingBlock 与 padding。物理边取决于书写模式。</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>使用 inline-flex 渲染，容器因此留在文字行内，适合居中图标或角标这类小元素。</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` 支持以下值：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## 插槽

<div class="component-api-table" role="region" aria-label="Center Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>要居中的内容。内容被当作一个整体居中，Center 不会在多个子元素之间分配间距，也不会改变它们各自的语义、颜色或阅读顺序。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。

`Center` 会在根元素上写自己的 `data-axis`，用来反映当前生效的居中轴；消费者传入的同名 `data-axis` 不会覆盖它。
