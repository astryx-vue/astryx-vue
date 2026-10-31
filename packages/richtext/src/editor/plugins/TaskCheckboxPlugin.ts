import type { ListItemNode } from '@lexical/list'
import type { LexicalNode } from 'lexical'
import type { PropType } from 'vue'
import type { TaskState } from '../../markdownTaskList.js'
import { CheckboxInput } from '@astryx-vue/core'
import { $isListItemNode, $isListNode } from '@lexical/list'
import { $getNodeByKey, $getRoot } from 'lexical'
import { defineComponent, h, onBeforeUnmount, useId, watchEffect } from 'vue'
import { $getTaskState, $setTaskState, registerTaskListEditing } from '../../markdownTaskList.js'
import { useLexicalEditor } from '../context.js'
import { useOverlayPlacements } from './useOverlayPlacements.js'

/** 一个任务项的勾选框要画在哪里：相对编辑区容器的像素坐标。 */
interface TaskPlacement {
  key: string
  checked: boolean
  label: string
  top: number
  left: number
}

/** core 小号勾选框的宽度。从右往左排版时，勾选框要贴着项的右边。 */
const CHECKBOX_SIZE = 20

/** 主题靠这个属性认出任务项：不画列表标记，给勾选框留位置。 */
export const TASK_ATTRIBUTE = 'data-richtext-task'

/**
 * 文档里所有自己有文字的无序列表项，按文档顺序，并标明是不是任务项。
 * 只装着一个子列表的项是 Lexical 用来放嵌套列表的外壳，没有文字，不算。
 */
function $bulletItems(): Array<{ item: ListItemNode, task: TaskState | null }> {
  const items: Array<{ item: ListItemNode, task: TaskState | null }> = []
  const visit = (node: LexicalNode): void => {
    if (!$isListNode(node))
      return
    for (const item of node.getChildren()) {
      if (!$isListItemNode(item))
        continue
      const isWrapper = item.getChildrenSize() === 1 && $isListNode(item.getFirstChild())
      if (!isWrapper && node.getListType() !== 'number')
        items.push({ item, task: $getTaskState(item) })
      item.getChildren().forEach(visit)
    }
  }
  $getRoot().getChildren().forEach(visit)
  return items
}

function samePlacements(a: readonly TaskPlacement[], b: readonly TaskPlacement[]): boolean {
  return a.length === b.length && a.every((p, i) => {
    const q = b[i]!
    return p.key === q.key && p.checked === q.checked && p.label === q.label && p.top === q.top && p.left === q.left
  })
}

/**
 * 任务项的勾选框。
 *
 * 列表项不能同时当复选框用（Lexical 自己的勾选列表会给它换一个角色），可编辑的文字里也塞不进别的元素。
 * 所以项还是列表项，只加一个属性让主题去掉标记、留出位置；勾选框是编辑区的兄弟元素，
 * 画在项开头的空位上。项用 `aria-owns` 把勾选框认作自己的，读屏软件就能在项里、按文档顺序找到它和它的状态。
 * 勾选框不占 Tab 停靠点，否则它们会排在整篇文档之后：编辑时用 Mod+Enter 勾选光标所在的项，只读时它们是只读的。
 */
export const TaskCheckboxPlugin = defineComponent({
  name: 'AstryxRichTextTaskCheckboxPlugin',
  props: {
    /** 只读或禁用时，勾选框不能改，也不监听 Enter 和 Mod+Enter。 */
    isReadOnly: { type: Boolean as PropType<boolean>, default: false },
  },
  setup(props) {
    const editor = useLexicalEditor()
    const idPrefix = `astryx-richtext-task-${useId()}`

    // 任务项里的 Enter 和 Mod+Enter（见 markdownTaskList.ts）。
    let stopEditing: (() => void) | undefined
    watchEffect(() => {
      stopEditing?.()
      stopEditing = props.isReadOnly ? undefined : registerTaskListEditing(editor)
    })
    onBeforeUnmount(() => stopEditing?.())

    const placements = useOverlayPlacements<TaskPlacement>(editor, (origin) => {
      const root = editor.getRootElement()
      if (root === null)
        return []
      return $bulletItems().flatMap(({ item, task }): TaskPlacement[] => {
        const element = editor.getElementByKey(item.getKey())
        if (element === null)
          return []
        if (task === null) {
          // 普通项保留自己的标记，不拥有勾选框。
          element.removeAttribute(TASK_ATTRIBUTE)
          element.removeAttribute('aria-owns')
          return []
        }
        // 勾选框带着项的状态，所以项保留 Lexical 换掉的列表项角色，并拥有这个勾选框。
        element.setAttribute(TASK_ATTRIBUTE, '')
        element.removeAttribute('role')
        element.removeAttribute('aria-checked')
        element.removeAttribute('tabindex')
        element.setAttribute('aria-owns', `${idPrefix}-${item.getKey()}`)
        const box = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        const isRtl = style.direction === 'rtl'
        return [{
          key: item.getKey(),
          checked: task === 'checked',
          label: item.getTextContent(),
          top: box.top - origin.top + Number.parseFloat(style.paddingTop || '0'),
          left: (isRtl ? box.right - CHECKBOX_SIZE : box.left) - origin.left,
        }]
      })
    }, samePlacements)

    function setChecked(key: string, checked: boolean): void {
      editor.update(() => {
        const node = $getNodeByKey(key)
        if ($isListItemNode(node))
          $setTaskState(node, checked ? 'checked' : 'unchecked')
      })
    }

    return () => placements.value.map(p => h('div', {
      'key': p.key,
      'id': `${idPrefix}-${p.key}`,
      'class': 'astryx-richtext-task-checkbox',
      'data-richtext-task-checkbox': '',
      // 位置是量出来的屏幕坐标，已经把方向算进去了。
      'style': { position: 'absolute', top: `${p.top}px`, left: `${p.left}px` },
    }, [h(CheckboxInput, {
      modelValue: p.checked,
      size: 'sm',
      label: p.label,
      isLabelHidden: true,
      isReadOnly: props.isReadOnly,
      // 不占 Tab 停靠点（见上面的说明）。
      tabindex: -1,
      onChange: (checked: boolean) => setChecked(p.key, checked),
    })]))
  },
})
