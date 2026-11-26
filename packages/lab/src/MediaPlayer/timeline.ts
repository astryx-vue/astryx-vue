import type { MediaTimelineChapter, MediaTimelineMarker } from './types.js'

/** 核心 Slider 的滑块直径。滑块中心在轨道两端各缩进半个直径。 */
export const SLIDER_THUMB_SIZE = 20
/** 章节之间的缝。 */
export const CHAPTER_GAP = 2
/** 指针离标记多少像素以内，预览就显示这个标记。 */
export const MARKER_REACH = 6
/** 时间轴读值时，离标记多少秒以内就把标记一起读出来（至少这么多，不管轨道多宽）。 */
export const MARKER_SPOKEN_REACH = 2.5

/** 时间轴的键：方向键跳 5 秒，Page Up / Page Down 跳 10 秒。 */
export const TIMELINE_KEY_OFFSETS: Readonly<Record<string, number>> = {
  ArrowLeft: -5,
  ArrowDown: -5,
  ArrowRight: 5,
  ArrowUp: 5,
  PageDown: -10,
  PageUp: 10,
}

export function findChapter(chapters: readonly MediaTimelineChapter[], time: number): MediaTimelineChapter | undefined {
  let found: MediaTimelineChapter | undefined
  for (const chapter of chapters) {
    if (time >= chapter.start)
      found = chapter
  }
  return found
}

/** 离 `time` 最近、且不超过 `reach` 秒的那个标记。 */
export function findMarker(markers: readonly MediaTimelineMarker[], time: number, reach: number): MediaTimelineMarker | undefined {
  let found: MediaTimelineMarker | undefined
  let nearest = reach
  for (const marker of markers) {
    const distance = Math.abs(marker.time - time)
    if (distance <= nearest) {
      nearest = distance
      found = marker
    }
  }
  return found
}

/** `time` 前后 `reach` 秒以内的标记，按时间排好。 */
export function findMarkersNear(markers: readonly MediaTimelineMarker[], time: number, reach: number): MediaTimelineMarker[] {
  return markers
    .filter(marker => Math.abs(marker.time - time) <= reach)
    .sort((first, second) => first.time - second.time)
}

export function sortChapters(chapters: readonly MediaTimelineChapter[] | undefined): MediaTimelineChapter[] {
  return [...(chapters ?? [])]
    .filter(chapter => Number.isFinite(chapter.start))
    .sort((first, second) => first.start - second.start)
}

/** 时间和时间轴上横坐标（像素，从左边算）之间的换算。 */
export interface TimelineScale {
  toX: (time: number) => number
  toTime: (x: number) => number
  /** 一个像素距离对应的秒数乘以 `MARKER_REACH`。 */
  markerReachSeconds: number
}

export function createTimelineScale(width: number, duration: number): TimelineScale {
  const isSeekable = Number.isFinite(duration) && duration > 0
  const travel = Math.max(width - SLIDER_THUMB_SIZE, 0)
  return {
    toX: time => SLIDER_THUMB_SIZE / 2 + (isSeekable ? Math.min(Math.max(time / duration, 0), 1) : 0) * travel,
    toTime: x => isSeekable && travel > 0
      ? Math.min(Math.max((x - SLIDER_THUMB_SIZE / 2) / travel, 0), 1) * duration
      : 0,
    markerReachSeconds: isSeekable && travel > 0 ? (MARKER_REACH / travel) * duration : 0,
  }
}

export interface TimelineSegment {
  start: number
  width: number
}

/** 按章节把轨道切成几段，段与段之间留 `CHAPTER_GAP` 的缝。 */
export function timelineSegments(width: number, duration: number, chapters: readonly MediaTimelineChapter[], scale: TimelineScale): TimelineSegment[] {
  const isSeekable = Number.isFinite(duration) && duration > 0
  const edges = [
    0,
    ...(isSeekable
      ? chapters.filter(chapter => chapter.start > 0 && chapter.start < duration).map(chapter => scale.toX(chapter.start))
      : []),
    width,
  ]
  return edges.slice(0, -1).map((edge, index) => {
    const start = index === 0 ? edge : edge + CHAPTER_GAP / 2
    const next = edges[index + 1] ?? width
    const end = index === edges.length - 2 ? next : next - CHAPTER_GAP / 2
    return { start, width: Math.max(end - start, 0) }
  })
}
