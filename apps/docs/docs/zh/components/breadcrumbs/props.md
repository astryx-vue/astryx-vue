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
        <td>是否为当前页，渲染为 <code>&lt;span&gt;</code> 并添加 <code>aria-current="page"</code>。</td>
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
        <td>文本前的图标。</td>
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
