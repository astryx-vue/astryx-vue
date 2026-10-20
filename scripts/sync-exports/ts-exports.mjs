// 用 TypeScript 编译器 API 读出一个模块的具名导出，会顺着 `export * from` 往下找。
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import ts from 'typescript'

function modifiersOf(node) {
  return ts.canHaveModifiers(node) ? ts.getModifiers(node) ?? [] : []
}

function hasModifier(node, kind) {
  return modifiersOf(node).some(modifier => modifier.kind === kind)
}

function resolveModule(fromFile, spec) {
  if (!spec.startsWith('.'))
    return null

  const raw = resolve(dirname(fromFile), spec)
  const candidates = []
  if (raw.endsWith('.js')) {
    const stripped = raw.slice(0, -3)
    candidates.push(`${stripped}.ts`, `${stripped}.tsx`, `${stripped}.d.ts`, join(stripped, 'index.ts'))
  }
  else {
    candidates.push(raw, `${raw}.ts`, `${raw}.tsx`, `${raw}.d.ts`, join(raw, 'index.ts'))
  }

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile())
      return candidate
  }
  return null
}

function emptyExports() {
  return { values: new Set(), types: new Set() }
}

/** 返回 `{ values, types }` 两个名字集合：值导出和只有类型的导出。 */
export function collectExports(file, seen = new Set()) {
  const resolved = resolve(file)
  if (seen.has(resolved))
    return emptyExports()
  seen.add(resolved)

  const text = readFileSync(resolved, 'utf8')
  const source = ts.createSourceFile(resolved, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const values = new Set()
  const types = new Set()

  function addLocal(node) {
    if (!hasModifier(node, ts.SyntaxKind.ExportKeyword) || hasModifier(node, ts.SyntaxKind.DefaultKeyword))
      return
    const name = node.name && ts.isIdentifier(node.name) ? node.name.text : undefined
    if (!name)
      return
    const typeOnly = ts.isInterfaceDeclaration(node)
      || ts.isTypeAliasDeclaration(node)
    if (typeOnly)
      types.add(name)
    else
      values.add(name)
  }

  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (statement.exportClause && ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) {
          const exported = element.name.text
          if (exported === 'default')
            continue
          if (statement.isTypeOnly || element.isTypeOnly)
            types.add(exported)
          else
            values.add(exported)
        }
        continue
      }

      if (statement.exportClause && ts.isNamespaceExport(statement.exportClause)) {
        values.add(statement.exportClause.name.text)
        continue
      }

      if (!statement.exportClause && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) {
        const next = resolveModule(resolved, statement.moduleSpecifier.text)
        if (!next)
          continue
        const nested = collectExports(next, seen)
        if (statement.isTypeOnly) {
          for (const name of nested.types)
            types.add(name)
        }
        else {
          for (const name of nested.values)
            values.add(name)
          for (const name of nested.types)
            types.add(name)
        }
      }
      continue
    }

    if (ts.isVariableStatement(statement)) {
      if (!hasModifier(statement, ts.SyntaxKind.ExportKeyword))
        continue
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          values.add(declaration.name.text)
      }
      continue
    }

    if (
      ts.isFunctionDeclaration(statement)
      || ts.isClassDeclaration(statement)
      || ts.isInterfaceDeclaration(statement)
      || ts.isTypeAliasDeclaration(statement)
      || ts.isEnumDeclaration(statement)
      || ts.isModuleDeclaration(statement)
    ) {
      addLocal(statement)
    }
  }

  return { values, types }
}
