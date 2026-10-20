---
layout: component-docs
title: useDevWarning
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useDevWarning 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>component</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>组件或组合式函数的名字，用作消息前缀。必填。</td>
      </tr>
      <tr>
        <td><code>message</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>哪里错了、该怎么改。必填。</td>
      </tr>
      <tr>
        <td><code>condition</code></td>
        <td><code>MaybeRefOrGetter&lt;boolean&gt;</code></td>
        <td><code>true</code></td>
        <td>是否要警告。普通布尔值、<code>ref</code>、getter 都行。一次挂载里第一次成立时警告一次，之后再反复变成 true 也不再输出。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useDevWarning 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>—</td>
        <td><code>void</code></td>
        <td>没有返回值。组件或作用域销毁时 watch 自动停掉；生产构建里这个函数什么也不做。</td>
      </tr>
    </tbody>
  </table>
</div>
