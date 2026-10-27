---
title: 升级指南
---

# 升级指南

本版本对齐 Astryx v0.7.1，上一版本对齐 0.4.1。

下文梳理升级涉及的核心变更。按四项内容说明：变更内容、旧版写法、新版写法及迁移建议。

多数业务项目主要涉及以下三项修改：

1. 将 `labelHidden` 属性统一替换为 `isLabelHidden`。
2. 将 `useDismiss` 的配置项 `enableEscape` 替换为 `dismissOnEscape`。
3. 将自定义主题配置中的旧组件键名替换为标准连字符格式。

## 样式与主题

### `reset.css` 现在是完整的全局 reset

**变了什么**：`@astryx-vue/core/reset.css` 以前只有一行，用来声明 CSS 层级顺序。现在是一份完整的全局 reset，和 Tailwind Preflight 是同一类东西（上游 #7355）。

**以前**：为了拿到层级顺序，所以引入它。

```ts
import '@astryx-vue/core/reset.css'
import '@astryx-vue/core/styles.css'
```

**现在**：每份样式表的第一行自己声明层级顺序，不再需要靠 `reset.css`。而引入它以后，整个页面上普通标签的默认样式会变：标题、段落、列表没有默认外边距，列表没有圆点，图片和 `svg` 变成块级，表单控件继承字体和颜色，按钮去掉浏览器外观，占位文字不再变淡。

**怎么改**：

- 只是想定层级顺序：删掉这一行。组件不依赖它。
- 想要一套浏览器一致的起点：保留。规则都在最低的 `astryx.reset` 层，选择器优先级是 0，你自己的样式随时能盖掉。
- 只想让某一块干净：不要引这个文件，给那一块自己写样式。

细节见 [安装](/guide/installation)。

### 间距 token 从 px 改成 rem

**变了什么**：`--astryx-spacing-*` 的单位从 `px` 改成 `rem`，数值跟着换算。全套主题都改了，包括 Matcha 和 Y2K（上游 #7359 #7374）。

**以前**：

```css
--astryx-spacing-1: 4px;
--astryx-spacing-4: 16px;
```

**现在**：

```css
--astryx-spacing-1: 0.25rem;
--astryx-spacing-4: 1rem;
```

**怎么改**：浏览器默认根字号是 16px，这时看起来完全一样，多数项目不用动。会变的只有两种情况：

- 页面自己写了 `html { font-size: ... }`：组件的间距和内边距会按同样比例放大或缩小。这是这次改动想要的效果。
- 自己的主题用 px 写间距：那几档仍然固定不变。想跟着根字号走，就改写成 rem。

细节见 [间距、圆角与阴影](/themes/scale)。

### 自定义主题里的挂点名改名

**变了什么**：一批旧的挂点名删掉了，改用带连字符的新名字。写驼峰（比如 `buttonIcon`）或者大写开头（比如 `Card`）会直接报错（上游 #7302）。

**以前**：

```ts
defineTheme({
  name: 'brand',
  components: {
    progressbar: { base: { color: 'var(--brand-ink)' } },
    textarea: { base: { borderRadius: '8px' } },
  },
})
```

**现在**：

```ts
defineTheme({
  name: 'brand',
  components: {
    'progress-bar': { base: { color: 'var(--brand-ink)' } },
    'text-area': { base: { borderRadius: '8px' } },
  },
})
```

**怎么改**：全局搜 `components:` 里的键，对着下面这张表改名。

| 已删除 | 请改用 |
| --- | --- |
| `base-table` | `table` |
| `checkbox` | `checkbox-indicator` |
| `codeblock`、`codeblock-copy-button`、`codeblock-header`、`codeblock-title` | `code-block`、`code-block-copy-button`、`code-block-header`、`code-block-title` |
| `date-input-clear-icon`、`date-range-input-clear-icon`、`multi-selector-clear-icon`、`selector-clear-icon` | `input-clear-icon` |
| `hovercard` | `hover-card` |
| `navicon` | `nav-icon` |
| `popover-surface` | `popover` |
| `progressbar`、`progressbar-fill`、`progressbar-mark`、`progressbar-track` | `progress-bar`、`progress-bar-fill`、`progress-bar-mark`、`progress-bar-track` |
| `radio`、`radio-dot` | `radio-indicator`、`radio-indicator-dot` |
| `statusdot` | `status-dot` |
| `textarea` | `text-area` |

表里的旧名字本身写法合法，所以不会报错，但已经没有组件用它，写了不生效。完整说明见 [扩展主题](/themes/extending)。

### 组件不再输出 `primary`、`sm` 这类裸类名

**变了什么**：Button 这类组件不再往元素上加 `.primary`、`.secondary`、`.ghost`、`.destructive`、`.sm`、`.md`、`.lg`。这些信息改用 `[data-variant]`、`[data-size]` 属性（上游 #6121）。

**以前**：

```css
.my-toolbar .astryx-button.primary {
  border-radius: 999px;
}
```

**现在**：

```css
.my-toolbar .astryx-button[data-variant='primary'] {
  border-radius: 999px;
}
```

**怎么改**：搜自己的样式表里「组件类名 + 变体词」的组合，改成属性选择器（`[data-variant]`、`[data-size]`）。

## 组件 API

### `labelHidden` 改名 `isLabelHidden`

**变了什么**：隐藏字段标签的属性正名是 `isLabelHidden`。旧名 `labelHidden` 还留着，之后的版本会删。

**以前**：

```vue
<TextInput v-model="name" label="名字" labelHidden />
```

**现在**：

```vue
<TextInput v-model="name" label="名字" is-label-hidden />
```

**怎么改**：把 `label-hidden` 换成 `is-label-hidden`。涉及的组件：Typeahead、Tokenizer、MultiSelector、Token、PowerSearch、DateInput、DateRangeInput、DateTimeInput、TimeInput。

PowerSearch 默认就是隐藏标签。它的规则有点特别：两个名字都传时听新名；只传旧名时听旧名；都没传就保持隐藏。其余组件是两个名字任一为真就隐藏。

### Selector 的 `variant="default"` 改名 `variant="input"`

**变了什么**：带边框的输入框那一档，正名是 `input`。`default` 是旧名，还留着。

**以前**：

```vue
<Selector v-model="fruit" :options="options" variant="default" />
```

**现在**：

```vue
<Selector v-model="fruit" :options="options" variant="input" />
```

**怎么改**：把 `variant="default"` 换成 `variant="input"`。不传 `variant` 时行为和以前一样，仍然是带边框的输入框。`default` 这个值暂时还能用，之后的版本会删。

MultiSelector、ComplexSelector 只有 `input`、`secondary`、`ghost` 三档，不用改。

### 新增四个样式分层属性

**变了什么**：输入类组件新增 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`（上游 #7336 #7339 #7337 #7341）。

一个输入控件有两个可以加样式的地方：

- 外壳：包着标签、控件和状态消息的那一层，用 `container*`。
- 本体：画边框和背景、里面装着图标和清除按钮的那个盒子，用 `control*`。

适用的组件：TextInput、TextArea、NumberInput、FileInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、Typeahead、Tokenizer、Selector、MultiSelector、ComplexSelector、CheckboxList、RadioGroup、RadioList、Slider、PowerSearch。

**以前**：只能在组件根上写 `class`，落到哪里要看具体组件。

```vue
<TextInput v-model="name" label="名字" class="mt-4" />
```

**现在**：想把样式放到外壳或本体，用新属性。

```vue
<TextInput
  v-model="name"
  label="名字"
  container-class="mt-4"
  control-class="font-mono"
/>
```

**怎么改**：不用改也能跑。根上直接写的 `class` / `style` 保持各组件今天的落点，不会被丢掉，也不会警告——这一点和上游不同，上游会丢掉并提示改用 `control*`。只有当你发现样式落错了地方，才换成 `container*` 或 `control*`。

注意两件事：

- `container*` 只在有外壳的时候生效。放进 `InputGroup`，或者横向标签的 `FormLayout` 里时没有外壳，这时它不生效，开发环境会警告一次。
- `control*` 永远不会落到原生 `input` 上。

### `useDismiss` 的 `enableEscape` 换成 `dismissOnEscape`

**变了什么**：原来只问「要不要响应 Escape」，现在问「Escape 到了这一层该怎么处理」（上游 #4881）。

**以前**：

```ts
useDismiss({
  container,
  isEnabled,
  enableEscape: true,
  onDismiss: close,
})
```

**现在**：

```ts
useDismiss({
  container,
  isEnabled,
  dismissOnEscape: 'close',
  onDismiss: close,
})
```

三个取值：

- `'close'`：关掉这一层。不传就是这个。
- `'block'`：吃掉这次按键，但不关。
- `'ignore'`：不管这次按键，留给会自己 `preventDefault` 的输入组件。

**怎么改**：`true` 换成不传或 `'close'`。`false` 要分情况：想让 Escape 在这一层停住，用 `'block'`；想让按键继续往下走，用 `'ignore'`。

## 行为变化

### Tab、TabMenu 必须放在 TabList 里，Step 必须放在 Stepper 里

**变了什么**：以前把 `Tab` 放在 `TabList` 外面，会静默退化，不报错。现在会直接抛错。浮层边界把成员关系重置掉的情况也一样（上游 #6457）。

**以前**：先渲染一个 `Tab`，外面没有 `TabList`，页面照常出现，只是键盘操作不对。

**现在**：抛出 `useTabListContext must be used within TabList`。`Step` 在 `Stepper` 外面会抛 `useStepperContext must be used within Stepper`。

**怎么改**：把成员包进对应的容器。如果在浮层内容里再用一次，就在浮层里再放一层本地的 `TabList` 或 `Stepper`——浮层是新的成员边界，外面的容器不算数。

### `useAstryxLocale()` 可能返回带地区的标签

**变了什么**：语言标签现在保留地区。`en-gb` 收成 `en-GB`，`ja-jp` 收成 `ja-JP`，日期和数字按这个地区的习惯排。

`zh`、`zh-CN`、`zh-Hans` 仍然收成 `zh-CN`。认不出来的标签回到 `en`。

**以前**：`useAstryxLocale()` 返回的一定是 `en` 或 `zh-CN` 这样的短标签。

**现在**：

```ts
const locale = useAstryxLocale()
locale.value === 'en' // en-GB 时是 false
```

**怎么改**：不要用等号比整个标签，改成看开头。

```ts
const locale = useAstryxLocale()
locale.value.startsWith('zh') // 中文
```

### 导航菜单开始透传属性

**变了什么**：`NavHeadingMenu`、`NavHeadingMenuItem` 以前会忽略根上写的 `id`、`aria-*`、`data-*` 和事件监听。现在这些都会落到菜单元素上（上游 #7331）。

**怎么改**：不用改。但如果你以前因为这些属性不生效，绕开写了别的方案（比如在外面套一层再查 DOM），现在可能会重复，检查一下就能删掉。

## 文案与语言

### 不传名字时，默认名字跟当前语言

**变了什么**：下拉菜单、快捷菜单、更多选项、对话框关闭按钮、提示条展开/收起、开关加载中，这些没写在 props 里的默认无障碍名字，现在跟着当前语言走（上游 #6125 #7289）。

**以前**：不管页面是什么语言，读屏读到的都是英文 `Menu`、`Context menu`、`More options`、`Close`、`Expand`、`Collapse`、`Loading`。

**现在**：中文页面得到「菜单」「快捷菜单」「更多选项」「关闭」「展开」「收起」「加载中」。英文页面仍然是原来那几句。

**怎么改**：如果你的测试或脚本依赖那几句固定英文，就自己传进去：`label`、`closeButtonLabel`、`loadingLabel`、`expandLabel`、`collapseLabel`。

### 英文内置文案逐字对齐原版

**变了什么**：内置英文文案改成和原版一字不差。中文文案也有对应调整。

下面是用户看得见、也确实变了的几条：

| 组件 | 以前 | 现在 |
| --- | --- | --- |
| SideNav | Sidebar | Side navigation |
| AppShell 手机端导航、手机抽屉 | Navigation | Mobile navigation |
| MobileNav 关闭按钮 | Close | Close navigation |
| Selector、MultiSelector 没有选项 | No matches | No options |
| Selector、MultiSelector 只读 | Read-only | Read only |
| PowerSearch 数字等于 / 不等于 | equals / does not equal | is / is not |
| Typeahead 清除按钮 | Clear | Clear selection |
| Typeahead、Tokenizer 加载中 | Loading results | Loading |
| DateInput 日期不可用 | That date is not available | Invalid date |
| Pagination 首末页按钮 | First page / Last page | Go to first page / Go to last page |
| Stepper 状态词 | Completed / Warning / Error | completed / warning / error |

FileInput 的三条报错和 Calendar 的三句日期范围播报也改了，都改成原版的句子。

**怎么改**：自己写的断言要跟着改。如果这些文字由你的文案覆盖，就不用动。

### 数字到一千以上加千分位

**变了什么**：内置文案里的数字按当前语言加千分位，比如 `1234` 变成 `1,234`。

涉及 Pagination 的页码和总数、Selector 和 MultiSelector 的结果数、Carousel 的序号、CommandPalette 的结果数、Lightbox 的位置、AvatarGroup 的溢出数、表格选中数、Stepper 的步骤号。

**怎么改**：断言这些文字的地方跟着改。

## 不用改的地方

下面这些上游的破坏性改动，Vue 版没有对应的东西，不用做任何事。

- 命令行的 `astryx layout` 命令组：我们没有这个命令。
- `astryx doctor` 不再读 agent 相关的环境变量：我们没有这个行为。
- `emptySearchResultsText`、`useResizable` 的 `minSizePx` / `maxSizePx`、`useGridFocus` / `useListFocus` 的 `isRtl`、从 hooks 导出的 `isImeKeyEvent`：这些名字在当前 Vue 版里都不存在，写了也不会生效。对应位置请用 `emptySearchText`、`minSize` / `maxSize`。
