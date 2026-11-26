import type { CSSProperties, Ref } from 'vue'
import { computed, onMounted, ref, watch } from 'vue'
import { clampInlineSize } from '../layer/inlineSize.js'

interface ListboxStyleOptions {
  fieldRef: Readonly<Ref<HTMLElement | null>>
  isOpen: Readonly<Ref<boolean>>
  isSheet: Readonly<Ref<boolean>>
  /** 选中项盖在触发器上时，列表的顶边。 */
  overlayTop: Readonly<Ref<number | null>>
  position: Readonly<Ref<{ top: number, left: number }>>
}

/** 弹层形态下列表的位置和最小宽度；底部弹层不用定位。 */
export function useListboxStyle(options: ListboxStyleOptions): Readonly<Ref<CSSProperties | undefined>> {
  const anchorWidth = ref(0)

  function syncAnchorWidth(): void {
    anchorWidth.value = options.fieldRef.value?.getBoundingClientRect().width ?? 0
  }

  watch(options.isOpen, (open) => {
    if (open)
      syncAnchorWidth()
  }, { flush: 'pre' })

  onMounted(syncAnchorWidth)

  return computed(() => options.isSheet.value
    ? undefined
    : {
        top: `${options.overlayTop.value ?? options.position.value.top}px`,
        left: `${options.position.value.left}px`,
        // 不窄于触发器，但压在视口上限之内：最小宽度优先于最大宽度，不压会撑出屏幕。
        minWidth: anchorWidth.value > 0 ? clampInlineSize(`${anchorWidth.value}px`) : undefined,
      })
}
