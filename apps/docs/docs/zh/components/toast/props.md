---
layout: component-docs
title: 轻提示
outline: false
footer: false
---

## Toast Props

<div class="component-api-table" role="region" aria-label="Toast Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>type</code></td>
        <td><code>ToastType</code></td>
        <td><code>'info'</code></td>
        <td>提示的类型，可选 info、success、warning、error；error 类型会自动应用 <code>role="alert"</code>。</td>
      </tr>
      <tr>
        <td><code>body</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>提示的正文文本，默认渲染在提示内容区。</td>
      </tr>
      <tr>
        <td><code>isAutoHide</code></td>
        <td><code>boolean</code></td>
        <td><code>error</code> 以外为 <code>true</code></td>
        <td>是否自动关闭。error 类型默认一直留着，直到被关掉。</td>
      </tr>
      <tr>
        <td><code>autoHideDuration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>自动关闭前的停留时长，单位毫秒。悬停、聚焦或窗口失焦会暂停计时，恢复后至少还剩一秒。</td>
      </tr>
      <tr>
        <td><code>autoClose</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td><code>isAutoHide</code> 的旧名字，写哪个都行，同名时以 <code>isAutoHide</code> 为准。</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td><code>autoHideDuration</code> 的旧名字，写哪个都行，同名时以 <code>autoHideDuration</code> 为准。</td>
      </tr>
      <tr>
        <td><code>uniqueID</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>用来把同一条提示合并成一个的标识。</td>
      </tr>
      <tr>
        <td><code>collisionBehavior</code></td>
        <td><code>'ignore' | 'overwrite'</code></td>
        <td><code>'overwrite'</code></td>
        <td>屏幕上已有同 <code>uniqueID</code> 的提示时怎么办。</td>
      </tr>
      <tr>
        <td><code>endContent</code></td>
        <td><code>Component</code></td>
        <td>-</td>
        <td>末尾动作，例如撤销按钮。临时内容用 <code>end</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>onDismiss</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>-</td>
        <td>卡片自己关掉提示时触发：计时器、关闭按钮或自定义内容。<code>useToast()</code> 的参数里使用。</td>
      </tr>
      <tr>
        <td><code>onHide</code></td>
        <td><code>(reason: 'auto' | 'manual') =&gt; void</code></td>
        <td>-</td>
        <td>提示被移除时触发，包括用 <code>useToast()</code> 返回的函数关掉的情况。<code>useToast()</code> 的参数里使用。</td>
      </tr>
    </tbody>
  </table>
</div>

## Toast 事件

<div class="component-api-table" role="region" aria-label="Toast 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>dismiss</code></td>
        <td>卡片自己关闭提示时触发，参数是原因（<code>'auto'</code> 或 <code>'manual'</code>）。</td>
      </tr>
      <tr>
        <td><code>close</code></td>
        <td><code>dismiss</code> 的旧名字，同时触发，不带原因。</td>
      </tr>
    </tbody>
  </table>
</div>

## Toast Slots

<div class="component-api-table" role="region" aria-label="Toast Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>自定义提示的内容区域，未提供时默认显示 <code>body</code> 文本。</td>
      </tr>
      <tr>
        <td><code>end</code></td>
        <td>末尾内容，替代 <code>endContent</code>。</td>
      </tr>
      <tr>
        <td><code>content</code></td>
        <td>替换整块卡片内容，参数是 <code>{ body, endContent, type, isAutoHide, autoHideDuration, dismiss }</code>。这时不再渲染自带的关闭按钮，控件全部由自定义布局负责。</td>
      </tr>
    </tbody>
  </table>
</div>

## ToastViewport Props

<div class="component-api-table" role="region" aria-label="ToastViewport Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>placement</code></td>
        <td><code>ToastPlacement</code></td>
        <td><code>'bottom-end'</code></td>
        <td>提示在屏幕上的弹出位置，可选 top-start、top-center、top-end、bottom-start、bottom-center、bottom-end。</td>
      </tr>
    </tbody>
  </table>
</div>

## useToast

```ts
const toast = useToast()

const dismiss = toast({
  body: 'Hello',
  type: 'info',
  autoHideDuration: 3000,
  onDismiss: reason => console.log('关闭原因', reason),
  onHide: reason => console.log('已移除', reason),
})
// 手动关闭
dismiss()
// 关闭全部
toast.clear()
```
