import type { CommandArgs } from '../cli/context.ts'
import { buildKit } from '../build.ts'
import { printJson } from '../cli/context.ts'
import { successEnvelope } from '../envelope.ts'
import { formatBuildHelp, formatBuildKit } from '../format.ts'
import { BINARY, PACKAGE_NAME } from '../spec.ts'

/** `build` without a sentence prints the workflow; with one it prints the kit. */
export function buildCommand(args: CommandArgs): string {
  const idea = args.positionals.join(' ').trim()
  if (args.positionals.length === 0) {
    if (args.json) {
      return printJson(successEnvelope('build.help', {
        usage: `${BINARY} build "<one sentence>"`,
        locale: args.locale,
        steps: args.locale === 'zh'
          ? [
              `运行 \`${BINARY} build "<一句话想法>"\` 找最接近的页面模板和要用的组件。`,
              `运行 \`${BINARY} template <slug> ./src/pages\` 落地模板，再按需修改。`,
              `写代码前用 \`${BINARY} component <Name>\` 或 \`${BINARY} composable <Name>\` 查用法，不要猜 props。`,
            ]
          : [
              `Run \`${BINARY} build "<one sentence>"\` to find the closest page template and the components to use.`,
              `Run \`${BINARY} template <slug> ./src/pages\` to copy the template, then change it.`,
              `Run \`${BINARY} component <Name>\` or \`${BINARY} composable <Name>\` before writing code. Do not guess props.`,
            ],
        rules: args.locale === 'zh'
          ? [
              '匹配完全离线：只在模板的名字、标题、描述、关键词和组件上做关键词加权，没有网络，没有模型。',
              '中文按字符二元组匹配，不需要空格分词。',
              '标为不可用的模板排在可复制模板之后，复制会被拒绝。',
              '命中太弱时宁可不给，不硬凑结果。',
            ]
          : [
              'Matching is offline: weighted keywords over a template slug, title, description, keywords, and components. No network, no model.',
              'Chinese is matched by character pairs, so no word segmentation is needed.',
              'Templates that are not ready rank below ready ones, and copying them is refused.',
              'A weak match is dropped rather than padded.',
            ],
        commands: [`${BINARY} template --list`, `${BINARY} search <query> --type template`, `${BINARY} manifest --json`],
      }, PACKAGE_NAME))
    }
    return formatBuildHelp(args.locale)
  }
  const kit = buildKit(idea, args.locale)
  if (args.json)
    return printJson(successEnvelope('build.kit', kit, PACKAGE_NAME))
  return formatBuildKit(kit, args.dense)
}
