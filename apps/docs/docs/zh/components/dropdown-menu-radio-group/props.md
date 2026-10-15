---
layout: component-docs
title: 下拉菜单单选组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="DropdownMenuRadioGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>modelValue</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>当前选中的值，配合 <code>v-model</code> 使用。留空表示还没有选中。数据数组里字段名同样是 <code>value</code>。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>这一组的无障碍名称。选项会作为同一组被朗读。</td>
      </tr>
      <tr>
        <td><code>hasCloseOnSelect</code></td>
        <td><code>boolean</code></td>
        <td><code>true</code></td>
        <td>选中一项后是否收起菜单。单选默认收起。</td>
      </tr>
    </tbody>
  </table>
</div>

子项是 [下拉菜单单选项](/components/dropdown-menu-radio-item)。组渲染为 `role="group"`，并把 `label` 写到 `aria-label` 上。
