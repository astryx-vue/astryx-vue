---
layout: component-docs
title: useTableColumnsVirtualization
outline: false
footer: false
---

配置是 `MaybeRefOrGetter`，传 getter 或 ref，插件就能一直读到最新的值。

## 参数

<div class="component-api-table" role="region" aria-label="useTableColumnsVirtualization 参数" tabindex="0">
  <table>
    <thead>
      <tr><th>参数</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>initialViewportWidth</code></td>
        <td><code>number</code></td>
        <td>—</td>
        <td>首帧（服务端渲染、还没量到滚动区时）用来估算要渲染几列的视口宽度（CSS 像素）。它不决定表格多宽。</td>
      </tr>
    </tbody>
  </table>
</div>

## 返回值

<div class="component-api-table" role="region" aria-label="useTableColumnsVirtualization 返回值" tabindex="0">
  <table>
    <thead>
      <tr><th>字段</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>rowModel</code></td>
        <td><code>'flat'</code></td>
        <td>声明这个插件只处理扁平行。</td>
      </tr>
      <tr>
        <td><code>virtualization</code></td>
        <td><code>TableVirtualizationContribution</code></td>
        <td>把初始视口宽度交给表格。表格据此决定挂载哪些列，条件不满足时退回渲染所有列。</td>
      </tr>
    </tbody>
  </table>
</div>
