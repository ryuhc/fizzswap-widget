import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          'pathGroups': [
            {
              'pattern': 'react*',
              'group': 'builtin'
            },
            {
              'pattern': '@/hooks/*',
              'group': 'internal',
            },
            {
              'pattern': '@/utils/*',
              'group': 'internal',
            },
            {
              'pattern': '@/components/*',
              'group': 'parent',
            },
            {
              'pattern': '@/modal/*',
              'group': 'sibling',
            },
            {
              'pattern': '@/state/*',
              'group': 'index',
            },
            {
              'pattern' : '@/styles/*',
              'group': 'object',
            },
            {
              'pattern' : '@/assets/*',
              'group': 'object',
              'position': 'after'
            },
          ],
          'newlines-between': 'always',
          'pathGroupsExcludedImportTypes': ['react*'],
          'alphabetize': {
            'order': 'asc'
          }
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  },
)
