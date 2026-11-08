import type { DemoModule } from './types'
import {
  labChatEmojiPicker,
  labChatReactionBar,
  labCircularProgress,
  labCodeEditor,
  labDiffViewerOverview,
  labInfoTip,
  labListInput,
  labLogStreamOverview,
  labMobileTokenizerOverview,
  labStat,
  labSvgIcon,
  labTourOverview,
  labTransferListOverview,
} from '../lab-demos'

export interface LabCatalogEntry {
  slug: string
  name: string
  demo: DemoModule
}

/** 主站 overview 的 Lab 卡片。正文和安装说明仍由 /lab/ 页面维护。 */
export const LAB_COMPONENTS: readonly LabCatalogEntry[] = [
  { slug: 'chat-emoji-picker', name: 'ChatEmojiPicker', demo: labChatEmojiPicker },
  { slug: 'chat-reaction-bar', name: 'ChatReactionBar', demo: labChatReactionBar },
  { slug: 'circular-progress', name: 'CircularProgress', demo: labCircularProgress },
  { slug: 'code-editor', name: 'CodeEditor', demo: labCodeEditor },
  { slug: 'diff-viewer', name: 'DiffViewer', demo: labDiffViewerOverview },
  { slug: 'info-tip', name: 'InfoTip', demo: labInfoTip },
  { slug: 'list-input', name: 'ListInput', demo: labListInput },
  { slug: 'log-stream', name: 'LogStream', demo: labLogStreamOverview },
  { slug: 'mobile-tokenizer', name: 'MobileTokenizer', demo: labMobileTokenizerOverview },
  { slug: 'stat', name: 'Stat', demo: labStat },
  { slug: 'svg-icon', name: 'SVGIcon', demo: labSvgIcon },
  { slug: 'tour', name: 'Tour', demo: labTourOverview },
  { slug: 'transfer-list', name: 'TransferList', demo: labTransferListOverview },
]
