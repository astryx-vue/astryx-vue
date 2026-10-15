---
layout: component-docs
title: 下拉菜单勾选项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuCheckboxItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>boolean</code></td>
        <td>-</td>
        <td>是否选中，配合 <code>v-model</code> 使用。数据数组里对应字段是 <code>checked</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>行内的主要文字。需要富文本时改用 <code>label</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>标签下方的次要说明。</td>
      </tr>
      <tr>
        <td><code>icon</code></td>
        <td><code>string | Component</code></td>
        <td>-</td>
        <td>标签前的图标：一个 CSS 图标类，或一个绘制图标的组件。任意内容改用 <code>icon</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用这一行。行仍留在无障碍树里，方向键会跳过它，点击不会切换。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>切换后是否收起菜单。勾选行默认保持打开。</td>
      </tr>
    </tbody>
  </table>
</div>

行的角色是 `menuitemcheckbox`，选中状态写在 `aria-checked` 上。勾选标记是装饰，不单独接收点击。快捷键提示一类的尾部内容放在 `endContent` 插槽里。
