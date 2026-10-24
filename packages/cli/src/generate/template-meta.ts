import type { TemplateMeta } from './template-meta/types.ts'
import { ACCOUNT_TEMPLATES } from './template-meta/account.ts'
import { CONTENT_TEMPLATES } from './template-meta/content.ts'
import { DASHBOARD_TEMPLATES } from './template-meta/dashboards.ts'
import { FORM_TEMPLATES } from './template-meta/forms.ts'
import { GALLERY_TEMPLATES } from './template-meta/galleries.ts'
import { SHELL_TEMPLATES } from './template-meta/shells.ts'
import { TABLE_TEMPLATES } from './template-meta/tables.ts'
import { TOOL_TEMPLATES } from './template-meta/tools.ts'

/**
 * Hand-written facts about each playground page. These files are source data, not
 * a generated artifact: the titles and categories come from the playground
 * manifest, but the sentence a person reads and the words `build` scores against
 * have no machine-readable origin.
 *
 * The entries live in one file per template category under `template-meta/`.
 * They are merged here in the playground manifest's order, so the key order of
 * `TEMPLATE_META` follows the manifest.
 */

export type { TemplateMeta } from './template-meta/types.ts'

export const TEMPLATE_META: Record<string, TemplateMeta> = {
  ...CONTENT_TEMPLATES,
  ...DASHBOARD_TEMPLATES,
  ...FORM_TEMPLATES,
  ...GALLERY_TEMPLATES,
  ...ACCOUNT_TEMPLATES,
  ...SHELL_TEMPLATES,
  ...TABLE_TEMPLATES,
  ...TOOL_TEMPLATES,
}
