---
layout: component-docs
title: 图标
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="图标属性" tabindex="0">
<table><thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>Iconify 的 id，格式是 <code>集合:图标</code>。carbon 集合注册之后，<code>carbon-settings</code> 与 <code>carbon:settings</code> 相同。集合名里带连字符时请保留冒号。</td></tr>
<tr><td><code>icon</code></td><td><code>string | Component</code></td><td>—</td><td>语义名、CSS 图标类，或你自己的组件。语义名由最近的主题换成 Iconify id；该图标尚未注册时用内置字形。设置了 <code>name</code> 时忽略它。</td></tr>
<tr><td><code>color</code></td><td><code>'inherit' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'info' | 'success' | 'error' | 'warning' | 'blue' | 'cyan' | 'green' | 'gray' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'</code></td><td><code>'inherit'</code></td><td>决定图标里 <code>currentColor</code> 解析成哪种颜色。<code>inherit</code> 保持周围文字的颜色。</td></tr>
<tr><td><code>size</code></td><td><code>'xsm' | 'sm' | 'md' | 'lg'</code></td><td>—</td><td>根字号 16px 时分别是 12px、16px、20px、24px。不传时，<code>name</code> 图标是 <code>1em</code>。其他图标在没有父级尺寸时回退到 <code>md</code>。主题在 <code>components.icon['size:sm']</code>（以及其他尺寸）上用 px 或 rem 写 <code>width</code> 和 <code>height</code>，就能改这一档的尺寸。</td></tr>
<tr><td><code>variant</code></td><td><code>IconVariant</code></td><td>—</td><td>向最近的主题要这个语义名的另一种画法，比如 <code>filled</code>。只有主题在 <code>iconVariants</code> 里列了它，主题的函数条目才收得到；否则画普通的样子。不会写进 DOM。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>有含义的图标的无障碍名称。会设置 <code>role="img"</code> 和 <code>aria-label</code>。装饰性图标省略它，保持 <code>aria-hidden="true"</code>。空字符串仍按装饰处理。</td></tr>
</tbody></table>
</div>

## 插槽

- 默认插槽：内联 SVG。在既没有 <code>name</code> 也没有 <code>icon</code> 时使用。

## 注册

<div class="component-api-table" role="region" aria-label="图标注册" tabindex="0">
<table><thead><tr><th>名称</th><th>来自</th><th>说明</th></tr></thead><tbody>
<tr><td><code>astryxIcons()</code></td><td><code>@astryx-vue/core/icons</code></td><td>Vite 插件。扫描静态名字，只从已安装的 <code>@iconify-json/*</code> 打包这些图标。用 <code>collections</code> 限制读取哪些前缀。</td></tr>
<tr><td><code>addIcon(name, data)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>注册一枚图标。<code>name</code> 是 <code>集合:图标</code>。<code>data.body</code> 是 SVG 内部标记。</td></tr>
<tr><td><code>addCollection(collection)</code></td><td><code>@astryx-vue/core/Icon</code></td><td>注册一份 <code>@iconify-json</code> 文档。整套集合都会进入包。</td></tr>
</tbody></table>
</div>

## 语义名

`defineTheme({ icons })` 按名字覆盖。和被扩展的主题浅合并，当前这份优先。没写到的名字保持默认 id。集合要已经注册，否则仍画内置字形。

<div class="component-api-table" role="region" aria-label="语义图标" tabindex="0">
<table><thead><tr><th>名字</th><th>默认 Iconify id</th></tr></thead><tbody>
<tr><td><code>close</code></td><td><code>lucide:x</code></td></tr>
<tr><td><code>chevronDown</code></td><td><code>lucide:chevron-down</code></td></tr>
<tr><td><code>chevronLeft</code></td><td><code>lucide:chevron-left</code></td></tr>
<tr><td><code>chevronRight</code></td><td><code>lucide:chevron-right</code></td></tr>
<tr><td><code>chevronsLeft</code></td><td><code>lucide:chevrons-left</code></td></tr>
<tr><td><code>chevronsRight</code></td><td><code>lucide:chevrons-right</code></td></tr>
<tr><td><code>check</code></td><td><code>lucide:check</code></td></tr>
<tr><td><code>success</code></td><td><code>lucide:circle-check</code></td></tr>
<tr><td><code>error</code></td><td><code>lucide:circle-x</code></td></tr>
<tr><td><code>warning</code></td><td><code>lucide:triangle-alert</code></td></tr>
<tr><td><code>info</code></td><td><code>lucide:info</code></td></tr>
<tr><td><code>calendar</code></td><td><code>lucide:calendar</code></td></tr>
<tr><td><code>clock</code></td><td><code>lucide:clock</code></td></tr>
<tr><td><code>externalLink</code></td><td><code>lucide:external-link</code></td></tr>
<tr><td><code>menu</code></td><td><code>lucide:menu</code></td></tr>
<tr><td><code>moreHorizontal</code></td><td><code>lucide:ellipsis</code></td></tr>
<tr><td><code>search</code></td><td><code>lucide:search</code></td></tr>
<tr><td><code>upload</code></td><td><code>lucide:upload</code></td></tr>
<tr><td><code>arrowUp</code></td><td><code>lucide:arrow-up</code></td></tr>
<tr><td><code>arrowDown</code></td><td><code>lucide:arrow-down</code></td></tr>
<tr><td><code>arrowsUpDown</code></td><td><code>lucide:arrow-up-down</code></td></tr>
<tr><td><code>funnel</code></td><td><code>lucide:funnel</code></td></tr>
<tr><td><code>eyeSlash</code></td><td><code>lucide:eye-off</code></td></tr>
<tr><td><code>viewColumns</code></td><td><code>lucide:columns-3</code></td></tr>
<tr><td><code>copy</code></td><td><code>lucide:copy</code></td></tr>
<tr><td><code>checkDouble</code></td><td><code>lucide:check-check</code></td></tr>
<tr><td><code>wrench</code></td><td><code>lucide:wrench</code></td></tr>
<tr><td><code>stop</code></td><td><code>lucide:square</code></td></tr>
<tr><td><code>microphone</code></td><td><code>lucide:mic</code></td></tr>
<tr><td><code>image</code></td><td><code>lucide:image</code></td></tr>
</tbody></table>
</div>

表里这些是**共享名字**，所有组件共用一套。`IconRegistry` 类型表示「每个共享名字都画了」的完整注册表，`upload` 也在必填之列。自己写一整套主题图标时，要给 `upload` 单独配一个上传图形，不能拿 `arrowUp` 顶替。换 `upload` 不会影响表格排序箭头或发送按钮用的 `arrowUp`。

只有某一个组件自己用的图标，不进共享名字，而是用带命名空间的键，写成 `组件:用途`，类型是 `NamespacedIconName`。现在有一个：

<div class="component-api-table" role="region" aria-label="组件自有图标" tabindex="0">
<table><thead><tr><th>键</th><th>用在哪里</th></tr></thead><tbody>
<tr><td><code>numberInput:stepperDown</code></td><td>NumberInput 的加减按钮。向下的小箭头，加号那一格把它翻过来用。</td></tr>
</tbody></table>
</div>

主题用同一个 `icons` 覆盖它：`defineTheme({ icons: { 'numberInput:stepperDown': 'carbon:chevron-down' } })`。不覆盖时用内置字形。加新的命名空间键不会让 `IconRegistry` 多出必填项。

`useSemanticIcon(name)` 从 `@astryx-vue/core/Icon` 引入，也从包根导出。未知字符串、主题也没有覆盖时，返回空，调用方可以继续把它当 CSS 类。

### 跟着尺寸变的条目

`icons` 里的条目也可以是一个函数，参数是 `{ size, variant }`，返回 Iconify id。`Icon` 用它实际画的尺寸去调用，所以主题可以在 `sm` 时换一个笔画更粗的图形。函数的回答就是最终结果：返回 `null` 就什么都不画，不会退回默认 id。`theme.icons` 和 `useSemanticIcon` 按 `md` 读函数。

```ts
const brand = defineTheme({
  name: 'brand',
  iconVariants: ['outline', 'filled'],
  icons: {
    info: ({ size, variant }) => variant === 'filled'
      ? 'mdi:information'
      : size === 'sm' ? 'carbon:information-filled' : 'carbon:information',
  },
})
```

`iconVariants` 是整个主题支持的变体名单，只写一次。子主题不写就继承，写了就整份替换。继承来的函数只收得到定义它的那个主题列过的变体。应用用到哪些变体名，就在 `@astryx-vue/core/Icon` 上扩充 `IconVariantMap` 来声明。

### 组件图标槽位

槽位说的是「某个组件里这个图标是干什么的」。`defineTheme({ componentIcons })` 把槽位指向一个共享名字，不会改动这个名字在别处的画法。值可以是共享名字、`null`（隐藏图形）、部分的 `{ icon, variant, size }` 请求，或者一个以槽位状态为参数、返回请求的纯函数。请求里没写的字段保持组件自己的值；写错的字段会被忽略，开发环境下提示一次。

<div class="component-api-table" role="region" aria-label="组件图标槽位" tabindex="0">
<table><thead><tr><th>槽位</th><th>状态</th><th>默认</th><th>设为 <code>null</code> 时</th></tr></thead><tbody>
<tr><td><code>code-block-copy</code></td><td><code>{ copied }</code></td><td><code>copy</code>，复制后显示 <code>check</code></td><td>复制按钮保留名称、提示和复制功能。</td></tr>
<tr><td><code>timestamp-copy</code></td><td><code>{ copied }</code></td><td><code>copy</code>，复制后显示 <code>check</code></td><td>悬浮卡片里的复制按钮保留名称和功能。</td></tr>
<tr><td><code>table-sort-indicator</code></td><td><code>{ direction }</code>：<code>ascending</code>、<code>descending</code> 或 <code>none</code></td><td>降序 <code>arrowDown</code>，其余 <code>arrowUp</code></td><td>排序按钮保留文字和排序功能，表头保留 <code>aria-sort</code>，文字旁不留空隙。</td></tr>
<tr><td><code>table-row-expand</code></td><td><code>{ expanded }</code></td><td><code>chevronRight</code>，展开时转 90°</td><td>展开按钮保留尺寸、名称和 <code>aria-expanded</code>。换成更大的图形也不会撑高行。</td></tr>
</tbody></table>
</div>

```ts
defineTheme({
  name: 'brand',
  componentIcons: {
    'code-block-copy': ({ copied }) => ({ icon: copied ? 'checkDouble' : 'copy' }),
  },
})
```

`theme.componentIcons` 能读回名字、`null` 和静态请求；用函数决定的槽位不在里面。

## 主题

颜色走图标令牌。主题在根上覆盖对应变量即可。

```css
.my-theme {
  --astryx-icon-accent-foreground: #0074e2;
}
```

- `--astryx-icon-primary-foreground`
- `--astryx-icon-secondary-foreground`
- `--astryx-icon-disabled-foreground`
- `--astryx-icon-accent-foreground`
- `--astryx-icon-success-foreground`
- `--astryx-icon-error-foreground`
- `--astryx-icon-warning-foreground`
- `--astryx-icon-blue-foreground`，cyan、green、gray、orange、pink、purple、red、teal、yellow 同样是这个形式。

## 无障碍

根元素是 `<span>`。没有 `label` 时为 `aria-hidden="true"`。`label` 非空时为 `role="img"`，这段文字就是无障碍名称。内部 SVG 始终 `aria-hidden`。

`class` 和 `style` 会落到根元素上。`name` 不会：它用来选择图标。

在 `Icon` 上挂模板 ref，可以拿到 `element`（根盒子）和 `svg`（渲染出的 `<svg>`）。图形没有 `<svg>` 时（比如内置字形）`svg` 是 `null`；图形换了，它也跟着换。
