import { getCurrentInstance } from 'vue'

/** Whether the vnode was given a listener for this emit, such as `onSubmit`. */
export function hasEmitListener(name: string): boolean {
  const props = getCurrentInstance()?.vnode.props
  if (props == null)
    return false
  const key = `on${name.charAt(0).toUpperCase()}${name.slice(1)}`
  return props[key] != null
}

/**
 * Whether the parent passed this prop.
 *
 * Vue casts an omitted boolean to false, so `props.value ?? fallback` cannot
 * tell an omitted flag from an explicit false.
 */
export function wasPropPassed(name: string): boolean {
  const props = getCurrentInstance()?.vnode.props
  if (props == null)
    return false
  if (Object.hasOwn(props, name))
    return true
  const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
  return Object.hasOwn(props, kebab)
}
