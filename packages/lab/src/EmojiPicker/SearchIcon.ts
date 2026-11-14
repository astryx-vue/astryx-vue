import { Icon } from '@astryx-vue/core'
import { defineComponent, h } from 'vue'

/** 传给搜索框 `startIcon` 的放大镜。 */
export const SearchIcon = defineComponent({
  name: 'AstryxEmojiPickerSearchIcon',
  setup() {
    return () => h(Icon, { icon: 'search', size: 'sm', color: 'secondary' })
  },
})
