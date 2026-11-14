import type { IconColor } from '@astryx-vue/core'
import type { PropType } from 'vue'
import { Icon } from '@astryx-vue/core'
import { defineComponent, h } from 'vue'

/** Stable icon-registry keys for the Comments family's glyphs. */
export const COMMENT_ICON_KEYS = {
  addReaction: 'comment:addReaction',
  reply: 'comment:reply',
  copyLink: 'comment:copyLink',
  resolve: 'comment:resolve',
  edit: 'comment:edit',
  delete: 'comment:delete',
  attach: 'comment:attach',
  emoji: 'comment:emoji',
  event: 'comment:event',
} as const

export type CommentIconName = keyof typeof COMMENT_ICON_KEYS

const PATHS: Record<CommentIconName, readonly string[]> = {
  addReaction: [
    'M20.5 12.5A8.5 8.5 0 1 1 11.5 3.5',
    'M8.5 14.5a4 4 0 0 0 7 0',
    'M9 10h.01M15 10h.01',
    'M19 2.5v5M16.5 5h5',
  ],
  reply: [
    'M4.5 5.5h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-4.5 3.5v-3.5h-1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z',
  ],
  copyLink: [
    'M10 14a4.5 4.5 0 0 0 6.36 0l3-3a4.5 4.5 0 0 0-6.36-6.36l-1.25 1.25',
    'M14 10a4.5 4.5 0 0 0-6.36 0l-3 3a4.5 4.5 0 0 0 6.36 6.36l1.25-1.25',
  ],
  resolve: [],
  edit: ['M15.5 4.5l4 4L8 20H4v-4L15.5 4.5z', 'M13.5 6.5l4 4'],
  delete: [
    'M4.5 6.5h15',
    'M9.5 6.5v-2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2',
    'M6.5 6.5l1 13a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1l1-13',
    'M10.5 10.5v6M13.5 10.5v6',
  ],
  attach: [
    'M19.5 11.5l-7.6 7.6a4.5 4.5 0 0 1-6.36-6.36l7.95-7.95a3 3 0 0 1 4.24 4.24l-7.6 7.6a1.5 1.5 0 0 1-2.12-2.12l7.07-7.07',
  ],
  emoji: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M8.5 14.5a4 4 0 0 0 7 0',
    'M9 10h.01M15 10h.01',
  ],
  event: [
    'M12 3v5.5M12 15.5V21',
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z',
  ],
}

const REGISTRY_FALLBACKS: Partial<Record<CommentIconName, string>> = {
  resolve: 'check',
}

function glyph(name: CommentIconName): ReturnType<typeof defineComponent> {
  const paths = PATHS[name]
  return defineComponent({
    name: `CommentGlyph${name[0]!.toUpperCase()}${name.slice(1)}`,
    setup() {
      return () => h(
        'svg',
        {
          'xmlns': 'http://www.w3.org/2000/svg',
          'viewBox': '0 0 24 24',
          'fill': 'none',
          'stroke': 'currentColor',
          'stroke-width': 1.5,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        paths.map(d => h('path', { d })),
      )
    },
  })
}

/**
 * A comment glyph at the icon slot's size. Bundled defaults are drawn on a
 * 24px grid with 1.5px strokes. `resolve` falls back to the core `check` icon.
 */
export const CommentIcon = defineComponent({
  name: 'AstryxCommentIcon',
  props: {
    name: { type: String as PropType<CommentIconName>, required: true },
    color: { type: String as PropType<IconColor>, default: 'secondary' },
    size: { type: String as PropType<'xsm' | 'sm' | 'md' | 'lg'>, default: 'sm' },
  },
  setup(props) {
    return () => {
      const fallback = REGISTRY_FALLBACKS[props.name] ?? glyph(props.name)
      return h(Icon, { icon: fallback as never, color: props.color, size: props.size })
    }
  },
})
