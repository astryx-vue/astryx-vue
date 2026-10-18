---
layout: component-docs
title: useScrollOverflow
outline: false
footer: false
---

## 参数

没有参数。它读的是自己绑上去的那个元素。

## 返回值

<div class="component-api-table" role="region" aria-label="useScrollOverflow 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>scrollRef</code></td>
        <td><code>(node: HTMLElement | null) =&gt; void</code></td>
        <td>绑到那个横向滚动容器上的函数 ref。</td>
      </tr>
      <tr>
        <td><code>overflowStart</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>起始边外面还有没有内容（从左到右的语言是左边，从右到左的语言是右边）。</td>
      </tr>
      <tr>
        <td><code>overflowEnd</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>结束边外面还有没有内容（从左到右的语言是右边，从右到左的语言是左边）。</td>
      </tr>
      <tr>
        <td><code>hasOverflow</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>容器有没有任何横向溢出（<code>scrollWidth &gt; clientWidth</code>）。</td>
      </tr>
    </tbody>
  </table>
</div>
