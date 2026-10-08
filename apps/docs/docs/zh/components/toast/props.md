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
        <td><code>autoClose</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>是否在 <code>duration</code> 之后自动关闭。</td>
      </tr>
      <tr>
        <td><code>duration</code></td>
        <td><code>number</code></td>
        <td><code>5000</code></td>
        <td>自动关闭前的停留时长，单位毫秒。</td>
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
        <td><code>close</code></td>
        <td>提示关闭时触发，无论是自动关闭还是手动关闭。</td>
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
        <td><code>'bottom-center'</code></td>
        <td>提示在屏幕上的弹出位置，可选 top-start、top-center、top-end、bottom-start、bottom-center、bottom-end。</td>
      </tr>
    </tbody>
  </table>
</div>

## useToast

```ts
const toast = useToast()

const dismiss = toast({ body: 'Hello', type: 'info', duration: 3000 })
// 手动关闭
dismiss()
// 关闭全部
toast.clear()
```
