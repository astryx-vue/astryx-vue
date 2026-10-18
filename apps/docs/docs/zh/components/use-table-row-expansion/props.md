---
layout: component-docs
title: useTableRowExpansion
outline: false
footer: false
---

## 参数

`useTableRowExpansion()` 只有一个配置对象。用 getter 或 `ref` 包一层，面板才能跟着当前的展开集合走：`useTableRowExpansion(() => ({ ... }))`。

<div class="component-api-table" role="region" aria-label="useTableRowExpansion 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>expandedKeys</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>必填。当前展开了的行 key 集合，由你保存。</td>
      </tr>
      <tr>
        <td><code>onToggle</code></td>
        <td><code>(key: string) =&gt; void</code></td>
        <td>—</td>
        <td>必填。一行的展开状态切换时调用，传入行 key。折叠按钮和右键菜单都会触发。</td>
      </tr>
      <tr>
        <td><code>getRowKey</code></td>
        <td><code>(item: T) =&gt; string</code></td>
        <td>—</td>
        <td>必填。从一行的数据算出稳定、唯一的 key。</td>
      </tr>
      <tr>
        <td><code>renderExpanded</code></td>
        <td><code>(item: T) =&gt; VNodeChild</code></td>
        <td>—</td>
        <td>必填。画出展开后那一整行详情面板里的内容，参数是这一行的数据。</td>
      </tr>
      <tr>
        <td><code>getIsItemExpandable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>—</td>
        <td>决定哪些行能展开。不能展开的行不显示折叠按钮、右键菜单里没有这一项，也永远不会画面板。默认所有行都能展开。</td>
      </tr>
      <tr>
        <td><code>panelVariant</code></td>
        <td><code>'muted' | 'transparent'</code></td>
        <td><code>'transparent'</code></td>
        <td>详情面板的底色。<code>'transparent'</code> 什么都不画：面板是这一行的延续，用表格所在的表面，所以 Card 能透出来，斑马纹也照旧。<code>'muted'</code> 会铺一层，表示它是注解而不是又一行数据——只有裸表格、没有卡片、分隔线和斑马纹时才需要它。这层是很低透明度的近黑色，在深色卡片上几乎看不见，所以 <code>'muted'</code> 基本只在浅色主题里有明显效果。</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>点整行就能切换，不只点折叠按钮。这是给指针设备加的方便，按钮仍然是键盘和辅助技术用的那个控件。点在可交互的单元格内容（按钮、链接、表单控件）上，或者正在选中文字时，不会切换；不能展开的行没有反应。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

`useTableRowExpansion()` 返回一个 `TablePlugin&lt;T&gt;`，放进 `Table` 的 `plugins` 里。它填的是插件协议上的三个字段：

<div class="component-api-table" role="region" aria-label="useTableRowExpansion 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>在最前面插入带折叠按钮的 <code>__expansion</code> 列。</td>
      </tr>
      <tr>
        <td><code>rowPatch</code></td>
        <td><code>(row: T, index: number, columnCount: number) =&gt; TableRowPatch | null</code></td>
        <td>给这一行的右键菜单加上展开项、接上可选的整行点击，并在展开时挂上面板。不能展开的行返回 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>cellPatch</code></td>
        <td><code>(input: TableCellPatchInput&lt;T&gt;) =&gt; TableCellPatch | null</code></td>
        <td>给折叠按钮那两个单元格加上 <code>astryx-table__expansion</code> 类名，保住 40px 的宽度。</td>
      </tr>
    </tbody>
  </table>
</div>

### TableRowPatch

<div class="component-api-table" role="region" aria-label="TableRowPatch 字段" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>attrs</code></td>
        <td><code>Record&lt;string, string | undefined&gt;</code></td>
        <td>展开的行带上 <code>data-expanded</code>。</td>
      </tr>
      <tr>
        <td><code>class</code></td>
        <td><code>string</code></td>
        <td>开了 <code>hasRowClickExpansion</code> 时是 <code>astryx-table__clickable</code>。</td>
      </tr>
      <tr>
        <td><code>onClick</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>切换这一行，除非点击落在可交互元素上，或者正在选中文字。</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td><code>TableRowMenuItem[]</code></td>
        <td>只有一项，用来展开或折叠这一行，文案跟着语言走。</td>
      </tr>
      <tr>
        <td><code>panel</code></td>
        <td><code>TablePanelPatch</code></td>
        <td>行下面的详情面板，带 <code>variant</code> 和 <code>render</code>。只有行展开时才存在。</td>
      </tr>
    </tbody>
  </table>
</div>
