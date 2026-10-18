---
layout: component-docs
title: useClipboard
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useClipboard 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseClipboardOptions</code></td>
        <td><code>{}</code></td>
        <td>配置对象，可以不传。</td>
      </tr>
      <tr>
        <td><code>options.announce</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>复制成功后念给读屏的句子。只换 <code>aria-label</code> 时读屏经常不念，所以这里传一句本地化的确认（例如「已复制」）。不传就不播报。</td>
      </tr>
      <tr>
        <td><code>options.resetAfterMs</code></td>
        <td><code>number</code></td>
        <td><code>2000</code></td>
        <td>复制成功后 <code>isCopied</code> 保持为 true 的毫秒数。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useClipboard 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>copy</code></td>
        <td><code>(text: string) =&gt; Promise&lt;boolean&gt;</code></td>
        <td>把 <code>text</code> 写进剪贴板。成功时 <code>isCopied</code> 变为 true、播报配置的句子、重置定时器，并返回 true。写入被拒绝时什么都不改，返回 false。</td>
      </tr>
      <tr>
        <td><code>isCopied</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>最近一次复制成功后的 <code>resetAfterMs</code> 内为 true，之后归位。复制成功的提示（例如复制图标换成对勾）看它即可。</td>
      </tr>
    </tbody>
  </table>
</div>
