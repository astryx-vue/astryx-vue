import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'lib',
  ignores: [
    '.agents-work/**',
    '**/.vitepress/cache/**',
    '**/coverage/**',
    '**/dist/**',
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
  files: [
    'apps/docs/**/*.ts',
  ],
  rules: {
    'import/no-duplicates': 'off',
  },
})
