import type { TemplateRecord } from '../catalog-types.ts'
import type { CommandArgs } from '../cli/context.ts'
import { text } from '../catalog.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { CliError } from '../error.ts'
import { formatTemplateCopy, formatTemplateDetail, formatTemplateList, formatTemplateSkeleton } from '../format.ts'
import { BINARY, PACKAGE_NAME } from '../spec.ts'
import { copyTemplate, guardPathArguments, listTemplates, renderSkeleton, resolveTemplate, templateKinds, templateSource } from '../templates.ts'

/**
 * `template` is three commands behind one name: list, show, and copy. The modes
 * are exclusive, and `--skeleton` only narrows a show, so mixing them is a usage
 * error rather than a guess about what the caller meant.
 */
export function templateCommand(args: CommandArgs): string {
  const list = args.options.list === true
  const skeleton = args.options.skeleton === true
  const overwrite = args.options.overwrite === true
  const type = args.options.type === undefined ? undefined : templateKinds(String(args.options.type))
  if (list && skeleton)
    throw new CliError('--list and --skeleton cannot be combined.', 'ERR_INVALID_ARGUMENT', 2)
  if (args.positionals.length > 2)
    throw new CliError('template takes a name and, at most, one path.', 'ERR_INVALID_ARGUMENT', 2)
  guardPathArguments(args.positionals, args.cwd)

  const [name, target] = args.positionals
  if (list || name === undefined) {
    if (name !== undefined || target !== undefined)
      throw new CliError('--list takes no name or path.', 'ERR_INVALID_ARGUMENT', 2)
    if (skeleton)
      throw new CliError('Pass a template name with --skeleton.', 'ERR_MISSING_ARGUMENT', 2)
    if (overwrite)
      throw new CliError('--overwrite only applies when copying a template to a path.', 'ERR_INVALID_ARGUMENT', 2)
    return templateList(listTemplates(type), args)
  }

  const template = resolveTemplate(name, type)
  if (skeleton) {
    if (target !== undefined)
      throw new CliError('--skeleton prints the skeleton and writes nothing, so it takes no path.', 'ERR_INVALID_ARGUMENT', 2)
    if (overwrite)
      throw new CliError('--overwrite only applies when copying a template to a path.', 'ERR_INVALID_ARGUMENT', 2)
    const skeletonText = renderSkeleton(template.source)
    if (args.json) {
      return printJson(successEnvelope('template.skeleton', {
        template: template.slug,
        title: text(template.title, args.locale),
        description: text(template.description, args.locale),
        kind: template.kind,
        isReady: template.isReady,
        components: template.componentsUsed,
        skeleton: skeletonText,
        docsUrl: text(template.docsUrl, args.locale),
        locale: args.locale,
      }, PACKAGE_NAME))
    }
    return formatTemplateSkeleton(template, args.locale, skeletonText)
  }

  if (target === undefined) {
    const { source, demoMediaReplaced } = templateSource(template)
    if (args.json) {
      return printJson(successEnvelope('template.show', {
        ...templateBrief(template, args.locale),
        components: template.componentsUsed,
        demoMediaReplaced,
        source,
        locale: args.locale,
      }, PACKAGE_NAME))
    }
    return formatTemplateDetail(template, args.locale, args.dense, source)
  }

  const receipt = copyTemplate(template, { cwd: args.cwd, targetPath: target, overwrite, locale: args.locale })
  if (args.json)
    return printJson(successEnvelope('template.copy', { ...receipt, locale: args.locale }, PACKAGE_NAME))
  return formatTemplateCopy(receipt, args.locale)
}

function templateList(templates: readonly TemplateRecord[], args: CommandArgs): string {
  if (args.json) {
    const note = templates.length === 0
      ? (args.locale === 'zh' ? '目前只有 page 模板，还没有 block 模板。' : 'Every template is a page today; there are no block templates yet.')
      : undefined
    return printJson(successEnvelope('template.list', {
      locale: args.locale,
      detail: 'compact',
      templates: templates.map(template => templateBrief(template, args.locale)),
      ...(note ? { note } : {}),
    }, PACKAGE_NAME))
  }
  return formatTemplateList(templates, args.locale, args.dense)
}

function templateBrief(template: TemplateRecord, locale: 'en' | 'zh'): Record<string, unknown> {
  return {
    slug: template.slug,
    title: text(template.title, locale),
    description: text(template.description, locale),
    category: text(template.category, locale),
    kind: template.kind,
    isReady: template.isReady,
    ...(template.notReadyReason ? { notReadyReason: text(template.notReadyReason, locale) } : {}),
    command: `${BINARY} template ${template.slug}`,
    docsUrl: text(template.docsUrl, locale),
  }
}
