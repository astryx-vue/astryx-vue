# astryx-vue

astryx-vue 是 Astryx 设计系统的非官方 Vue 社区版本。

当前提供 Button、IconButton、ButtonGroup、Stack 系列、Badge、Blockquote、Skeleton、VisuallyHidden，以及 TextInput、CheckboxInput、CheckboxIndicator、Slider、Banner、Field、FieldLabel 和 FieldStatus。组件使用 Vue 3 原生 API，文档包含可交互示例和中英文说明。

## 已确定的包

- `@astryx-vue/core`：Vue 组件、共用代码、类型和组件样式。
- `@astryx-vue/themes`：所有主题；当前暂时只提供 Neutral。

Neutral 主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```

## 说明

- 本项目不是 Meta 官方项目。
- 原版 Astryx：<https://github.com/facebook/astryx>
- 本项目使用 MIT 许可证，并保留原版和第三方内容的许可证说明。

## 开发

使用 Node.js 22.18+ 和 pnpm。

```sh
pnpm install
pnpm dev
pnpm check
```

- Vite：开发服务器和应用构建。
- tsdown + unplugin-vue：组件包构建，生成 ESM 和 Vue 类型声明。
- Vitest：组件与组合式函数测试。
- ESLint + antfu config：代码检查。
- VitePress：中英文文档与原生 Vue 示例。

`pnpm docs:preview` 可预览已经构建的文档。

TypeScript 7 用于普通 `tsc` 检查；ESLint 和 Vue 类型工具通过官方 `@typescript/typescript6` 兼容包使用 TypeScript 编译器 API。两者使用 npm alias 并装，版本统一保存在 `pnpm-workspace.yaml`。
