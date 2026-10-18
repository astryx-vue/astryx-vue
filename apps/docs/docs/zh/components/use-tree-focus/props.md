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
        <td>树形焦点行为的配置。必传，里面两个字段都是可选的。</td>
      </tr>
      <tr>
        <td><code>options.onToggleExpand</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>—</td>
        <td>展开或收起指定 id 的树节点时调用：右方向键按在收起的父节点上、左方向键按在展开的父节点上、以及父节点自己没有动作时按 Enter 或空格。</td>
      </tr>
      <tr>
        <td><code>options.onActivate</code></td>
        <td><code>(item: HTMLElement) =&gt; boolean</code></td>
        <td>—</td>
        <td>Enter 或空格激活树节点时调用。你自己处理了就返回 <code>true</code>；返回 <code>false</code> 或不返回，hook 会退回去切换展开状态。</td>
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
        <td><code>() =&gt; void</code></td>
        <td>绑到容器 <code>@focus</code> 上的处理函数。点过一次之后靠它把 tab 停留点修回来。一直绑着也不会有副作用。</td>
      </tr>
    </tbody>
  </table>
</div>
