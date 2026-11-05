import { defineAsyncComponent } from 'vue'

/** 只在底部面板真正进入组件树时请求；普通 popover 菜单不会触发这次 import。 */
export const MenuBottomSheet = defineAsyncComponent(() => import('../BottomSheet/BottomSheet.vue'))
