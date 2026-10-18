---
layout: component-docs
title: useHotkeys
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useHotkeys 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>hotkeys</code></td>
        <td><code>MaybeRefOrGetter&lt;readonly Hotkey[]&gt;</code></td>
        <td>—</td>
        <td>快捷键登记表。普通数组、ref、getter 都行，每次按键时重新读。必填。</td>
      </tr>
      <tr>
        <td><code>hotkeys[].keys</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>用 <code>"+"</code> 串起来的组合，例如 <code>"mod+k"</code>、<code>"shift+/"</code>、<code>"escape"</code>。<code>mod</code> 在 macOS 上是 ⌘，其他平台是 Ctrl。别名有 <code>esc</code>、<code>space</code>、<code>up</code>、<code>down</code>、<code>left</code>、<code>right</code>、<code>return</code>，字面量 <code>+</code> 写成 <code>plus</code>。组合里不写 <code>shift</code> 时忽略 shift 状态，所以单个字母不区分大小写。</td>
      </tr>
      <tr>
        <td><code>hotkeys[].onPress</code></td>
        <td><code>(event: KeyboardEvent) =&gt; void</code></td>
        <td>—</td>
        <td>命中组合时调用，调用前已经 <code>preventDefault()</code>。</td>
      </tr>
      <tr>
        <td><code>hotkeys[].allowInInputs</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>焦点在输入框、文本域、下拉框或可编辑区域里时也触发这条快捷键。</td>
      </tr>
      <tr>
        <td><code>hotkeys[].isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>暂时停用这一条，不需要摘掉监听。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useHotkeys 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>—</td>
        <td><code>void</code></td>
        <td>没有返回值。组件卸载时 window 上的监听会被摘掉。</td>
      </tr>
    </tbody>
  </table>
</div>
