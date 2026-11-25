---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

`Carousel` 的 `hasSnap` 现在也接受新的 `useSnapPaging()` 返回值，在原生吸附的停点上像 iOS 那样翻页：用手指或触控板横扫时，轻扫一下翻一屏，传 `{ pages: 'item' }` 时翻一项，再快也最多翻一页；翻到一半能用手指接住，最后总停在某一项的起始边。鼠标滚轮和鼠标拖动仍是原生滚动，系统要求减少动态效果时直接跳到目标页。

- 边缘按钮、方向键、Shift 加滚轮和 `scrollNext`、`scrollPrev`、`scrollTo` 都经由同一套翻页来挪，`scrollTo` 落在这一项的吸附停点上（考虑 scroll-padding）。
- 翻页按住这一行期间，边缘按钮和渐隐跟着这一行显示的位置变，与这一行同一帧变化。
- 离末端不到半步的停点并入最后一页，原生吸附也跳过那一项，所以每种滚动方式都停在这一行真正的尽头。
