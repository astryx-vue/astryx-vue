---
title: NavigationStack
---

# NavigationStack

手机布局里一层层往里点的导航：每点一下，新的一屏从后沿滑进来盖住上一屏；按返回、从屏幕边缘或内容里任何地方往回滑，就回到上一屏。推入、退出和滑动返回的手感照着 iOS 做：新屏幕盖上来时，旧屏幕在一层淡淡的阴影下往回挪三分之一；滑到一半松手，按滑了多远、多快决定是退回去还是弹回来。推入从不等动画放完：新屏幕一开始滑进来就能点。系统开启「减少动态效果」时改成淡入淡出。

<script setup lang="ts">
import { labNavigationStack } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labNavigationStack" description="一个设置菜单：根屏幕用大标题，往下点两层后栏的末端出现 Done，按一下直接回到根屏幕。在手机上可以从内容里往右滑返回。" locale="zh" title="设置菜单" /></ClientOnly>

## 导入

```ts
import { NavigationScreen, NavigationStack, useNavigationStack } from '@astryx-vue/lab'
```

## 结构

路径由你保管：`path` 是在根屏幕上推入的条目，最底下的在前。`root` 插槽放根屏幕，`screen` 插槽按条目渲染每一屏，两者都返回一个 `NavigationScreen`。屏幕里的组件用 `useNavigationStack()` 推入、退出。

```vue
<script setup lang="ts">
const path = ref<string[]>([])
</script>

<template>
  <NavigationStack v-model:path="path" label="设置" :get-key="entry => entry">
    <template #root>
      <NavigationScreen title="设置" title-display-mode="large">
        <SettingsList />
      </NavigationScreen>
    </template>
    <template #screen="{ entry }">
      <NavigationScreen :title="entry">
        <SettingsDetail :name="entry" />
      </NavigationScreen>
    </template>
  </NavigationStack>
</template>
```

被盖住的屏幕连同滚动位置都留着，只是变成 `inert`：点不到，读屏也跳过。最上面两层以下的屏幕不再渲染，露出来时再画。

## 动效

| 动作 | 效果 |
| --- | --- |
| 推入 | 新屏幕从后沿滑进来，旧屏幕往回挪三分之一，盖上一层 10% 的黑色阴影。栏里的标题跟着各自的屏幕走；从根屏幕推入时，返回按钮晚 60ms 淡入。 |
| 退出 | 反过来：最上面一屏滑出去，下面那屏从阴影里回到原位。 |
| 滑动返回 | 屏幕跟着手指走。松手时滑过一半、或者往回甩得够快就退出，否则弹回来；往反方向拉会有橡皮筋一样的阻力。 |
| 减少动态效果 | 不滑动，也不压暗：手指操作后是淡入淡出，其余时候直接换屏。 |

时长和弹簧都读主题的动效节奏变量 `--_astryx-motion-tempo`，主题调慢或调快，导航跟着变。

## 焦点

推入后焦点移到新屏幕的标题上，除非用户已经把焦点移进了新屏幕（比如在动画还没停时点了里面的输入框）。退出后焦点回到当初推入这屏的控件；如果那个控件已经不在了，就落到这屏的标题上。焦点只在原本就在栈里、或者已经丢了的时候才移动，不会从页面别处抢走。

## 栏

栏显示最上面一屏的标题、它的 `endContent` 和一个圆形返回按钮，按钮的无障碍名称是要回去的那一屏的标题。用鼠标时栏有自己的背景和底部细线；用手指时栏不画背景，和 iOS 26 一样让内容透出来，等内容在栏下移动 10px 后，屏幕顶部淡入一层和页面同色的遮罩，保证标题看得清。

## 滑动返回

`isInteractivePopEnabled` 开着时（默认开），在内容里任何地方横着拖都能返回，手指、触控笔和鼠标拖动都算。从主屏幕打开的网页应用里，手指从屏幕前沿往里滑也能返回；在普通浏览器标签页里，屏幕边缘留给浏览器自己的返回手势。

## NavigationStack

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `path` | `readonly T[]` | 必填 | 推入的条目，最底下的在前。末尾加一个就推入它的屏幕；去掉最后一个就退出；一次去掉几个就直接退回新的最上面一屏。配合 `v-model:path` 使用。 |
| `getKey` | `(entry: T, index: number) => string \| number` | 条目的位置 | 每个条目的稳定 key，别的屏幕推上来时这屏的状态不丢。 |
| `isInteractivePopEnabled` | `boolean` | `true` | 是否允许滑动返回。 |
| `label` | `string` | `undefined` | 导航区域的无障碍名称。 |

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:path` | `(path: T[])` | 屏幕推入或退出、按了返回、或者滑动返回松手过了临界点时，带着新路径触发。 |

| 插槽 | 参数 | 说明 |
| --- | --- | --- |
| `root` | — | 根屏幕，一个 `NavigationScreen`。它没有返回按钮。 |
| `screen` | `{ entry: T, index: number }` | 按条目渲染的一屏，一个 `NavigationScreen`。 |

## NavigationScreen

`NavigationStack` 的一屏。它自己不渲染任何东西，只是告诉栈这一屏的标题、内容和栏里的内容。

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | 必填 | 这屏在最上面时显示在栏里，屏幕出现时读屏先念它。 |
| `backTitle` | `string` | `title` | 推到这屏上面的那一屏，返回按钮念的名字。 |
| `titleDisplayMode` | `'large' \| 'inline'` | `'inline'` | `'large'` 把标题用大号粗体放在内容上方，跟着内容滚动；滚到栏下面后由栏接着显示标题。顶层屏幕适合用它，和 iOS 一样。 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 屏幕内容。它自己滚动，被盖住时保留滚动位置。 |
| `endContent` | 这屏在最上面时栏末端的内容。 |

## useNavigationStack

在 `NavigationStack` 的屏幕里调用。返回 `push(entry)`、`pop()`、`popToRoot()` 和当前深度 `depth`（根屏幕是 0）。在栈外面调用会报错。

## 使用建议

- 用在手机上一层层往里点的场景：设置列表、文件夹、列表和详情。
- 把路径放在应用状态（或 URL）里，并给条目稳定的 key，栈变化时各屏的状态不会丢。
- 从用户实际按的控件里推入（比如一行的点击事件）：这屏退出后焦点会回到它。
- 不要用它做用户来回切换的顶层分区，那是标签栏或侧边栏的事，它们各自保留自己的导航栈。
