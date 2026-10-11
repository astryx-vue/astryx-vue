<script setup lang="ts">
import { Markdown } from '@astryx-vue/core/Markdown'

const content = '| Capability | Available on the free plan | Included in the team plan | Notes for administrators |\n|---|---|---|---|\n| Single sign-on | No | Yes | Requires a verified domain and a SAML or OIDC provider. |\n| Audit log retention | 7 days | 400 days | Exportable as newline-delimited JSON from the admin console. |\n| Scheduled exports | No | Yes | Runs nightly; a failed run retries twice before it alerts the owner. |\n| Seats included | 3 | 25 | Additional seats are billed monthly and prorated. |'
</script>

<template>
  <div class="markdown-preview__column" style="width: 390px">
    <Markdown :content="content" />
  </div>
</template>
