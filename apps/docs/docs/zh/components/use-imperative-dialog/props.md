---
layout: component-docs
title: useImperativeDialog
outline: false
footer: false
---

## 参数

<div class="component-api-table" role="region" aria-label="useImperativeDialog 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>defaultOptions</code></td>
        <td><code>ImperativeDialogOptions</code></td>
        <td><code>{}</code></td>
        <td>每次 <code>show()</code> 都带上的默认配置，就是 <code>Dialog</code> 的属性去掉 <code>isOpen</code>。某次调用自己再传一份，会覆盖在这些之上。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useImperativeDialog 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>show</code></td>
        <td><code>(content: () =&gt; VNodeChild, options?: ImperativeDialogOptions) =&gt; void</code></td>
        <td>按给定内容打开对话框。配置就是 <code>Dialog</code> 的属性去掉 <code>isOpen</code> 和内容。</td>
      </tr>
      <tr>
        <td><code>hide</code></td>
        <td><code>() =&gt; void</code></td>
        <td>关掉对话框。</td>
      </tr>
      <tr>
        <td><code>isOpen</code></td>
        <td><code>Readonly&lt;Ref&lt;boolean&gt;&gt;</code></td>
        <td>对话框当前是否打开。</td>
      </tr>
      <tr>
        <td><code>Host</code></td>
        <td><code>Component</code></td>
        <td>承载对话框的组件。在模板里渲染一次：<code>&lt;component :is="dialog.Host" /&gt;</code>。</td>
      </tr>
    </tbody>
  </table>
</div>

## 配置项

<div class="component-api-table" role="region" aria-label="useImperativeDialog 配置项" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>width</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>期望宽度。数字按像素，字符串原样使用。全屏变体忽略它。</td>
      </tr>
      <tr>
        <td><code>maxHeight</code></td>
        <td><code>number | string</code></td>
        <td>—</td>
        <td>最大高度。数字按像素，字符串原样使用。全屏变体忽略它。</td>
      </tr>
      <tr>
        <td><code>position</code></td>
        <td><code>DialogPosition</code></td>
        <td>居中</td>
        <td>固定位置。水平方向用 <code>start</code> 和 <code>end</code>，RTL 下自动镜像。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'standard' | 'fullscreen'</code></td>
        <td><code>'standard'</code></td>
        <td>标准对话框由 <code>width</code> 和 <code>maxHeight</code> 定尺寸；全屏的占满视口。</td>
      </tr>
      <tr>
        <td><code>purpose</code></td>
        <td><code>'info' | 'form' | 'required'</code></td>
        <td><code>'info'</code></td>
        <td>用什么方式关。required 禁用 Escape 和遮罩；form 保留 Escape、禁用遮罩；info 两者都允许。</td>
      </tr>
      <tr>
        <td><code>padding</code></td>
        <td><code>DialogPadding</code></td>
        <td>主题默认值</td>
        <td>内边距档位，对应 <code>--astryx-spacing-*</code> 这些 token。</td>
      </tr>
    </tbody>
  </table>
</div>
