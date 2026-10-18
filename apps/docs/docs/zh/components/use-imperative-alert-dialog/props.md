---
layout: component-docs
title: useImperativeAlertDialog
outline: false
footer: false
---

## 返回值

<div class="component-api-table" role="region" aria-label="useImperativeAlertDialog 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(options: ImperativeAlertDialogOptions) =&gt; void</code></td>
        <td>按给定配置弹出对话框。配置就是 <code>AlertDialog</code> 的属性去掉 <code>isOpen</code>，再加上 <code>onAction</code>。</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关掉对话框。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Ref&lt;boolean&gt;</code></td>
        <td>对话框当前是否打开。</td>
      </tr>
      <tr>
        <td><code>Host</code></td>
        <td><code>Component</code></td>
        <td>承载对话框的组件。在模板里渲染一次：<code>&lt;component :is="alert.Host" /&gt;</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 配置项

<div class="component-api-table" role="region" aria-label="useImperativeAlertDialog 配置项" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>要问的问题，通过 <code>aria-labelledby</code> 成为对话框的名字。必填。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>确认之后会发生什么，通过 <code>aria-describedby</code> 和对话框关联，读屏会一起念出来。必填。</td>
      </tr>
      <tr>
        <td><code>actionLabel</code></td>
        <td><code>string</code></td>
        <td>—</td>
        <td>确认按钮的文字。写清楚会发生什么，例如 <code>'Delete project'</code>。必填。</td>
      </tr>
      <tr>
        <td><code>onAction</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>—</td>
        <td>确认动作被触发时调用。对话框不会自己关：事情办完你自己调 <code>hide()</code>。</td>
      </tr>
      <tr>
        <td><code>cancelLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Cancel'</code></td>
        <td>取消按钮的文字。</td>
      </tr>
      <tr>
        <td><code>actionVariant</code></td>
        <td><code>AlertDialogActionVariant</code></td>
        <td><code>'destructive'</code></td>
        <td>确认按钮的视觉样式。</td>
      </tr>
      <tr>
        <td><code>isActionLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>确认动作还在跑的时候，在按钮上显示转圈。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>400</code></td>
        <td>期望宽度。数字按像素，字符串原样使用。</td>
      </tr>
    </tbody>
  </table>
</div>
