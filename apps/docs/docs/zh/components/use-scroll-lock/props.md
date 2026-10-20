---
layout: component-docs
title: useScrollLock
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useScrollLock 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isLocked</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>—</td>
        <td>要不要锁住 <code>body</code> 的滚动。它是用 watch 读的，所以要传 ref 或 computed，不能传普通布尔值。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

没有返回值。它只改 `document.body.style.overflow`，不渲染任何东西。
