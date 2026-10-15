<script setup lang="ts">
import { CodeBlock } from '@astryx-vue/core/Code'

const code = `--- a/useUser.ts
+++ b/useUser.ts
@@ -1,6 +1,6 @@
 export function useUser(id: string) {
-  const [user, setUser] = useState<User>()
+  const [user, setUser] = useState<User | null>(null)
   useEffect(() => {
-    fetchUser(id).then(setUser)
+    void fetchUser(id).then(setUser)
   }, [id])
   return user
 }`
</script>

<template>
  <CodeBlock
    :code="code"
    language="tsx"
    title="useUser.ts"
    is-diff
    has-line-numbers
    width="100%"
  />
</template>
