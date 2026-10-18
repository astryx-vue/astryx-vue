---
layout: component-docs
title: useMediaQuery
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useMediaQuery 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>query</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>要判断的 CSS 媒体查询字符串，例如 <code>'(max-width: 640px)'</code>。每次调用只读一次，请传固定的字符串。必填。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useMediaQuery 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>matches</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>这条媒体查询当前是否匹配。客户端在 setup 阶段读一次，服务端上是 <code>false</code>。</td>
      </tr>
    </tbody>
  </table>
</div>
