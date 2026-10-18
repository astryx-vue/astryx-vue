---
layout: component-docs
title: useToast
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useToast 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(options: ToastOptions) =&gt; () =&gt; void</code></td>
        <td>弹出一条提示。返回的函数用来关掉这一条。hook 本身可以直接调用，所以 <code>toast({ body })</code> 和 <code>toast.show({ body })</code> 是一回事。</td>
      </tr>
      <tr>
        <td><code>dismiss</code></td>
        <td><code>(id: string) =&gt; void</code></td>
        <td>按 id 关掉一条提示。它挂在返回的函数上：<code>toast.dismiss(id)</code>。</td>
      </tr>
      <tr>
        <td><code>clear</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关掉当前所有提示，写作 <code>toast.clear()</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 提示配置

<div class="component-api-table" role="region" aria-label="Toast 配置" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>body</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>提示正文。必填。</td>
      </tr>
      <tr>
        <td><code>type</code></td>
        <td><code>'info' | 'success' | 'warning' | 'error'</code></td>
        <td><code>'info'</code></td>
        <td>提示的类型，决定配色和图标。</td>
      </tr>
      <tr>
        <td><code>isAutoHide</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否自动消失。<code>error</code> 类型的提示默认留着，等人关掉。</td>
      </tr>
      <tr>
        <td><code>autoHideDuration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>自动消失前停留的毫秒数。</td>
      </tr>
      <tr>
        <td><code>uniqueID</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>同一个身份的多条提示会合并成一条。</td>
      </tr>
      <tr>
        <td><code>collisionBehavior</code></td>
        <td><code>'ignore' | 'overwrite'</code></td>
        <td><code>'overwrite'</code></td>
        <td><code>uniqueID</code> 撞上时怎么处理。</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>Component</code></td>
        <td>—</td>
        <td>正文后面的操作，例如「撤销」按钮。</td>
      </tr>
      <tr>
        <td><code>onDismiss</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>—</td>
        <td>提示卡片自己关掉时调用：计时到了、点了关闭按钮、或者划走。</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>—</td>
        <td>提示被移除时调用，不管是哪种关闭方式。</td>
      </tr>
    </tbody>
  </table>
</div>
