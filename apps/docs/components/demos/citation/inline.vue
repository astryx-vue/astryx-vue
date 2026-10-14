<script setup lang="ts">
import { Citation } from '@astryx-vue/core/Citation'
import { Stack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Stack direction="vertical" :gap="4" style="max-width: 560px">
    <Text type="body">
      React uses a virtual DOM to minimize expensive DOM operations<Citation
        :number="1"
        variant="number"
        :source="{ title: 'React Documentation', url: 'https://react.dev' }"
      />. This approach was inspired by earlier functional UI frameworks<Citation
        :number="2"
        variant="number"
        :source="{ title: 'Elm Architecture', url: 'https://guide.elm-lang.org/architecture/' }"
      />.
    </Text>
    <Text type="body">
      TypeScript adds static types to JavaScript for safer refactoring<Citation
        :number="3"
        variant="label"
        :source="{ title: 'TypeScript Documentation', url: 'https://www.typescriptlang.org', icon: 'https://www.typescriptlang.org/favicon-32x32.png' }"
      />.
    </Text>
  </Stack>
</template>
