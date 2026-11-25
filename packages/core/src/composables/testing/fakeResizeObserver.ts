/**
 * 测试用的 ResizeObserver：happy-dom 自带的那个从不发通知。
 * 装上后，`notify()` 像浏览器排版后那样，给每个正在观察的元素发一次通知。
 */
export interface FakeResizeObserver {
  /** 给所有正在观察的元素各发一次通知。 */
  notify: () => void
  /** 换回原来的 ResizeObserver。 */
  restore: () => void
}

export function installFakeResizeObserver(): FakeResizeObserver {
  const original = globalThis.ResizeObserver
  const instances = new Set<{ callback: ResizeObserverCallback, targets: Set<Element>, self: ResizeObserver }>()

  class FakeObserver {
    private readonly record: { callback: ResizeObserverCallback, targets: Set<Element>, self: ResizeObserver }

    constructor(callback: ResizeObserverCallback) {
      this.record = { callback, targets: new Set(), self: this as unknown as ResizeObserver }
      instances.add(this.record)
    }

    observe(target: Element): void {
      this.record.targets.add(target)
    }

    unobserve(target: Element): void {
      this.record.targets.delete(target)
    }

    disconnect(): void {
      this.record.targets.clear()
      instances.delete(this.record)
    }
  }

  globalThis.ResizeObserver = FakeObserver as unknown as typeof ResizeObserver

  return {
    notify() {
      for (const record of [...instances]) {
        const entries = [...record.targets].map(target => ({ target }) as ResizeObserverEntry)
        if (entries.length > 0)
          record.callback(entries, record.self)
      }
    },
    restore() {
      globalThis.ResizeObserver = original
    },
  }
}
