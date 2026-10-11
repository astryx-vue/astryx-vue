---
layout: component-docs
title: 引文
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Citation 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>source</code></td>
        <td><code>CitationSource</code></td>
        <td>-</td>
        <td><code>title</code> 是可见标题，空着就回退到编号。<code>url</code> 会渲染成链接。<code>src</code> 是站点图标。<code>icon</code> 是图片地址或 CSS 图标类，优先于 <code>src</code>。</td>
      </tr>
      <tr>
        <td><code>number</code></td>
        <td><code>number</code></td>
        <td>-</td>
        <td>从 1 开始的序号。会读进无障碍名称，数字变体也会显示它。</td>
      </tr>
      <tr>
        <td><code>variant</code></td>
        <td><code>'label' | 'number'</code></td>
        <td><code>'label'</code></td>
        <td><code>label</code> 是带标题的胶囊。<code>number</code> 是紧凑的上标。</td>
      </tr>
    </tbody>
  </table>
</div>

模板引用暴露 <code>element</code>，也就是那个链接或 span。

## 主题

```css
.my-citation {
  --astryx-citation-foreground: #4e606f;
  --astryx-citation-number-background: rgb(0 130 251 / 20%);
}
```

- `--astryx-citation-foreground` / `--astryx-citation-hover-foreground`：默认和悬停时的文字颜色。
- `--astryx-citation-border` / `--astryx-citation-hover`：胶囊边框和悬停底色。
- `--astryx-citation-number-background`：上标底色。
- `--astryx-citation-icon-surface`：label 图标后面的圆。
- `--astryx-citation-focus`：键盘焦点描边。

焦点色和上标底色目前写在引文自己的主题文件里，形状上是强调色，以后可以并进全局强调色。

## 原生属性

属性落到根节点上。有 `source.url` 时根节点是 `<a>`，否则是 `<span>`。`target`、`rel`、`role`、`aria-label` 和 `title` 由组件自己设置。
