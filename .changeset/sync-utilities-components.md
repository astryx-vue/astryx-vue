---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

CheckboxList 新增 `isRequired` 的实际校验：一项都没勾时第一个可用的复选框带原生 required，浏览器拦住提交并把焦点移过去，重排后跟着新的第一项；禁用或只读的链接行（List 的 Item、TreeList）不再有 href 和 target，也不走路由链接组件，焦点在上面时被禁用，焦点会交给换出来的元素；TreeList 没有任何动作的普通行拿到键盘焦点时画出焦点环，子级行的焦点不再让上级行也画环；DropdownMenuSubMenu 的标签用插槽写成富内容时，展开的视图用标签命名，嵌套视图的返回行也按这个标签的文字写。
