---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Slider 的滑块改按 UISlider 的方式跟随指针：拖动不再先跳到按下的位置，手指按住会放大、松手带速度滑行后才触发 changeEnd，手指或触控笔轻点轨道在抬起时设值，触屏上每个滑块有 48px 的可点区域。
