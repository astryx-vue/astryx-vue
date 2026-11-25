---
'@astryx-vue/core': patch
'@astryx-vue/lab': patch
---

Button 跟进上游 #7906（spec:AST-085）：禁用的按钮不再渲染原生 `disabled`。

- Button、IconButton、ToggleButton 禁用时一律标记 `aria-disabled="true"`，留在 Tab 顺序里；聚焦时被禁用也不会把焦点丢到 body。鼠标、Enter、Space 和 `clickAction` / `click` 照样被拦住，其他按键仍传给调用方。
- 真正禁用的 submit 按钮不带 `name`，提交时不会带上它的值。
- ButtonGroup、Toolbar 的成员全部禁用时仍保留一个 Tab 停靠点（`useListFocus` 新增 `hasDisabledTabStop` 选项）。
- Carousel 隐藏的翻页按钮所在容器加上 `inert`，不会成为 Tab 停靠点。
- lab 的 ListInput 禁用或加载中时，重排手柄虽然能聚焦，方向键和拖拽都不再重排。

测试里断言 Button 带 `disabled` 属性的，改成断言 `aria-disabled="true"`。
