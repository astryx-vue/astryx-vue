---
layout: component-docs
title: 面包屑
outline: false
footer: false
---

## Breadcrumbs Props

<div class="component-api-table" role="region" aria-label="Breadcrumbs Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>separator</code></td>
        <td><code>string</code></td>
        <td><code>'/'</code></td>
        <td>分隔符，仅装饰用途。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>BreadcrumbsVariant</code></td>
        <td><code>'default'</code></td>
        <td>视觉变体，可选 default、supporting。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td><code>'Breadcrumb'</code></td>
        <td>导航地标的可访问标签。</td>
      </tr>
    </tbody>
  </table>
</div>

## Breadcrumbs Slots

<div class="component-api-table" role="region" aria-label="Breadcrumbs Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td><code>BreadcrumbItem</code> 列表。</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Props

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>href</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>链接地址。未提供时渲染为按钮。</td>
      </tr>
      <tr>
        <td><code>isCurrent</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>是否为当前页，渲染为 <code>&lt;span&gt;</code> 并添加 <code>aria-current="page"</code>。当前页仍然可以打开菜单。</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td><code>BreadcrumbMenuOption[]</code></td>
        <td>-</td>
        <td>把这一项变成菜单触发器，数组和下拉菜单的数据条目相同，包括勾选行和单选组。与链接地址互斥，给出菜单时忽略链接。写了菜单插槽时忽略这个数组。</td>
      </tr>
      <tr>
        <td><code>menuSize</code></td>
        <td><code>'sm' | 'md' | 'lg'</code></td>
        <td>supporting 变体为 <code>sm</code>，否则为 <code>md</code></td>
        <td>菜单行的尺寸。</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem Slots

<div class="component-api-table" role="region" aria-label="BreadcrumbItem Slots" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>default</code></td>
        <td>面包屑项文本。</td>
      </tr>
      <tr>
        <td><code>startIcon</code></td>
        <td>文本前的图标。可以使用内置图标组件。</td>
      </tr>
      <tr>
        <td><code>menu</code></td>
        <td>自己写的菜单内容，包括勾选行和单选组。组件名为 <code>BreadcrumbMenuCheckboxItem</code>、<code>BreadcrumbMenuRadioGroup</code>、<code>BreadcrumbMenuRadioItem</code>。有这个插槽时不再使用 <code>menu</code> 数组。</td>
      </tr>
    </tbody>
  </table>
</div>

## BreadcrumbItem 事件

<div class="component-api-table" role="region" aria-label="BreadcrumbItem 事件" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>click</code></td>
        <td>点击时触发。当前页不会触发。</td>
      </tr>
    </tbody>
  </table>
</div>
