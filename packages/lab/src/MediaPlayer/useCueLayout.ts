import type { Ref } from 'vue'
import { observeResize } from '@astryx-vue/core'
import { watch } from 'vue'

interface SavedCuePosition {
  line: LineAndPositionSetting
  lineAlign: LineAlignSetting
  snapToLines: boolean
}

/**
 * 把视频的字幕放在控件条上面，控件条显示还是藏起，字幕都不跳，也不会被控件条挡住。
 * 字幕和控件条之间的距离等于控件条离画面边缘的距离。只挪用默认底部位置的字幕，
 * 字幕作者自己摆好位置的不动。返回的清理函数把挪过的字幕都放回原处。
 */
export function layOutCues(video: HTMLVideoElement, bar: HTMLElement): () => void {
  const tracks = video.textTracks
  if (tracks == null || typeof tracks.addEventListener !== 'function' || typeof VTTCue === 'undefined')
    return () => {}
  const saved = new Map<VTTCue, SavedCuePosition>()
  const watched = new Set<TextTrack>()
  const watchedElements = new Set<HTMLTrackElement>()

  function moveCues(track: TextTrack, line: number): void {
    const cues = track.mode === 'disabled' ? null : track.cues
    if (cues == null)
      return
    for (let index = 0; index < cues.length; index++) {
      const cue = cues[index]
      if (!(cue instanceof VTTCue))
        continue
      const original = saved.get(cue) ?? { line: cue.line, lineAlign: cue.lineAlign, snapToLines: cue.snapToLines }
      if (original.line !== 'auto')
        continue
      saved.set(cue, original)
      cue.snapToLines = false
      cue.lineAlign = 'end'
      cue.line = line
    }
  }

  function apply(): void {
    // 字幕内容随 <track> 的 load 事件到达，暂停时没有任何文字轨道事件会报告它。
    for (const element of video.querySelectorAll('track')) {
      if (!watchedElements.has(element)) {
        watchedElements.add(element)
        element.addEventListener('load', apply)
      }
    }
    const height = video.clientHeight
    if (height <= 0)
      return
    // 布局位置不算控件条藏起时的位移，控件条淡入淡出时字幕的位置不变。
    const inset = height - (bar.offsetTop + bar.offsetHeight)
    const clearance = height - bar.offsetTop + inset
    const line = Math.min(Math.max((1 - clearance / height) * 100, 0), 100)
    for (let index = 0; index < tracks.length; index++) {
      const track = tracks[index]
      if (track == null)
        continue
      if (!watched.has(track)) {
        watched.add(track)
        track.addEventListener('cuechange', apply)
      }
      moveCues(track, line)
    }
  }

  apply()
  tracks.addEventListener('change', apply)
  tracks.addEventListener('addtrack', apply)
  const stopObserving = observeResize(video, apply)
  return () => {
    stopObserving()
    tracks.removeEventListener('change', apply)
    tracks.removeEventListener('addtrack', apply)
    for (const track of watched)
      track.removeEventListener('cuechange', apply)
    for (const element of watchedElements)
      element.removeEventListener('load', apply)
    for (const [cue, original] of saved) {
      cue.snapToLines = original.snapToLines
      cue.lineAlign = original.lineAlign
      cue.line = original.line
    }
  }
}

/** 跟着当前的视频和控件条摆字幕。任何一个换成别的元素时重新摆。 */
export function useCueLayout(video: Readonly<Ref<HTMLVideoElement | null>>, bar: Readonly<Ref<HTMLElement | null>>): void {
  watch([video, bar], ([videoElement, barElement], _previous, onCleanup) => {
    if (videoElement == null || barElement == null)
      return
    onCleanup(layOutCues(videoElement, barElement))
  }, { immediate: true, flush: 'post' })
}
