---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

在手机、平板这类以触屏为主的设备上，ButtonGroup、ToggleButtonGroup 和 AlertDialog 的按钮可以按住滑动：按下的那个立刻高亮，滑到别的按钮上高亮跟过去，松手时只执行手指下的那个，在组外松手什么都不执行。鼠标按下仍和原生按钮一样。菜单触发器和没有 `value` 的切换按钮保留自己的按压。

CLI 内置的文档跟着更新了 ButtonGroup、ToggleButtonGroup、AlertDialog 的说明。
