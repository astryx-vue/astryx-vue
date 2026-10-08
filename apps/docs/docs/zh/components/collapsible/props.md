---
layout: component-docs
title: 折叠面板
outline: false
footer: false
---

## Props

<div class="component-api-table" role="region" aria-label="Collapsible Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>trigger</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>触发器的纯文本标签。标签需要标题、图标或其他控件时改用 <code>trigger</code> 插槽，插槽会完全替换这个属性。</td>
      </tr>
      <tr>
        <td><code>v-model:isOpen</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>受控的展开状态。绑定后组件完全跟随这个值，点击只发出更新请求；不绑定时组件自己管理状态。</td>
      </tr>
      <tr>
        <td><code>defaultIsOpen</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>未绑定 <code>isOpen</code> 时，初始是否展开。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用后触发器变暗、带 <code>aria-disabled</code> 并退出 Tab 顺序，点击不再切换状态，也不会收起已经展开的内容。</td>
      </tr>
      <tr>
        <td><code>chevronPosition</code></td>
        <td><code>CollapsibleChevronPosition</code></td>
        <td><code>'end'</code></td>
        <td>指示箭头的逻辑位置。end（默认）跟在标签后面，收起时朝下、展开时朝上；start 放在标签前面，收起时指向内容一侧（RTL 下镜像），展开时朝下。</td>
      </tr>
    </tbody>
  </table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="Collapsible Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>收起时隐藏、展开时显示的内容。</td>
      </tr>
      <tr>
        <td><code>trigger</code></td>
        <td>触发器的标签内容，可以放标题、图标或额外的控件，用来替换 <code>trigger</code> 属性。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件与模板引用

<div class="component-api-table" role="region" aria-label="Collapsible Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>签名</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>openChange</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>触发器请求切换状态时触发。非受控用法下是状态变化的通知，受控用法下是对父组件的更新请求。</td>
      </tr>
      <tr>
        <td><code>update:isOpen</code></td>
        <td><code>(isOpen: boolean) =&gt; void</code></td>
        <td>由 <code>v-model:isOpen</code> 自动监听，一般不需要手动处理。</td>
      </tr>
      <tr>
        <td><code>element</code></td>
        <td><code>HTMLDivElement | null</code></td>
        <td>根元素，通过模板引用暴露。</td>
      </tr>
    </tbody>
  </table>
</div>

## 主题

```css
.my-collapsible {
  --astryx-collapsible-trigger-foreground: #171717;
  --astryx-collapsible-content-foreground: #525252;
}
```

- `--astryx-collapsible-trigger-foreground`：触发器文字颜色。
- `--astryx-collapsible-content-foreground`：内容文字颜色。
- `--astryx-collapsible-pressed-overlay`：按住触发器时叠加的背景，仅在按下期间出现。
- `--astryx-collapsible-focus`：键盘聚焦时的轮廓颜色。
- `--astryx-spacing-1`、`--astryx-text-large-size`、`--astryx-text-body-size`：内边距与两处文字尺寸沿用全局 token。

Neutral 主题自动适配明暗模式。

## 原生属性

根元素为 `<div>`。

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。

触发器是根元素内部的 `<button type="button">`，它的 `aria-expanded`、`aria-controls`、`aria-disabled` 与 `tabindex` 由组件维护。禁用时不会使用原生 `disabled`，以便触发器继续被辅助技术感知。
