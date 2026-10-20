---
layout: component-docs
title: useTreeFocus
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useTreeFocus 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseTreeFocusOptions</code></td>
        <td>—</td>
        <td>树形焦点行为的配置。必传，里面的字段都是可选的。</td>
      </tr>
      <tr>
        <td><code>options.itemSelector</code></td>
        <td><code>string</code></td>
        <td><code>'[role="treeitem"]'</code></td>
        <td>树里可见节点的选择器，按 DOM 顺序。</td>
      </tr>
      <tr>
        <td><code>options.isItemDisabled</code></td>
        <td><code>(item: HTMLElement) =&gt; boolean</code></td>
        <td>—</td>
        <td>判断某个节点是否停用、导航时要跳过。不传时读 <code>data-tree-disabled</code> 和 <code>aria-disabled</code>。</td>
      </tr>
      <tr>
        <td><code>options.getLevel</code></td>
        <td><code>(item: HTMLElement) =&gt; number</code></td>
        <td>—</td>
        <td>读某个节点的层级（从 1 开始）。不传时读 <code>aria-level</code> 属性。</td>
      </tr>
      <tr>
        <td><code>options.onToggleExpand</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>—</td>
        <td>展开或收起指定 id 的节点时调用：右方向键按在收起的父节点上、左方向键按在展开的父节点上、以及父节点自己没有动作时按 Enter 或空格。id 取节点的 <code>data-tree-id</code>，没有就取它的 <code>id</code> 属性。</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(item: HTMLElement, id: string | undefined) =&gt; boolean | void</code></td>
        <td>—</td>
        <td>Enter 或空格激活节点时调用。你自己处理了就返回 <code>true</code>；返回 <code>false</code> 或不返回，hook 会退回去切换展开状态。</td>
      </tr>
      <tr>
        <td><code>options.onActiveChange</code></td>
        <td><code>(id: string | undefined) =&gt; void</code></td>
        <td>—</td>
        <td>hook 把焦点移到某个节点之后通知。tab 停靠点不归 hook 管时，用它自己挪；也可以用它同步自己的选中状态。</td>
      </tr>
      <tr>
        <td><code>options.hasRovingTabIndex</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>为 true 时由 hook 管唯一的 tab 停靠点：给各项打上 <code>tabindex</code> 0/-1，挂载时对齐一次，导航时跟着走。挂载时已有的 <code>tabindex="0"</code> 会被保留为起点。点了之后想让它对齐，把返回的 <code>handleFocus</code> 接上。</td>
      </tr>
      <tr>
        <td><code>options.typeahead</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否启用 typeahead：敲一个可打印字符，跳到下一个文本以这些字符开头的节点。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTreeFocus 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>treeRef</code></td>
        <td><code>Ref&lt;HTMLElement | null&gt;</code></td>
        <td>绑到树容器（<code>role="tree"</code>）上的 ref。</td>
      </tr>
      <tr>
        <td><code>handleKeyDown</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>绑到树容器上的按键处理函数。</td>
      </tr>
      <tr>
        <td><code>handleFocus</code></td>
        <td><code>(event?: FocusEvent) =&gt; void</code></td>
        <td>绑到容器 <code>@focus</code> 上的处理函数。<code>hasRovingTabIndex</code> 打开时靠它把 tab 停靠点对齐，没打开时它什么都不做，所以一直绑着也不会有副作用。</td>
      </tr>
      <tr>
        <td><code>focusFirst</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦第一个可用的可见节点。</td>
      </tr>
      <tr>
        <td><code>focusLast</code></td>
        <td><code>() =&gt; void</code></td>
        <td>聚焦最后一个可用的可见节点。</td>
      </tr>
    </tbody>
  </table>
</div>
