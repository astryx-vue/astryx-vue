import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  ignores: [
    '.agents-work/**',
    '**/coverage/**',
    '**/dist/**',
    'apps/docs/public/monaco/**',
    'apps/docs/components/playground/pages/**',
    'apps/docs/components/playground/playgroundCharts.ts',
    'packages/core/locales/**',
    'packages/lab/src/EmojiPicker/emoji-data.json',
    'packages/cli/src/generated/**',
  ],
  react: false,
  typescript: true,
  vue: {
    a11y: true,
  },
}, {
  files: ['**/*.mjs'],
  rules: {
    // ESLint 10 scope references are not handled correctly by the TypeScript unused-variable rule in JS files.
    'unused-imports/no-unused-vars': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true }],
  },
}, {
  files: ['pnpm-workspace.yaml'],
  rules: {
    // 工作区钉死 3.5.43，peer 范围是 ^3.5.0，同一个包名要留在两个 catalog 里。
    'pnpm/yaml-no-duplicate-catalog-item': ['error', { allow: ['vue'] }],
  },
}, {
  // 调色板引擎是从上游搬来的数值算法，保持原来的写法：函数返回类型靠推断，常量按用到的顺序声明。
  files: ['packages/core/src/palette/**/*.ts'],
  rules: {
    'ts/explicit-function-return-type': 'off',
    'ts/no-use-before-define': 'off',
    'no-unmodified-loop-condition': 'off',
    'jsdoc/check-param-names': 'off',
  },
}, {
  files: [
    'apps/docs/**/*.ts',
  ],
  rules: {
    'import/no-duplicates': 'off',
  },
})
