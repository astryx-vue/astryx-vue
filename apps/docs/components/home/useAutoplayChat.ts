import type { ComputedRef, Ref } from 'vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface AutoplayChatScript {
  userQuestion: string
  toolName: string
  assistantLead: string
  codeSnippet: string
  assistantEnding: string
}

export interface UseAutoplayChatOptions {
  script: () => AutoplayChatScript
  assistantName: () => string
  loopDelay?: number
}

export interface CustomChatMessage {
  id: number
  sender: 'user' | 'assistant'
  text: string
}

export interface UseAutoplayChatReturn {
  showUser: Ref<boolean>
  isTyping: Ref<boolean>
  showTool: Ref<boolean>
  showCode: Ref<boolean>
  showEnding: Ref<boolean>
  displayedLeadText: Ref<string>
  assistantLabel: ComputedRef<string>
  currentScript: ComputedRef<AutoplayChatScript>
  customMessages: Ref<CustomChatMessage[]>
  sendUserMessage: (text: string) => void
  replay: () => void
}

export function useAutoplayChat(options: UseAutoplayChatOptions): UseAutoplayChatReturn {
  const { loopDelay = 7000 } = options

  const currentScript = computed(() => options.script())
  const assistantLabel = computed(() => options.assistantName())

  const showUser = ref(false)
  const isTyping = ref(false)
  const showTool = ref(false)
  const showCode = ref(false)
  const showEnding = ref(false)
  const displayedLeadText = ref('')

  const isPaused = ref(false)
  const hasUserInteracted = ref(false)
  const customMessages = ref<CustomChatMessage[]>([])

  const prefersReduced = ref(false)

  const timers: ReturnType<typeof setTimeout>[] = []
  let streamInterval: ReturnType<typeof setInterval> | null = null

  function clearTimers(): void {
    for (const timer of timers)
      clearTimeout(timer)
    timers.length = 0
    if (streamInterval) {
      clearInterval(streamInterval)
      streamInterval = null
    }
  }

  function setFullDisplay(): void {
    clearTimers()
    showUser.value = true
    isTyping.value = false
    showTool.value = true
    displayedLeadText.value = currentScript.value.assistantLead
    showCode.value = true
    showEnding.value = true
  }

  function runCycle(): void {
    if (prefersReduced.value) {
      setFullDisplay()
      return
    }

    if (hasUserInteracted.value || isPaused.value)
      return

    clearTimers()

    // 初始重置状态
    showUser.value = false
    isTyping.value = false
    showTool.value = false
    showCode.value = false
    showEnding.value = false
    displayedLeadText.value = ''

    // 步骤 1: 用户发送消息
    timers.push(setTimeout(() => {
      showUser.value = true

      // 步骤 2: 助手正在输入
      timers.push(setTimeout(() => {
        isTyping.value = true

        // 步骤 3: 结束输入，展示工具调用并开始流式输出回复
        timers.push(setTimeout(() => {
          isTyping.value = false
          showTool.value = true

          const targetLead = currentScript.value.assistantLead
          let index = 0

          streamInterval = setInterval(() => {
            if (isPaused.value || hasUserInteracted.value)
              return

            index += 2
            if (index >= targetLead.length) {
              displayedLeadText.value = targetLead
              if (streamInterval) {
                clearInterval(streamInterval)
                streamInterval = null
              }

              // 步骤 4: 展示代码块
              timers.push(setTimeout(() => {
                showCode.value = true

                // 步骤 5: 展示结尾总结
                timers.push(setTimeout(() => {
                  showEnding.value = true

                  // 步骤 6: 循环停顿，随后开始下一轮
                  timers.push(setTimeout(() => {
                    if (!hasUserInteracted.value && !isPaused.value)
                      runCycle()
                  }, loopDelay))
                }, 750))
              }, 550))
            }
            else {
              displayedLeadText.value = targetLead.slice(0, index)
            }
          }, 24)
        }, 1400))
      }, 900))
    }, 350))
  }

  function handleVisibilityChange(): void {
    if (typeof document === 'undefined')
      return
    if (document.hidden) {
      isPaused.value = true
    }
    else {
      isPaused.value = false
      if (!hasUserInteracted.value && !showEnding.value) {
        runCycle()
      }
    }
  }

  function sendUserMessage(text: string): void {
    const trimmed = text.trim()
    if (!trimmed)
      return

    hasUserInteracted.value = true
    clearTimers()
    customMessages.value.push({
      id: Date.now(),
      sender: 'user',
      text: trimmed,
    })
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      prefersReduced.value = mediaQuery.matches

      const updateMotion = (e: MediaQueryListEvent): void => {
        prefersReduced.value = e.matches
        if (e.matches)
          setFullDisplay()
        else
          runCycle()
      }

      mediaQuery.addEventListener('change', updateMotion)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      onBeforeUnmount(() => {
        mediaQuery.removeEventListener('change', updateMotion)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      })
    }

    runCycle()
  })

  watch(currentScript, () => {
    if (!hasUserInteracted.value)
      runCycle()
  })

  onBeforeUnmount(() => {
    clearTimers()
  })

  return {
    showUser,
    isTyping,
    showTool,
    showCode,
    showEnding,
    displayedLeadText,
    assistantLabel,
    currentScript,
    customMessages,
    sendUserMessage,
    replay: runCycle,
  }
}
