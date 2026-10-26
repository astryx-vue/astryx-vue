import type { PropType } from 'vue'
import type { ResolvedPoint, SeriesContext, SeriesDef } from '../types.js'
import { defineComponent, h } from 'vue'

/**
 * 把每个系列的画法装进一个按绘图区裁切的组里。
 *
 * 裁切是为了让曲线过冲（monotone / natural 会在端点外拱出去一点）跑不到内边距里。
 * 每个系列一个 `<g>`，键用布局分配的 `_uid`（`key` 可以重名，不能当键）。
 */
export default defineComponent({
  name: 'AstryxChartMarks',
  props: {
    series: { type: Array as PropType<SeriesDef[]>, required: true },
    resolved: { type: Object as PropType<Map<string, ResolvedPoint[]>>, required: true },
    seriesCtx: { type: Object as PropType<SeriesContext>, required: true },
    clipId: { type: String, required: true },
  },
  setup(props) {
    return () => h(
      'g',
      { 'clip-path': `url(#${props.clipId})` },
      props.series.map((series) => {
        const points = series._uid ? props.resolved.get(series._uid) : undefined
        if (!points || !series.render)
          return null
        return h('g', { key: series._uid }, series.render(points, props.seriesCtx))
      }),
    )
  },
})
