---
layout: component-docs
title: 警告对话框
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="AlertDialog Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>对话框是否打开。必填。组件不会自行关闭，关闭请求通过 <code>openChange</code> 交给父组件。</td>
      </tr>
      <tr>
        <td><code>isInline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>以普通文档流渲染表面，不使用 <code>&lt;dialog&gt;</code>、遮罩与焦点行为，仅用于文档预览。没有模态行为时根元素改用 <code>role="group"</code>。</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>要向用户提出的问题，渲染为二级标题，并通过 <code>aria-labelledby</code> 为对话框命名。必填。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>确认之后会发生什么，通过 <code>aria-describedby</code> 与对话框关联。必填。</td>
      </tr>
      <tr>
        <td><code>cancelLabel</code></td>
        <td><code>string</code></td>
        <td><code>'Cancel'</code></td>
        <td>取消按钮的标签，渲染为 ghost 按钮。点击后发出 <code>openChange(false)</code>。</td>
      </tr>
      <tr>
        <td><code>actionLabel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>确认按钮的标签。写清会发生什么，例如「删除项目」。必填。</td>
      </tr>
      <tr>
        <td><code>actionVariant</code></td>
        <td><code>AlertDialogActionVariant</code></td>
        <td><code>'destructive'</code></td>
        <td>确认按钮的视觉样式，取值与 <code>Button</code> 的变体一致：<code>destructive</code>、<code>primary</code>、<code>secondary</code>、<code>ghost</code>。</td>
      </tr>
      <tr>
        <td><code>isActionLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>确认按钮显示加载指示，并带上 <code>aria-busy</code>；「取消」保持可用，对话框留在原地等待操作结束。</td>
      </tr>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td><code>400</code></td>
        <td>首选宽度，数字单位为像素，字符串原样使用。由对话框夹取到容器与动态视口之内。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件与模板引用

<div class="component-api-table" role="region" aria-label="AlertDialog Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>用户取消时以 <code>false</code> 触发：按下「取消」或按 Escape。是否关闭由父组件决定；点击遮罩与点击确认按钮都不会触发它。</td>
      </tr>
      <tr>
        <td><code>action</code></td>
        <td><code>(event: MouseEvent) =&gt; void</code></td>
        <td>确认按钮被触发时发出。对话框不会自动关闭，请在操作结束后自行关闭。</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLElement | null</code></td>
        <td>根元素（模态下为 <code>&lt;dialog&gt;</code>，行内预览下为 <code>&lt;div&gt;</code>），通过模板引用暴露。</td>
      </tr>
      <tr>
        <td><code>focus</code>、<code>blur</code></td>
        <td><code>() =&gt; void</code></td>
        <td>把焦点移入或移出根元素。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="AlertDialog Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>title</code></td>
        <td>标题内容，用来替换 <code>title</code> 属性。承载它的元素仍然带着对话命名所需的 id。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>描述内容，用来替换 <code>description</code> 属性。同样保留 <code>aria-describedby</code> 指向的 id。</td>
      </tr>
      <tr>
        <td><code>actions</code></td>
        <td>操作区里、取消与确认按钮之前的额外内容，例如指向说明文档的链接。</td>
      </tr>
    </tbody>
  </table>
</div>

## useImperativeAlertDialog

- `show(options)`：以给定选项打开对话框。选项为除 `isOpen` 之外的全部属性，另加一个 `onAction` 回调。
- `hide()`：关闭对话框。
- `isOpen`：打开状态，为可写的 ref。
- `Host`：在模板中渲染一次的组件。

## 原生属性

模态下根元素为 `<dialog>`，行内预览下为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

组件自己维护 `role`、`aria-modal`、`aria-labelledby` 与 `aria-describedby`，因此这些属性以组件推导出的值为准。
