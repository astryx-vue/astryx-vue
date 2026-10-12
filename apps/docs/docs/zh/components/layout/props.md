---
layout: component-docs
title: 布局
outline: false
footer: false
---

## Layout Props

<div class="component-api-table" role="region" aria-label="Layout Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>contentWidth</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>对齐内容的最大宽度。分隔线仍然拉满。数字按像素处理。百分比、<code>fit-content</code>、<code>max-content</code>、<code>min-content</code> 或裸 <code>var()</code> 走约束宽度。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>'fill' | 'auto'</code></td>
        <td><code>'fill'</code></td>
        <td><code>fill</code> 撑满容器，正文在中间滚动。<code>auto</code> 随内容长高。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>只作用于这一层的外缘间距，不传给嵌套的布局。<code>0</code> 表示通栏。</td>
      </tr>
      <tr>
        <td><code>defaultHasDividers</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>页眉或页脚没有写 <code>hasDivider</code> 时用的默认值。</td>
      </tr>
    </tbody>
  </table>
</div>

`SpacingStep` 的取值是 `0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`。

## Layout 插槽

<div class="component-api-table" role="region" aria-label="Layout Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>正文区域。这里放 <code>LayoutContent</code>。</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>顶部区域。这里放 <code>LayoutHeader</code>。</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td>行起始边。这里放 <code>LayoutPanel</code>。面板可拖拽时，旁边再放 <code>ResizeHandle</code>。</td>
      </tr>
      <tr>
        <td><code>end</code></td>
        <td>行结束边。</td>
      </tr>
      <tr>
        <td><code>footer</code></td>
        <td>底部区域。这里放 <code>LayoutFooter</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## Layout Header Props

<div class="component-api-table" role="region" aria-label="Layout Header Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td>继承</td>
        <td>底边分隔线。不传时用 <code>defaultHasDividers</code>；布局也没写时是 false。</td>
      </tr>
      <tr>
        <td><code>height</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>高度。数字按像素处理，字符串原样使用。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内边距。<code>0</code> 表示内容自己管边距。</td>
      </tr>
      <tr>
        <td><code>paddingBlockEnd</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>只改底边内边距，方便标签下划线和分隔线贴住。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>设置了 <code>role</code> 时的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA 地标角色。</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutHeader` 有一个默认插槽，放页眉内容。

## Layout Footer Props

`LayoutFooter` 接受 <code>hasDivider</code>、<code>height</code>、<code>padding</code>、<code>label</code>、<code>role</code>，含义和页眉相同。<code>hasDivider</code> 画在顶边。它有一个默认插槽。

## Layout Content Props

<div class="component-api-table" role="region" aria-label="Layout Content Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内边距。<code>0</code> 让 <code>Section</code> 这类子元素铺到边缘。</td>
      </tr>
      <tr>
        <td><code>isScrollable</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>内容超出时在这块里滚动。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>设置了 <code>role</code> 时的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA 地标角色。</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutContent` 有一个默认插槽。

## Layout Panel Props

<div class="component-api-table" role="region" aria-label="Layout Panel Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hasDivider</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>朝向正文的那条边。旁边的 <code>ResizeHandle</code> 已经画线时不要再开。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>SpacingStep</code></td>
        <td>-</td>
        <td>内边距。不传、而且没有分隔线时，朝向正文的外边距会收起来。</td>
      </tr>
      <tr>
        <td><code>isScrollable</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>内容超出时在面板里滚动。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>-</td>
        <td>宽度。数字按像素处理。传了 <code>resizable</code> 时以钩子的尺寸为准。</td>
      </tr>
      <tr>
        <td><code>resizable</code></td>
        <td><code>{ _size: number }</code></td>
        <td>-</td>
        <td><code>useResizable</code> 返回的 <code>props</code>。面板宽度跟着 <code>_size</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>设置了 <code>role</code> 时的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>role</code></td>
        <td><code>AriaRole</code></td>
        <td>-</td>
        <td>ARIA 地标角色，例如 <code>navigation</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

`LayoutPanel` 有一个默认插槽。

## 原生属性

每一块的根元素都是 `<div>`。HTML 属性、<code>aria-*</code>、<code>data-*</code>、<code>class</code> 和 <code>style</code> 都落到各自的根上。<code>class</code> 会合并。`Layout` 写 <code>data-height</code>。
