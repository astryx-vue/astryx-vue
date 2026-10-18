---
layout: component-docs
title: useTableTreeState
outline: false
footer: false
---

`data` 是 `MaybeRefOrGetter`：树会变的时候，传 getter 或 ref。其它字段从你传入的配置对象上读。

## 参数

<div class="component-api-table" role="region" aria-label="useTableTreeState 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>data</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly T[]&gt;</code></td>
        <td>—</td>
        <td>嵌套数据：行可以在 <code>childrenKey</code> 指向的属性下带子行。完全是拍平数据（哪都没有子行）时插件什么都不做，所以可以先用着，等数据变成层级结构再说。</td>
      </tr>
      <tr>
        <td><code>idKey</code></td>
        <td><code>(keyof T &amp; string) | ((item: T) =&gt; string | number)</code></td>
        <td>—</td>
        <td>行 ID 的取法：写属性名，或者给一个返回唯一 id 的函数。</td>
      </tr>
      <tr>
        <td><code>childrenKey</code></td>
        <td><code>string</code></td>
        <td><code>'children'</code></td>
        <td>存放子行数组的属性名。</td>
      </tr>
      <tr>
        <td><code>defaultExpandedIds</code></td>
        <td><code>Iterable&lt;string&gt;</code></td>
        <td>—</td>
        <td>不受控模式下初始的展开行 id，只在初始化时读一次。传了 <code>expandedIds</code> 就忽略它。</td>
      </tr>
      <tr>
        <td><code>expandedIds</code></td>
        <td><code>ReadonlySet&lt;string&gt;</code></td>
        <td>—</td>
        <td>受控的展开行 id 集合，配合 <code>onExpandedIdsChange</code> 使用。</td>
      </tr>
      <tr>
        <td><code>onExpandedIdsChange</code></td>
        <td><code>(ids: ReadonlySet&lt;string&gt;) =&gt; void</code></td>
        <td>—</td>
        <td>展开状态一变化就带着下一个集合调到（两种模式都调）。懒加载场景就在这里去拉子行。</td>
      </tr>
      <tr>
        <td><code>isItemExpandable</code></td>
        <td><code>(item: T) =&gt; boolean</code></td>
        <td>有子行才算</td>
        <td>这一行要不要显示展开箭头。默认只看子行为不为空，这个函数可以盖掉默认判断；懒加载时用得上，子行还没拉回来也能算可展开。</td>
      </tr>
      <tr>
        <td><code>sortSiblings</code></td>
        <td><code>(siblings: T[]) =&gt; T[]</code></td>
        <td>—</td>
        <td>拍平时给每一组同级行单独排序；子行始终紧跟在父行下面。用来把列的排序和树的顺序合起来。</td>
      </tr>
      <tr>
        <td><code>indent</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td><code>'md'</code></td>
        <td>每层的缩进档位（spacing-3 / spacing-4 / spacing-6），会传给 <code>useTableTreeData</code>。</td>
      </tr>
      <tr>
        <td><code>treeColumnKey</code></td>
        <td><code>string</code></td>
        <td>插件之外的第一列</td>
        <td>承载缩进和展开箭头的列，会传给 <code>useTableTreeData</code>。</td>
      </tr>
      <tr>
        <td><code>hasExpandAllControl</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>在树列表头放全部展开/全部收起的开关。</td>
      </tr>
      <tr>
        <td><code>hasRowClickExpansion</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>点可展开行的任意位置就切换展开，会传给 <code>useTableTreeData</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableTreeState 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>visibleData</code></td>
        <td><code>ComputedRef&lt;T[]&gt;</code></td>
        <td>要渲染的行：父行在前，展开的父行后面紧跟子行。作为 <code>data</code> 传给表格。</td>
      </tr>
      <tr>
        <td><code>plugin</code></td>
        <td><code>TablePlugin&lt;T&gt;</code></td>
        <td>树插件，已经和可见行、展开集合接好了。塞进 <code>plugins</code> 的任意一个键就行。</td>
      </tr>
      <tr>
        <td><code>expandedIds</code></td>
        <td><code>ComputedRef&lt;ReadonlySet&lt;string&gt;&gt;</code></td>
        <td>当前在用的展开集合：受控时是你给的那个，否则是内部维护的。</td>
      </tr>
      <tr>
        <td><code>isAllExpanded</code></td>
        <td><code>ComputedRef&lt;boolean | 'indeterminate'&gt;</code></td>
        <td>所有可展开行汇总出来的展开状态。</td>
      </tr>
      <tr>
        <td><code>expandAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>展开所有可展开的行，并把新集合通过 <code>onExpandedIdsChange</code> 报出去。</td>
      </tr>
      <tr>
        <td><code>collapseAll</code></td>
        <td><code>() =&gt; void</code></td>
        <td>收起所有行，并把空集合通过 <code>onExpandedIdsChange</code> 报出去。</td>
      </tr>
    </tbody>
  </table>
</div>
