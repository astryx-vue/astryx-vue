/**
 * 对应原版 Astryx `hooks/useClipboard` 里的写入逻辑：先用异步 Clipboard API，
 * 所在框架不允许时（沙箱里的预览、嵌入页）改用浏览器的复制命令。
 */

interface PolicyDocument extends Document {
  permissionsPolicy?: { allowsFeature?: (feature: string) => boolean }
  featurePolicy?: { allowsFeature?: (feature: string) => boolean }
}

/**
 * 这个文档能不能用异步 Clipboard API 写入。权限策略不允许 `clipboard-write` 的框架会拒绝它，
 * 每试一次浏览器还会记一条策略违规。没有策略 API 时照常尝试。
 */
function clipboardWriteAllowed(): boolean {
  const doc = document as PolicyDocument
  const policy = doc.permissionsPolicy ?? doc.featurePolicy
  return typeof policy?.allowsFeature === 'function' ? policy.allowsFeature('clipboard-write') : true
}

/**
 * 用浏览器的复制命令复制文字。异步 API 被拒绝的地方，一次点击或按键里仍然能跑它。
 * 文字通过复制命令触发的 `copy` 事件放进去，不用让任何元素拿焦点或改选区，
 * 所以 HoverCard 或打开的模态对话框里的控件两样都保得住。
 * @throws 浏览器没有复制时
 */
function copyThroughCopyCommand(text: string): void {
  const activation = (navigator as Navigator & { userActivation?: { isActive: boolean } }).userActivation
  if (activation?.isActive === false)
    throw new Error('The copy command runs only in a click or a key press.')
  let written = false
  const write = (event: ClipboardEvent): void => {
    if (event.clipboardData == null)
      return
    event.clipboardData.setData('text/plain', text)
    event.preventDefault()
    // 这是 hook 自己的复制，页面上别的 copy 监听不能改它。
    event.stopImmediatePropagation()
    written = true
  }
  window.addEventListener('copy', write, true)
  let copied: boolean
  try {
    copied = document.execCommand('copy')
  }
  finally {
    window.removeEventListener('copy', write, true)
  }
  if (!copied || !written)
    throw new Error('The browser did not copy the text.')
}

/**
 * 把文字写进剪贴板。异步 Clipboard API 优先；框架的策略事先说不允许时直接用复制命令，
 * 免得浏览器记违规；浏览器事后拒绝写入（NotAllowedError）时也改用复制命令。
 * @throws 两条路都没写进去时，抛出更能说明原因的那个错误
 */
export async function writeClipboardText(text: string): Promise<void> {
  if (!clipboardWriteAllowed()) {
    copyThroughCopyCommand(text)
    return
  }
  try {
    await navigator.clipboard.writeText(text)
  }
  catch (error) {
    if (!(error instanceof DOMException && error.name === 'NotAllowedError'))
      throw error
    try {
      copyThroughCopyCommand(text)
    }
    catch {
      // 浏览器的拒绝比复制命令的失败更能说明原因。
      throw error
    }
  }
}
