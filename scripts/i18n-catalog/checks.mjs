// i18n 目录检查的判定部分。这里只收数据、回问题清单，不读文件也不打印，测试可以直接喂假数据。
// ICU 解析用的两个函数由调用方传进来（`icu.argumentKinds`、`icu.format`），
// 正式运行时就是 packages/core/src/locale/icu.ts 里的那两个，保证检查和运行时读法一致。

const ICU_LEFTOVER = /\{\s*\w+\s*(?:,[^}]*)?\}/
const NUMERIC_KINDS = new Set(['number', 'plural', 'selectordinal'])

/** 文案树里的每一个叶子，路径用 `.` 连起来。 */
export function collectLeaves(tree, prefix = '') {
  const leaves = new Map()
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix === '' ? key : `${prefix}.${key}`
    if (typeof value === 'string' || typeof value === 'function') {
      leaves.set(path, value)
    }
    else if (value != null && typeof value === 'object') {
      for (const [childPath, child] of collectLeaves(value, path))
        leaves.set(childPath, child)
    }
  }
  return leaves
}

function kindOf(value) {
  return typeof value === 'function' ? `函数（${value.length} 个参数）` : '字符串'
}

/** 内置 `en` 和 `zh-CN` 两棵文案树：字段一一对上，形状一样，字符串不为空。 */
export function checkBuiltInParity(enTree, zhTree) {
  const problems = []
  const en = collectLeaves(enTree)
  const zh = collectLeaves(zhTree)
  for (const [path, value] of en) {
    if (!zh.has(path)) {
      problems.push(`${path}：zh-CN 缺这个字段`)
      continue
    }
    const other = zh.get(path)
    if (typeof value !== typeof other || (typeof value === 'function' && value.length !== other.length))
      problems.push(`${path}：en 是${kindOf(value)}，zh-CN 是${kindOf(other)}`)
  }
  for (const path of zh.keys()) {
    if (!en.has(path))
      problems.push(`${path}：只有 zh-CN 有，en 缺这个字段`)
  }
  for (const [tag, leaves] of [['en', en], ['zh-CN', zh]]) {
    for (const [path, value] of leaves) {
      if (typeof value === 'string' && value.trim() === '')
        problems.push(`${path}：${tag} 是空字符串`)
    }
  }
  return problems
}

function sameKinds(a, b) {
  const left = Object.keys(a).sort()
  const right = Object.keys(b).sort()
  if (left.length !== right.length || left.some((name, index) => name !== right[index]))
    return false
  return left.every(name => a[name].join('+') === b[name].join('+'))
}

function describeKinds(kinds) {
  const names = Object.keys(kinds).sort()
  return names.length === 0 ? '（无）' : names.map(name => `${name}:${kinds[name].join('+')}`).join(', ')
}

function readDefault(entry) {
  if (typeof entry === 'string')
    return entry
  if (entry != null && typeof entry === 'object' && typeof entry.defaultMessage === 'string')
    return entry.defaultMessage
  return undefined
}

/**
 * 映射表本身：原版键都在 en.json 里，字段路径都存在，
 * 字段形状和占位符数对得上，`args` 正好是原版这句话的占位符集合。
 */
export function checkMapTargets(map, enCatalog, enTree, icu) {
  const problems = []
  const leaves = collectLeaves(enTree)
  for (const [key, targets] of Object.entries(map)) {
    const message = readDefault(enCatalog[key])
    if (message == null) {
      problems.push(`${key}：映射里有，但 locales/en.json 里没有这个键`)
      continue
    }
    let kinds
    try {
      kinds = icu.argumentKinds(message)
    }
    catch (error) {
      problems.push(`${key}：en.json 的原文解析失败（${error.message}）`)
      continue
    }
    const names = Object.keys(kinds).sort()
    for (const target of targets) {
      const value = leaves.get(target.path)
      if (value == null) {
        problems.push(`${key} → ${target.path}：文案树里没有这个字段`)
        continue
      }
      const args = [...(target.args ?? [])]
      const sorted = [...args].sort()
      if (sorted.length !== names.length || sorted.some((name, index) => name !== names[index]))
        problems.push(`${key} → ${target.path}：args 是 [${args.join(', ')}]，原文的占位符是 [${names.join(', ')}]`)
      if (args.length === 0 && typeof value !== 'string')
        problems.push(`${key} → ${target.path}：原文没有占位符，字段应该是字符串`)
      if (args.length > 0 && (typeof value !== 'function' || value.length !== args.length))
        problems.push(`${key} → ${target.path}：字段应该是收 ${args.length} 个参数的函数，现在是${kindOf(value)}`)
    }
  }
  return problems
}

/** 给每个占位符一个样例值：数字类给数，其余给一眼能认出来的字符串。 */
export function sampleValues(kinds, count) {
  const values = {}
  for (const [name, list] of Object.entries(kinds))
    values[name] = list.some(kind => NUMERIC_KINDS.has(kind)) ? count : `«${name}»`
  return values
}

function render(value, args, values) {
  return typeof value === 'function' ? value(...args.map(name => values[name])) : value
}

/**
 * 内置文案真的用上了原版的每个占位符，并且没有残留没填的 `{name}`。
 * `en` 和 `zh-CN` 都查，映射到的每个字段都查。
 */
export function checkBuiltInPlaceholders(map, trees, enCatalog, icu) {
  const problems = []
  for (const [tag, tree] of Object.entries(trees)) {
    const leaves = collectLeaves(tree)
    for (const [key, targets] of Object.entries(map)) {
      const message = readDefault(enCatalog[key])
      if (message == null)
        continue
      let kinds
      try {
        kinds = icu.argumentKinds(message)
      }
      catch {
        continue
      }
      const values = sampleValues(kinds, 7)
      for (const target of targets) {
        const value = leaves.get(target.path)
        if (value == null)
          continue
        const args = target.args ?? []
        let text
        try {
          text = render(value, args, values)
        }
        catch (error) {
          problems.push(`${tag} ${target.path}：调用时出错（${error.message}）`)
          continue
        }
        if (typeof text !== 'string' || text.trim() === '') {
          problems.push(`${tag} ${target.path}：结果是空的`)
          continue
        }
        const missing = args.filter(name => !text.includes(String(values[name])))
        if (missing.length > 0)
          problems.push(`${tag} ${target.path}：没有用上占位符 ${missing.join(', ')}（对应 ${key}）`)
        if (ICU_LEFTOVER.test(text))
          problems.push(`${tag} ${target.path}：结果里还留着没填的 ICU 占位符：${JSON.stringify(text)}`)
      }
    }
  }
  return problems
}

function cleanup(text) {
  return text.replace(/[ \t]{2,}/g, ' ').trim()
}

/**
 * 内置英文和原版英文逐字一致。每个键只比第一个字段，那是这句话真正的落点；
 * 后面的字段只是加载别的语言目录时顺带写入，样子可以不同。
 * 数字类占位符用 1、3、1234 三个值各比一次，单复数和千分位都会走到。
 */
export function checkEnglishText(map, enTree, enCatalog, icu) {
  const problems = []
  const leaves = collectLeaves(enTree)
  for (const [key, targets] of Object.entries(map)) {
    const message = readDefault(enCatalog[key])
    const target = targets[0]
    const value = target == null ? undefined : leaves.get(target.path)
    if (message == null || value == null)
      continue
    let kinds
    try {
      kinds = icu.argumentKinds(message)
    }
    catch {
      continue
    }
    for (const count of [1, 3, 1234]) {
      const values = sampleValues(kinds, count)
      let ours
      try {
        ours = render(value, target.args ?? [], values)
      }
      catch {
        break
      }
      const theirs = cleanup(icu.format(message, values, 'en'))
      if (ours !== theirs) {
        problems.push(`${key} → ${target.path}：内置英文是 ${JSON.stringify(ours)}，原版是 ${JSON.stringify(theirs)}`)
        break
      }
      if (typeof value !== 'function' || Object.keys(kinds).every(name => !kinds[name].some(kind => NUMERIC_KINDS.has(kind))))
        break
    }
  }
  return problems
}

/**
 * 每个语言目录：没有 en.json 里不存在的键，每句译文能解析，
 * 占位符的名字和写法（普通、number、plural、select）和英文原文一致。
 * 译文少键是正常的，运行时会退回英文，这里只数一下。
 */
export function checkLocaleContracts(enCatalog, catalogs, icu) {
  const problems = []
  const untranslated = {}
  const sourceKinds = new Map()
  for (const [key, entry] of Object.entries(enCatalog)) {
    const message = readDefault(entry)
    if (message == null || message === '') {
      problems.push(`en.json ${key}：缺 defaultMessage`)
      continue
    }
    try {
      sourceKinds.set(key, icu.argumentKinds(message))
    }
    catch (error) {
      problems.push(`en.json ${key}：解析失败（${error.message}）`)
    }
  }
  for (const [tag, catalog] of Object.entries(catalogs)) {
    let missing = 0
    for (const key of Object.keys(enCatalog)) {
      if (!Object.hasOwn(catalog, key))
        missing += 1
    }
    untranslated[tag] = missing
    for (const [key, entry] of Object.entries(catalog)) {
      if (!Object.hasOwn(enCatalog, key)) {
        problems.push(`${tag}.json ${key}：en.json 里没有这个键，是过期的译文`)
        continue
      }
      const message = readDefault(entry)
      if (message == null || message === '') {
        problems.push(`${tag}.json ${key}：缺 defaultMessage`)
        continue
      }
      let kinds
      try {
        kinds = icu.argumentKinds(message)
      }
      catch (error) {
        problems.push(`${tag}.json ${key}：解析失败（${error.message}）`)
        continue
      }
      const expected = sourceKinds.get(key)
      if (expected != null && !sameKinds(expected, kinds))
        problems.push(`${tag}.json ${key}：占位符是 ${describeKinds(kinds)}，英文原文是 ${describeKinds(expected)}`)
    }
  }
  return { problems, untranslated }
}

/**
 * en.json 的每个键要么写进了映射表，要么属于一个写明理由的「暂不接入」命名空间。
 * 重新拉取 locales 后多出来的键会在这里被拦下，不会悄悄漏掉。
 */
export function checkCoverage(enCatalog, map, unported, unportedKeys = {}) {
  const problems = []
  const skipped = new Map()
  for (const key of Object.keys(enCatalog)) {
    if (Object.hasOwn(map, key))
      continue
    if (Object.hasOwn(unportedKeys, key))
      continue
    const namespace = key.split('.')[1] ?? ''
    if (Object.hasOwn(unported, namespace)) {
      skipped.set(namespace, (skipped.get(namespace) ?? 0) + 1)
      continue
    }
    problems.push(`${key}：既没写进 upstreamMap，也不在 scripts/i18n-catalog/coverage.mjs 的暂不接入名单里`)
  }
  return { problems, skipped }
}

const TRANSLATOR_CALL = /\b(?:t|translate|translator)\(\s*(['"`])(@astryx\.[\w.]+)\1/g

/** 源码里 `t('@astryx.…')` 这类调用用到的键都要在映射表里，否则运行时会原样显示键名。 */
export function checkSourceRefs(files, map) {
  const problems = []
  let count = 0
  for (const { path, text } of files) {
    for (const match of text.matchAll(TRANSLATOR_CALL)) {
      count += 1
      const key = match[2]
      if (!Object.hasOwn(map, key)) {
        const line = text.slice(0, match.index).split('\n').length
        problems.push(`${path}:${line}  ${key} 不在 upstreamMap 里`)
      }
    }
  }
  return { problems, count }
}
