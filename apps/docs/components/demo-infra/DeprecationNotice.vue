<script setup lang="ts">
import type { ComponentDeprecation } from './demoMeta'
import type { DocsLocale } from './docs-i18n'
import { Banner } from '@astryx-vue/core/Banner'
import { Button } from '@astryx-vue/core/Button'
import { computed } from 'vue'
import { componentName, isComponentSlug } from './componentCatalog'
import { componentDocsCopy, localePath } from './docs-i18n'

/** 废弃组件文档页顶部的提示：标题说改用哪个组件，下面是迁移说明，旁边链到替代组件的文档。 */
const props = defineProps<{ locale: DocsLocale, deprecation: ComponentDeprecation }>()

const text = computed(() => componentDocsCopy[props.locale])
const replacement = computed(() => {
  const slug = props.deprecation.replacement
  return isComponentSlug(slug) ? componentName(props.locale, slug) : slug
})
</script>

<template>
  <Banner
    class="docs-deprecation-notice"
    status="warning"
    :collapsible="false"
    :title="text.deprecatedNotice.replace('{name}', replacement)"
    :description="deprecation.description[locale]"
  >
    <template #end>
      <Button
        variant="secondary"
        size="sm"
        :label="text.viewReplacement.replace('{name}', replacement)"
        :href="localePath(locale, `/components/${deprecation.replacement}`)"
      />
    </template>
  </Banner>
</template>
