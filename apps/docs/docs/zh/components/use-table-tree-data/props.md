---
layout: component-docs
title: useTableTreeData
outline: false
footer: false
---

配置对象是 `MaybeRefOrGetter`：传一个 getter，行的层级信息、全展开状态和切换动作才能保持实时。

## 参数

<div class="component-api-table" role="region" aria-label="useTableTreeData 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>getRowMeta</code></td>
        <td><code>(item: T) =&gt; TableTreeRowMeta | undefined</code></td>
        <td>—</td>
        <td>某一可见行的结构信息：<code>{ id, level（从 0 开始）, hasChildren, isExpanded }</code>。不属于树的行返回 <code>undefined</code>。</td>
      </tr>
      <tr>
        <td><code>onToggleItem</code></td>
        <td><code>(item: T) =&gt; void</code></td>
        <td>—</td>
        <td>切换这一行的展开状态。</td>
      </tr>
      <tr>
        <td><code>hasExpandableRows</code></td>
        <td><code>boolean</code></td>
        <td>—</td>
        <td>数据里有没有可展开的行。为 false 时插件什么都不做：没有箭头，没有缩进，也没有树的 ARIA 属性。</td>
      </tr>
      <tr>
        <td><code>hasExpandAllControl</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>在树列的表头放一个全部展开/全部收起的开关。要配合 <code>isAllExpanded</code> 和 <code>onExpandAll</code> / <code>onCollapseAll</code> 一起用。</td>
      </tr>
      <tr>
        <td><code>isAllExpanded</code></td>
        <td><code>boolean | 'indeterminate'</code></td>
        <td>—</td>
        <td>所有可展开行的整体展开状态，驱动表头那个开关。全展开是 <code>true</code>，全收起是 <code>false</code>，只有一部分展开是 <code>'indeterminate'</code>。</td>
      </tr>
      <tr>
        <td><code>onExpandAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>展开所有可展开的行。表头的开关会调它。</td>
      </tr>
      <tr>
        <td><code>onCollapseAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>—</td>
        <td>收起所有行。表头的开关会调它。</td>
      </tr>
      <tr>
        <td><code>indent</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>每层的缩进档位，对应 spacing-3 / spacing-4 / spacing-6 三个 token。</td>
      </tr>
      <tr>
        <td><code>treeColumnKey</code></td>
        <td><code>string</code></td>
        <td>插件之外的第一列</td>
        <td>承载缩进和展开箭头的列。给的键找不到时，用第一个不是插件加进来的列。</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>为 true 时，点可展开行的任意位置都能展开或收起，不只是点箭头。这是方便鼠标用户的额外操作：键盘和读屏用户仍然用箭头按钮。点到单元格里的交互内容（按钮、链接、表单控件）或者正在选中文字时不会切换。叶子行没有反应，数据本来就拍平时这个参数也没作用。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableTreeData 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>transformColumns</code></td>
        <td><code>(columns: TableColumn&lt;T&gt;[]) =&gt; TableColumn&lt;T&gt;[]</code></td>
        <td>把树列原来的单元格渲染包一层，画出层级缩进、箭头和内容。<code>hasExpandableRows</code> 为 false 或者找不到树列时，原样返回。</td>
      </tr>
      <tr>
        <td><code>headerPatch</code></td>
        <td><code>(column: TableColumn&lt;T&gt;) =&gt; TableHeaderPatch | null</code></td>
        <td>把全部展开 / 全部收起的按钮放到树列表头文字前面。其它列、没开 <code>hasExpandAllControl</code>、或者三个全展开字段没给齐时，返回 <code>null</code>。</td>
      </tr>
      <tr>
        <td><code>rowPatch</code></td>
        <td><code>(row: T, index: number, columnCount: number) =&gt; TableRowPatch | null</code></td>
        <td>写出 <code>aria-level</code>（层级 + 1），有子行的还写 <code>aria-expanded</code>。开了 <code>hasRowClickExpansion</code> 时，还会给可展开行加上点击切换和 <code>astryx-table__clickable</code> 类。</td>
      </tr>
    </tbody>
  </table>
</div>
