export function matchesFocusVisible(element: Element): boolean {
  try {
    return element.matches(':focus-visible')
  }
  catch {
    return false
  }
}
