---
layout: component-docs
title: 缩略图
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Thumbnail 属性" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>src</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>图片地址。加载失败时，这一张回退到占位图。</td>
      </tr>
      <tr>
        <td><code>alt</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>图片的替代文字。</td>
      </tr>
      <tr>
        <td><code>label</code></td>
        <td><code>string</code></td>
        <td>-</td>
        <td>无障碍名称，不画出来。提示和移除按钮都会用到。</td>
      </tr>
      <tr>
        <td><code>isLoading</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>没有 <code>src</code> 时是骨架。有图片时在上面盖加载指示。</td>
      </tr>
      <tr>
        <td><code>isDisabled</code></td>
        <td><code>boolean</code></td>
        <td><code>false</code></td>
        <td>把缩略图调淡，并忽略点击和移除。</td>
      </tr>
      <tr>
        <td><code>showRemoveOn</code></td>
        <td><code>'always' | 'hover'</code></td>
        <td><code>'hover'</code></td>
        <td>移除按钮何时可见。<code>hover</code> 在键盘焦点时也会出现，粗指针设备上则一直可见。</td>
      </tr>
    </tbody>
  </table>
</div>

## 事件

| 名称 | 参数 | 时机 |
| --- | --- | --- |
| <code>click</code> | <code>MouseEvent</code> | 预览被激活，且没有禁用、也没有在加载。 |
| <code>remove</code> | <code>MouseEvent</code> | 使用移除按钮。只有监听了这个事件才会渲染按钮。 |

## 主题

方块是 64px，圆角用元素圆角，底色是中性色。边框 1px，画在内侧。占位图标 24px。移除按钮 20×20，距上沿和结束沿一个间距台阶，背景是遮罩色，图标是深色底上的浅色。粗指针会把点击区域向外扩 2px。禁用时不透明度为 0.5。
