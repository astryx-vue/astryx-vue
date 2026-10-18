---
layout: component-docs
title: useTranslator
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useTranslator 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>t</code></td>
        <td><code>(key: string, values?: Record&lt;string, string | number&gt;) =&gt; string</code></td>
        <td>绑在当前 <code>InternationalizationProvider</code> 上的翻译函数。传一个消息键和可选的占位符值，拿回当前语言的成品文案。函数本身在组件存活期间一直是同一个；每次调用才去读 provider，所以在渲染、事件处理、watch，或组件生命周期里任何会跑到的代码中都能用。</td>
      </tr>
    </tbody>
  </table>
</div>
