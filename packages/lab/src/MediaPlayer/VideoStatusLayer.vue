<script setup lang="ts">
import { Button, MediaTheme, Spinner, Text } from '@astryx-vue/core'
import { computed } from 'vue'
import { useMediaPlayerContext } from './context.js'
import MediaPlayButton from './MediaPlayButton.vue'
import { useMediaPlayerMessages } from './messages.js'

/**
 * 画面上的一层：点画面播放或暂停（触摸时显示或藏起控件），双击全屏；
 * 中间显示大播放键、缓冲圈，或者出错提示和重试按钮。
 */
defineOptions({ name: 'AstryxVideoStatusLayer' })

const { store, toggleControls, focusPlayer } = useMediaPlayerContext('VideoPlayer')
const messages = useMediaPlayerMessages()
const state = store.state
const status = computed(() => {
  if (state.value.error != null)
    return 'error'
  if (state.value.isWaiting && state.value.hasStarted)
    return 'waiting'
  if (!state.value.hasStarted || state.value.isEnded)
    return 'idle'
  return null
})
let pointerType = 'mouse'

function rememberPointer(event: PointerEvent): void {
  pointerType = event.pointerType
}

function onSurfaceClick(): void {
  // 像原生播放器一样：触摸点一下显示或藏起控件，鼠标点一下播放或暂停。
  if (pointerType === 'touch')
    toggleControls()
  else
    store.actions.togglePaused()
}

function onSurfaceDblclick(): void {
  if (pointerType !== 'touch')
    store.actions.toggleFullscreen()
}

function retry(): void {
  // 媒体重新加载后提示和这个按钮就消失了，先把焦点交给播放器。
  focusPlayer()
  store.actions.reload()
}
</script>

<template>
  <!-- eslint-disable-next-line vue-a11y/click-events-have-key-events, vue-a11y/no-static-element-interactions -- 画面只接指针；键盘用控件条和播放器的快捷键。 -->
  <div
    class="astryx-video-player__surface"
    aria-hidden="true"
    @pointerdown="rememberPointer"
    @click="onSurfaceClick"
    @dblclick="onSurfaceDblclick"
  />
  <MediaTheme mode="dark">
    <div v-if="status === 'error'" class="astryx-video-player__center astryx-video-player__center--interactive">
      <Text type="body" color="primary">
        {{ messages.error }}
      </Text>
      <Button :label="messages.retry" variant="secondary" @click="retry" />
    </div>
    <div v-else-if="status === 'waiting'" class="astryx-video-player__center">
      <Spinner size="lg" shade="onMedia" aria-hidden="true" />
    </div>
    <div v-else-if="status === 'idle'" class="astryx-video-player__center">
      <div class="astryx-video-player__frosted astryx-video-player__big-play">
        <!-- 控件条上的播放键做同样的事，这个不进 Tab 序，也不进无障碍树。 -->
        <MediaPlayButton size="lg" tabindex="-1" aria-hidden="true" @click="focusPlayer" />
      </div>
    </div>
  </MediaTheme>
</template>
