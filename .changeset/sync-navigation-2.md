---
'@astryx-vue/core': minor
'@astryx-vue/cli': minor
---

Pagination 新增 `getPageHref` 和 `as`：页码、上一页、下一页、首页、末页渲染成指向各页地址的链接，可在新标签页打开、复制地址，带修饰键或在别处打开的点击不换页；圆点改成单选组（`radiogroup` 加 `radio`），控制行、每个单元格和省略号有 `pagination-list`、`pagination-item`、`pagination-ellipsis` 主题部位，省略号随更大的文字长高；TopNavMenu 的数据项和 TopNavMegaMenuItem 新增 `hasCloseOnSelect`；选中标签的下划线成为 `tab-indicator` 部位，顶栏手机条和抽屉里的行带 `mode` 状态；移动抽屉里的 SideNavItem、TopNavItem、TopNavMenu 项、TopNavMegaMenuItem、BreadcrumbItem 被激活后关掉抽屉；TopNav 抽屉里的分组展开收起带动画，收起时 inert，展开后不再切掉焦点环；顶栏放不下时换行，长标题先收缩，手机条上结束区和菜单按钮始终留在条内，纯文字标题收在一行；空插槽不再画出空壳；禁用的 TopNavItem 保留 Tab 停靠点且不运行调用方的处理函数；精选卡片链接的箭头在从右到左的文字里镜像；精选面板不再掉出视口底部，减少动态效果时触屏上淡入；标题弹出层里的菜单没写 `label` 时用标题当名字；TabList 的标签在下一帧才量选中位置，换行的标签在格里居中；菜单行滑过时不选中文字；导航行和标签随更大的文字尺寸长高；AppShell 在脚本读到窗口之前先在手机宽度藏起顶栏的起始和中间内容。
