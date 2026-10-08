---
layout: component-docs
title: 列表
outline: false
footer: false
---

## Props

### List

<div class="component-api-table" role="region" aria-label="List Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>density</code></td>
        <td><code>ListDensity</code></td>
        <td><code>'balanced'</code></td>
        <td>行的间距密度：compact（4px 上下内边距）、balanced（8px）、spacious（12px，左右内边距也放宽一档）。单行可以用自己的 <code>density</code> 覆盖它。</td>
      </tr>
      <tr>
        <td><code>hasDividers</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否在相邻两行之间绘制分隔线。最后一行不会绘制，带分隔线时行不再有圆角。</td>
      </tr>
      <tr>
        <td><code>edgeCompensation</code></td>
        <td><code>'inline'</code></td>
        <td>-</td>
        <td>按每个逻辑边缘可用的容器内边距，抵消行自身的左右内边距，让行内文字与同级标题对齐。它读取容器发布的 <code>--container-padding-inline-start</code> 与 <code>--container-padding-inline-end</code>，没有发布时按 0 处理，因此不会把行拉出容器之外。省略时行的位置不变。</td>
      </tr>
      <tr>
        <td><code>listStyle</code></td>
        <td><code>ListMarkerStyle</code></td>
        <td><code>'none'</code></td>
        <td>每行前面的标记：none、disc（实心圆点）、circle（空心圆点）、decimal（序号）。<code>decimal</code> 会改用 <code>&lt;ol&gt;</code> 渲染。</td>
      </tr>
      <tr>
        <td><code>start</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>有序列表的第一个编号，仅在 <code>listStyle="decimal"</code> 时生效。同时写入 <code>&lt;ol&gt;</code> 的 <code>start</code> 属性和 CSS 计数器。</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>列表上方的纯文本标题，会以 <code>aria-labelledby</code> 与列表关联。需要富文本时改用 <code>header</code> 插槽。</td>
      </tr>
    </tbody>
  </table>
</div>

### ListItem

<div class="component-api-table" role="region" aria-label="ListItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标识这一行的主要文字。字符串和数字会自动单行截断；需要富文本时改用 <code>label</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要文字，同样会自动单行截断；需要多行或富文本时改用 <code>description</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>ItemDensity</code></td>
        <td>-</td>
        <td>覆盖所在 <code>List</code> 给定的密度。留空时继承列表的密度；不在列表中时按 balanced 处理。</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>-</td>
        <td>点击处理函数。给出后行内会渲染一个占满内容区的按钮，并启用悬停与按下状态。模板里写 <code>@click</code> 即可。</td>
      </tr>
      <tr>
        <td><code>interactiveRef</code></td>
        <td><code>MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;</code></td>
        <td>-</td>
        <td>指向行内已经承载键盘操作与动作的控件（例如 <code>startContent</code> 中的复选框）。行会变成放大的点击区域，把表层点击转发给该控件，并且不再渲染自己的按钮，因此不会多出一个 Tab 停留点。与 <code>onClick</code>、<code>href</code> 互斥，设置后二者会被忽略。</td>
      </tr>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接地址。给出后行内会渲染一个链接元素。</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>'_blank' | '_self'</code></td>
        <td>-</td>
        <td>链接打开方式，仅在给出 <code>href</code> 时生效。<code>_blank</code> 会自动补上 <code>noopener</code> 和 <code>noreferrer</code>。</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接关系标记，会与自动补充的标记合并去重。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用状态。行会变成惰性（不响应指针事件），内容调暗，并写入 <code>aria-disabled="true"</code>。行带有自己的 <code>role</code> 时不设置为惰性，由父级负责。</td>
      </tr>
      <tr>
        <td><code>isSelected</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>选中状态。角色允许时写入 <code>aria-selected="true"</code>，否则写入 <code>aria-current="true"</code>；使用方自己传入的 <code>aria-current</code> 优先。</td>
      </tr>
    </tbody>
  </table>
</div>

### Item

<div class="component-api-table" role="region" aria-label="Item Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>as</code></td>
        <td><code>string | Component</code></td>
        <td><code>'div'</code></td>
        <td>根元素。行带有 <code>role</code> 时才可以传入组件，这样键盘操作仍由父级负责，行不会多出一个 Tab 停留点。</td>
      </tr>
      <tr>
        <td><code>align</code></td>
        <td><code>'center' | 'start'</code></td>
        <td><code>'center'</code></td>
        <td>起始与结束内容插槽的垂直对齐方式。<code>start</code> 用于两端内容高于一行文字的场景。</td>
      </tr>
      <tr>
        <td><code>labelLines</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>标签截断前的最大行数。字符串标签留空时按单行截断，插槽内容不截断。</td>
      </tr>
      <tr>
        <td><code>descriptionLines</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>描述截断前的最大行数。字符串描述留空时按单行截断，插槽内容在 stacked 布局下不截断。</td>
      </tr>
      <tr>
        <td><code>layout</code></td>
        <td><code>'stacked' | 'inline'</code></td>
        <td><code>'stacked'</code></td>
        <td>标签与描述的排布。<code>inline</code> 让两者共用一行，描述优先被省略，因此行高固定，适合放进触发器这类固定高度的容器。</td>
      </tr>
      <tr>
        <td><code>isHighlighted</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>高亮状态，也就是键盘焦点和悬停时使用的外观。菜单类组件用它表示当前定位到的行。</td>
      </tr>
    </tbody>
  </table>
</div>

`Item` 同时接受 `ListItem` 的全部属性，以及 `label`、`description`、`density`、`onClick`、`interactiveRef`、`href`、`target`、`rel`、`isDisabled`、`isSelected`。

## 插槽

### List

<div class="component-api-table" role="region" aria-label="List Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>列表的条目，通常是 <code>ListItem</code>。</td>
      </tr>
      <tr>
        <td><code>header</code></td>
        <td>列表上方的标题内容，会以 <code>aria-labelledby</code> 与列表关联。</td>
      </tr>
    </tbody>
  </table>
</div>

### ListItem / Item

<div class="component-api-table" role="region" aria-label="ListItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>startContent</code></td>
        <td>标签之前的起始内容：图标、头像或复选框。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td>富文本形式的标签，会替代 <code>label</code> 属性，并且不套用自动截断。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>富文本形式的描述，会替代 <code>description</code> 属性。</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td>标签之后的结束内容：徽章、时间戳或箭头。</td>
      </tr>
      <tr>
        <td><code>marker</code></td>
        <td>行首的标记，作为行的直接子元素渲染。仅 <code>Item</code> 直接提供，<code>ListItem</code> 会根据列表的 <code>listStyle</code> 自行填充。</td>
      </tr>
    </tbody>
  </table>
</div>

## 暴露的方法

<div class="component-api-table" role="region" aria-label="List Exposed" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>element</code></td>
        <td><code>ComputedRef&lt;HTMLUListElement | HTMLOListElement | null&gt;</code></td>
        <td>列表元素本身；带有头部时组件外层还有一个包裹元素，它仍是这个列表元素。</td>
      </tr>
    </tbody>
  </table>
</div>

`ListItem` 和 `Item` 另外暴露 <code>element</code>（根元素）、<code>focus()</code> 与 <code>blur()</code>，聚焦时会落在行内真正可聚焦的控件上。

## 原生属性

### List

根元素是 `<ul>`，`listStyle="decimal"` 时是 `<ol>`；给出 `header` 时外层会多一个包裹元素。

以下内容传入列表元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

组件自己写入 `role="list"`、`data-density`、`data-dividers`、`data-list-style` 与 `data-edge-compensation`。未渲染 `header` 时，使用方传入的 `aria-labelledby` 会保留；渲染了 `header` 时由组件的标题接管。

### ListItem / Item

根元素默认是 `<div>`，`ListItem` 是 `<li>`。

以下内容传入根元素：

- HTML 属性（`role`、`id` 等）。
- `aria-*` 属性，使用方传入的 `aria-current` 优先于选中状态推导出的值。
- `data-*` 属性。
- `class`。
- `style`。

组件自己写入 `data-density`、`data-align`、`data-interactive`、`data-selected`、`data-disabled`、`data-highlighted`、`data-inert`、`aria-disabled` 与推导出的 `aria-selected` / `aria-current`，这些属性不会被传入的同名属性覆盖。
