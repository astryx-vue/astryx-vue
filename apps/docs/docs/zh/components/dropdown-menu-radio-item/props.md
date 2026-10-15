---
layout: component-docs
title: 下拉菜单单选项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>value</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这个选项代表的值。必须放在单选组里面，否则组件会在初始化时抛出错误。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string | number</code></td>
        <td>-</td>
        <td>行内的主要文字。</td>
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
        <td>标签前的图标。任意内容改用 <code>icon</code> 插槽。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>禁用这个选项。它仍留在组里，但不能被选中。</td>
      </tr>
    </tbody>
  </table>
</div>

行的角色是 `menuitemradio`。选中后是否收起菜单由所在的组决定。尾部内容放在 `endContent` 插槽里。
