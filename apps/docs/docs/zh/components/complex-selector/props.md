---
layout: component-docs
title: 复合选择器
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ComplexSelector Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>字段标签，也是弹层的名称。</td></tr>
      <tr><td><code>modelValue</code></td><td><code>Value</code></td><td>-</td><td>当前值。用 <code>v-model</code> 绑定。</td></tr>
      <tr><td><code>triggerLabel</code></td><td><code>string</code></td><td>-</td><td>触发器上的文字。空的时候用 <code>placeholder</code>。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td>选择…</td><td><code>triggerLabel</code> 为空时显示。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>隐藏可见标签。无障碍名称还在。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>-</td><td>标签下面的说明。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标成可选。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>标成必填。</td></tr>
      <tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>触发器不再打开。</td></tr>
      <tr><td><code>isLoading</code></td><td><code>boolean</code></td><td><code>false</code></td><td>触发器上显示加载指示。</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>-</td><td>错误、警告或成功消息。</td></tr>
      <tr><td><code>statusVariant</code></td><td><code>'attached' | 'detached' | 'tooltip'</code></td><td><code>'attached'</code></td><td>状态消息放在哪里。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>-</td><td>标签上的提示。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>触发器尺寸。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>-</td><td>字段宽度。数字按像素。</td></tr>
      <tr><td><code>placement</code></td><td><code>PopoverPlacement</code></td><td><code>'below'</code></td><td>弹层打开的位置。</td></tr>
      <tr><td><code>alignment</code></td><td><code>'start' | 'center' | 'end'</code></td><td><code>'start'</code></td><td>弹层沿打开方向的对齐。</td></tr>
      <tr><td><code>startIcon</code></td><td><code>string | Component</code></td><td>-</td><td>内置触发器开头的图标。</td></tr>
      <tr><td><code>variant</code></td><td><code>'input' | 'ghost'</code></td><td><code>'input'</code></td><td><code>input</code> 是带边框的字段。<code>ghost</code> 看起来像工具栏按钮。</td></tr>
      <tr><td><code>renderTrigger</code></td><td><code>(props) =&gt; VNode</code></td><td>-</td><td>换掉字段和内置触发器。把 <code>props</code> 展开到你的控件上。<code>trigger</code> 插槽做同一件事。</td></tr>
      <tr><td><code>handleRef</code></td><td><code>Ref | (handle) =&gt; void</code></td><td>-</td><td>拿到 <code>open</code>、<code>close</code>、<code>toggle</code> 和 <code>isOpen</code>。模板 <code>ref</code> 暴露同样的方法。</td></tr>
      <tr><td><code>changeAction</code></td><td><code>(value) =&gt; void | Promise&lt;void&gt;</code></td><td>-</td><td>值变化后执行。还没结束时触发器显示加载指示。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ComplexSelector Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>Value</code></td><td><code>commit</code> 写入的值。</td></tr>
      <tr><td><code>change</code></td><td><code>Value</code></td><td>和 <code>update:modelValue</code> 一起发出。</td></tr>
      <tr><td><code>click</code></td><td><code>event: MouseEvent</code></td><td>触发器上的点击，在弹层打开之前触发。调用 <code>event.preventDefault()</code> 可以让它不打开。用 <code>trigger</code> 插槽或 <code>renderTrigger</code> 自己画触发器时，它在开关之后触发，取消不了。</td></tr>
      <tr><td><code>keydown</code></td><td><code>event: KeyboardEvent</code></td><td>触发器上的按键，在内置处理之后触发，每个键都会收到，包括打开弹层的 ArrowDown。换成自制触发器时，内置处理取消的按键不再透出。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>弹层每次打开或关闭都会触发：触发器、键盘、点外面、Escape、<code>close()</code> 或命令式 handle。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

默认插槽收到 `value`、`commit`、`close` 和 `state`。`state` 是 `{ isOpen, isBusy, triggerId, contentId }`。`value` 包含还在提交中的乐观值。
