<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const code = `import {useState, useEffect} from 'react';

export function useUser(id: string) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(\`/api/users/\${id}\`)
      .then(res => res.json())
      .then(setUser);
  }, [id]);

  return user;
}`
</script>

<template>
  <CodeBlock :code="code" language="typescript" title="useUser.ts" has-line-numbers has-copy-button />
</template>
