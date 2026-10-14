---
layout: component-docs
title: 表格
outline: false
footer: false
---

## 属性

### Table

<div class="component-api-table" role="region" aria-label="Table 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>T[]</code></td>
        <td>-</td>
        <td>行数据。不传时，用默认插槽自己拼表格。</td>
      </tr>
      <tr>
        <td><code>columns</code></td>
        <td><code>TableColumn&lt;T&gt;[]</code></td>
        <td>-</td>
        <td><code>key</code>、<code>header</code>、<code>width</code>、<code>align</code>、<code>verticalAlign</code>、<code>sortable</code>、<code>filter</code> 和 <code>renderCell</code>。</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>string | (row: T) =&gt; string</code></td>
        <td><code>'id'</code></td>
        <td>行身份。分组行要用函数，才能认出合成出来的表头。</td>
      </tr>
      <tr>
        <td><code>density</code></td>
        <td><code>'compact' | 'balanced' | 'spacious'</code></td>
        <td><code>'balanced'</code></td>
        <td>单元格内边距。紧凑 4×8，适中 8×12，宽松 12×16。</td>
      </tr>
      <tr>
        <td><code>dividers</code></td>
        <td><code>'rows' | 'columns' | 'grid' | 'none'</code></td>
        <td><code>'rows'</code></td>
        <td>表头始终有底边。表体最后一行不再画行线。</td>
      </tr>
      <tr>
        <td><code>isStriped</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>偶数行使用淡底。</td>
      </tr>
      <tr>
        <td><code>hasHover</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>悬停填色，只在指针能悬停时出现。</td>
      </tr>
      <tr>
        <td><code>verticalAlign</code></td>
        <td><code>'top' | 'middle' | 'bottom'</code></td>
        <td><code>'middle'</code></td>
        <td>默认垂直对齐。列上可以单独覆盖。</td>
      </tr>
      <tr>
        <td><code>textOverflow</code></td>
        <td><code>'wrap' | 'truncate'</code></td>
        <td><code>'wrap'</code></td>
        <td>文字换行，或截成一行。</td>
      </tr>
      <tr>
        <td><code>plugins</code></td>
        <td><code>Record&lt;string, TablePlugin&lt;T&gt;&gt;</code></td>
        <td>-</td>
        <td>排序、选择、分页、列设置、拖宽度、过滤、分组、树、展开、固定列、行状态和行号。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>本地化的「表格」</td>
        <td>表格的无障碍名称。</td>
      </tr>
      <tr>
        <td><code>rowIndexStart</code></td>
        <td><code>number</code></td>
        <td><code>1</code></td>
        <td>当前窗口第一行在整表里的位置。和总行数只要设置一个，数据行就会带上行号。</td>
      </tr>
      <tr>
        <td><code>rowCount</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>整表有多少行。只设置起点时，总行数按未知处理。</td>
      </tr>
    </tbody>
  </table>
</div>

### useTableGroupedRows

<div class="component-api-table" role="region" aria-label="useTableGroupedRows 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>data</code></td><td><code>T[]</code></td><td>必需</td><td>已经过滤、排序、分页之后的行。</td></tr>
      <tr><td><code>groupBy</code></td><td><code>(item: T) =&gt; string</code></td><td>必需</td><td>这一行属于哪一组。</td></tr>
      <tr><td><code>collapsedGroups</code></td><td><code>Set&lt;string&gt;</code></td><td>必需</td><td>当前折叠的组。切换时换成新集合。</td></tr>
      <tr><td><code>onToggleGroup</code></td><td><code>(groupKey: string) =&gt; void</code></td><td>必需</td><td>点表头或箭头时调用。</td></tr>
      <tr><td><code>renderGroupHeader</code></td><td><code>(key, count, collapsed) =&gt; VNodeChild</code></td><td>组名和数量</td><td>箭头右边的内容。</td></tr>
      <tr><td><code>getRowKey</code></td><td><code>(item: T) =&gt; string</code></td><td>按位置</td><td>真实行的稳定身份。</td></tr>
      <tr><td><code>groupOrder</code></td><td><code>string[]</code></td><td>首次出现的顺序</td><td>写在前面的组先出现。</td></tr>
    </tbody>
  </table>
</div>

### useTableTreeState

<div class="component-api-table" role="region" aria-label="useTableTreeState 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>data</code></td><td><code>T[]</code></td><td>必需</td><td>带子节点的树。</td></tr>
      <tr><td><code>idKey</code></td><td><code>string | (item) =&gt; string</code></td><td>必需</td><td>节点身份。用来记住展开状态，也用来跳过环。</td></tr>
      <tr><td><code>childrenKey</code></td><td><code>string</code></td><td><code>children</code></td><td>子节点放在哪个字段。</td></tr>
      <tr><td><code>expandedIds</code></td><td><code>Set&lt;string&gt;</code></td><td>-</td><td>受控的展开集合。不传则组件自己记。</td></tr>
      <tr><td><code>defaultExpandedIds</code></td><td><code>Iterable&lt;string&gt;</code></td><td>空</td><td>一开始展开哪些节点。</td></tr>
      <tr><td><code>onExpandedIdsChange</code></td><td><code>(ids) =&gt; void</code></td><td>-</td><td>展开集合变化时调用。</td></tr>
      <tr><td><code>hasExpandAllControl</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在树那一列表头放全部展开按钮。</td></tr>
      <tr><td><code>hasRowClickExpansion</code></td><td><code>boolean</code></td><td><code>false</code></td><td>点有子节点的行也能展开。点到按钮、链接或选中的文字时不动。</td></tr>
      <tr><td><code>indent</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>md</code></td><td>每一层往里缩多少。</td></tr>
      <tr><td><code>treeColumnKey</code></td><td><code>string</code></td><td>第一个普通列</td><td>缩进和箭头画在哪一列。</td></tr>
      <tr><td><code>sortSiblings</code></td><td><code>(siblings: T[]) =&gt; T[]</code></td><td>-</td><td>同一层怎么排序。</td></tr>
    </tbody>
  </table>
</div>

### useTableRowExpansion

<div class="component-api-table" role="region" aria-label="useTableRowExpansion 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>expandedKeys</code></td><td><code>Set&lt;string&gt;</code></td><td>必需</td><td>当前展开的行。由调用方保存。</td></tr>
      <tr><td><code>onToggle</code></td><td><code>(key: string) =&gt; void</code></td><td>必需</td><td>箭头、行点击或右键时调用。</td></tr>
      <tr><td><code>getRowKey</code></td><td><code>(item: T) =&gt; string</code></td><td>必需</td><td>行身份。</td></tr>
      <tr><td><code>renderExpanded</code></td><td><code>(item: T) =&gt; VNodeChild</code></td><td>必需</td><td>详情内容。它从第一列开始，不从箭头下面开始。</td></tr>
      <tr><td><code>getIsItemExpandable</code></td><td><code>(item: T) =&gt; boolean</code></td><td>全部可以</td><td>哪些行可以展开。</td></tr>
      <tr><td><code>panelVariant</code></td><td><code>'muted' | 'transparent'</code></td><td><code>transparent</code></td><td>详情的底。透明时接着表格自己的表面，淡底用来和数据行分开。</td></tr>
      <tr><td><code>hasRowClickExpansion</code></td><td><code>boolean</code></td><td><code>false</code></td><td>点行也能展开。点到控件或选中的文字时不动。</td></tr>
    </tbody>
  </table>
</div>

### useTableStickyColumns

<div class="component-api-table" role="region" aria-label="useTableStickyColumns 属性" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>startKeys</code></td><td><code>string[]</code></td><td>空</td><td>钉住从第一列到这里列出的最后一列。</td></tr>
      <tr><td><code>endKeys</code></td><td><code>string[]</code></td><td>空</td><td>钉住从这里列出的第一列到表格末尾。</td></tr>
    </tbody>
  </table>
</div>

### useTableRowStatus

`getStatus` 返回 `null` 时这一格是空的。语义状态用成功、警告或错误图标。自定义状态给一个颜色；有图标就画图标，没有就画一个圆点。说明会进提示，也会读给辅助技术。

### useTableRowIndex

`data` 是表格正在画的行，分组之后的那一份。`startFrom` 默认从 1 开始。`getRowKey` 用来认出同一行；不传就按对象本身比较。`label` 是这一列表头，默认是一个井号。

`proportional(value)` 分剩余宽度，默认最小 120px。没写宽度的列是弹性列，下限 60px。`pixel(value)` 同时设定宽度和最小宽度。

### TableSelectionToolbar

`count` 是选中的行数。`clear` 事件让调用方清掉选择。默认插槽放批量操作。数量、清除文案和区域名称来自表格的文案。

## 主题

表头用标签字号、半粗字重和次要文字色。表体用正文字号。选中行用强调色的淡底。斑马纹用淡底。悬停用悬停遮罩。放进卡片时，滚动区域会用卡片公布的容器内边距，让首尾单元格和标题对齐。
