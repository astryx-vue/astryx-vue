---
layout: component-docs
title: 国际化 Provider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { internationalizationProviderOverrides } from '../../../../components/demos/internationalization-provider'
</script>

## 使用方法

把整个应用包起来，告诉里面的组件现在用哪种语言，顺便可以塞进更多翻译目录，或者针对某种语言改几个词。子树里的组件都按这份设置取文案。没有这个 provider 时，组件就用内置的英文。

```ts
import { InternationalizationProvider } from '@astryx-vue/core/InternationalizationProvider'
```

`messages` 和 `overrides` 都是「语言标签 → 目录」的映射，目录里的键就是原版那套 `@astryx.*`。也就是说，整门语言的 JSON 和只想改几个键的小对象是同一个写法。两层按同一个键合并：`messages` 里的目录替换这门语言的内置文案，`overrides` 再稀疏地盖在上面。覆盖是按语言存的，所以运行时换语言会自动用上对的那一份。

`dir` 只决定 Astryx 组件读到的书写方向，不会去动 DOM 的 `dir` 属性。要自己给 `<html>` 或者外层元素设上 `dir`，并且两边写一样的值。`getLocaleDirection(locale)` 可以按语言标签算出这个值。

可以嵌套：内层的 provider 管住自己那一段子树。

## 建议

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | 目标语言有整份目录时，把整份目录交给 `messages`，形状和原版的 locale JSON 一致。 |
| <Badge variant="success">Do</Badge> | 只有在原版还没出这门语言，或者你在试还没翻完的文案时，才自己写一份同形状的本地目录。 |
| <Badge variant="success">Do</Badge> | 用真的 BCP 47 标签，例如 `fr-FR`、`pt-BR`、`ar-SA`。带地区的标签会先退回它的基础语言，最后才退回英文。 |
| <Badge variant="success">Do</Badge> | 自己给 `<html>`（或外层元素）设 `dir`，provider 不会帮你设。用 `getLocaleDirection(locale)` 算出这个值，provider 和 DOM 两边写一样的。 |
| <Badge variant="error">Don't</Badge> | 不要把自定义目录强转成 `any`；`ProviderMessagesByLocale` 和 `ProviderOverrides` 就是给本地目录用的类型。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="internationalizationProviderOverrides" title="InternationalizationProvider — Overrides" description="不提供整份语言目录，只替换少数几句 Astryx 文案。" locale="zh" />
