---
layout: component-docs
title: useChatPasteAsToken
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useChatPasteAsToken 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>options</code></td>
        <td><code>UseChatPasteAsTokenOptions</code></td>
        <td>—</td>
        <td>配置对象，必填。</td>
      </tr>
      <tr>
        <td><code>options.input</code></td>
        <td><code>Ref&lt;ChatComposerInputHandle | null&gt;</code></td>
        <td>—</td>
        <td>输入框的句柄。长粘贴通过它的 <code>insertToken</code> 插入。必填。</td>
      </tr>
      <tr>
        <td><code>options.threshold</code></td>
        <td><code>number</code></td>
        <td><code>200</code></td>
        <td>超过这么多个字符的粘贴会变成标签，更短的保持成文字。</td>
      </tr>
      <tr>
        <td><code>options.toToken</code></td>
        <td><code>(text: string) =&gt; ChatComposerToken</code></td>
        <td>中性徽标</td>
        <td>由粘贴的文字生成标签。默认是一个中性徽标，标签文字是粘贴的大小，跟着当前语言走。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useChatPasteAsToken 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>onPaste</code></td>
        <td><code>(text: string) =&gt; boolean</code></td>
        <td>返回 true 表示这次粘贴变成了标签；返回 false 表示输入框应当自己插入文字。</td>
      </tr>
    </tbody>
  </table>
</div>
