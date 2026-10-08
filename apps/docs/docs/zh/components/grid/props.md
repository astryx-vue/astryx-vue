---
layout: component-docs
title: 网格布局
outline: false
footer: false
---

## Grid Props

<div class="component-api-table" role="region" aria-label="Grid Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>number | GridResponsiveColumns</code></td>
        <td>-</td>
        <td>列配置。传数字是固定列数，每一列等宽；传对象 <code>{ minWidth, max?, repeat? }</code> 是响应式列，按可用宽度自动决定列数。缺失、为 0 或为负数时回退为单列。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>容器宽度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>容器高度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>maxWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>容器最大宽度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>minHeight</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>容器最小高度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>gap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>行列间距，使用 Astryx 的间距刻度。</td>
      </tr>
      <tr>
        <td><code>rowGap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>行间距，覆盖同一方向上的 <code>gap</code>。</td>
      </tr>
      <tr>
        <td><code>columnGap</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>列间距，覆盖同一方向上的 <code>gap</code>。在响应式列计算列数上限时，它也优先于 <code>gap</code>。</td>
      </tr>
      <tr>
        <td><code>rowHeight</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>隐式行高，单位为像素（<code>grid-auto-rows</code>）。配合 <code>GridSpan</code> 的 <code>rows</code> 使用。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>GridAlignment</code></td>
        <td><code>'stretch'</code></td>
        <td>项目在行内的垂直对齐（<code>align-items</code>），可选 start、center、end、stretch。</td>
      </tr>
      <tr>
        <td><code>justify</code></td>
        <td><code>GridAlignment</code></td>
        <td><code>'stretch'</code></td>
        <td>项目在同一行内的水平对齐（<code>justify-items</code>），可选 start、center、end、stretch。</td>
      </tr>
    </tbody>
  </table>
</div>

`GridResponsiveColumns` 的形状如下：

```ts
interface GridResponsiveColumns {
  minWidth: number
  max?: number
  repeat?: 'fill' | 'fit'
}
```

`SpacingStep` 支持以下值：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## Grid Span Props

<div class="component-api-table" role="region" aria-label="Grid Span Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>columns</code></td>
        <td><code>number | 'full'</code></td>
        <td>-</td>
        <td>跨越的列数。<code>'full'</code> 渲染为 <code>grid-column: 1 / -1</code>，跨越整行，与列数无关。</td>
      </tr>
      <tr>
        <td><code>rows</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>跨越的行数，渲染为 <code>grid-row: span N</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Grid Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>要排布的项目。直接放子元素，或放 <code>GridSpan</code> 来改变其中一项的跨列、跨行行为。</td>
      </tr>
    </tbody>
  </table>
</div>

`GridSpan` 同样只有一个默认插槽：

<div class="component-api-table" role="region" aria-label="Grid Span Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>跨列项目的具体内容。</td>
      </tr>
    </tbody>
  </table>
</div>

## CSS 变量

`Grid` 在根元素上写入以下变量。它们是内部实现，但可以被主题或应用覆盖：

<div class="component-api-table" role="region" aria-label="Grid CSS Variables" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>--astryx-grid-template-columns</code></td>
        <td>计算出的列模板。写在变量上而不是内联的 <code>grid-template-columns</code>，因此媒体查询里的覆盖仍然有效。</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-auto-rows</code></td>
        <td><code>rowHeight</code> 转换出的隐式行高。</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-gap</code></td>
        <td><code>gap</code> 对应的间距令牌，行、列共用。</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-row-gap</code></td>
        <td><code>rowGap</code> 对应的间距令牌，覆盖 <code>--astryx-grid-gap</code>。</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-column-gap</code></td>
        <td><code>columnGap</code> 对应的间距令牌，覆盖 <code>--astryx-grid-gap</code>。</td>
      </tr>
      <tr>
        <td><code>--astryx-grid-default-gap</code></td>
        <td>主题令牌，在没有传入任何间距属性时作为默认间距。Neutral 主题取 <code>--astryx-spacing-0</code>，也就是不留间距。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

`Grid` 与 `GridSpan` 的根元素都是 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

`class` 会与组件自身的类名合并。`style` 与尺寸属性（`width`、`height`、`maxWidth`、`minHeight`）同时出现时，尺寸属性优先；<code>GridSpan</code> 的 <code>columns</code>、<code>rows</code> 同理。

`Grid` 还额外写入 `data-columns`（仅在 `columns` 为数字时）、`data-gap`、`data-row-gap`、`data-column-gap`、`data-align`、`data-justify`，供主题按属性选择。
