<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const code = `interface User {
  id: string;
  name: string;
}

export function useUser(id: string) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    fetchUser(id).then(setUser);
  }, [id]);
  return user;
}`
</script>

<template>
  <CodeBlock
    :code="code"
    language="typescript"
    title="useUser.ts"
    has-line-numbers
    :highlight-lines="[8, 9, 10]"
  />
</template>
