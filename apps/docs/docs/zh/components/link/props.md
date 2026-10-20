---
layout: component-docs
title: 链接
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Link Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接目标地址。未提供时渲染为 <code>&lt;button&gt;</code>。</td>
      </tr>
      <tr>
        <td><code>as</code></td>
        <td><code>LinkRoot</code></td>
        <td>-</td>
        <td>有地址且未禁用时替换 <code>&lt;a&gt;</code> 的根组件，同时接收 <code>href</code> 和 <code>to</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>无障碍名称。可见内容不是名称时使用，例如只有图标的链接。设置后会代替链接文字被朗读。</td>
      </tr>
      <tr>
        <td><code>newTabLabel</code></td>
        <td><code>string</code></td>
        <td>当前语言的「（在新标签页打开）」</td>
        <td>外部链接后面给读屏的说明。</td>
      </tr>
      <tr>
        <td><code>size</code></td>
        <td><code>LinkSize</code></td>
        <td>-</td>
        <td>字号，和正文相同：sm、md、lg、xl。</td>
      </tr>
      <tr>
        <td><code>weight</code></td>
        <td><code>LinkWeight</code></td>
        <td>-</td>
        <td>字重。normal 和 regular 相同。</td>
      </tr>
      <tr>
        <td><code>maxLines</code></td>
        <td><code>number</code></td>
        <td><code>0</code></td>
        <td>最多显示的行数。0 表示不截断。</td>
      </tr>
      <tr>
        <td><code>isExternalLink</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否在新标签页打开并显示外部链接标识。</td>
      </tr>
      <tr>
        <td><code>hasUnderline</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否始终显示下划线。</td>
      </tr>
      <tr>
        <td><code>color</code></td>
        <td><code>LinkColor</code></td>
        <td><code>'accent'</code></td>
        <td>链接颜色，可选 primary、secondary、accent、inherit。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否禁用。</td>
      </tr>
      <tr>
        <td><code>target</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML target 属性。</td>
      </tr>
      <tr>
        <td><code>rel</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>HTML rel 属性。外部链接会自动追加 noopener noreferrer。</td>
      </tr>
      <tr>
        <td><code>download</code></td>
        <td><code>string | boolean</code></td>
        <td>-</td>
        <td>是否触发下载。写字符串就是建议的文件名。<code>true</code> 只写一个空的 <code>download</code> 属性，<code>false</code> 不写这个属性。</td>
      </tr>
      <tr>
        <td><code>referrerPolicy</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接的 referrer 策略，原样转成 <code>referrerpolicy</code> 属性。</td>
      </tr>
    </tbody>
  </table>
</div>



## 事件

<div class="component-api-table" role="region" aria-label="Link 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>点击时触发。禁用时不会触发。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Link 插槽" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>链接文字内容。</td>
      </tr>
    </tbody>
  </table>
</div>

## 原生属性

根元素为 `<a>`、`<button>`，或 `as` 传入的组件。禁用的链接始终是没有地址的 `<a>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
