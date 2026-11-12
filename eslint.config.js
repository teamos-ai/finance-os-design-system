import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

/**
 * Flat ESLint config for Finance OS DS (ESLint 9 + typescript-eslint 8).
 * `prettier` is last so formatting rules never fight Prettier.
 * Run `npm run lint` (report) or `npm run lint:fix` (autofix).
 */
export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.vite', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,mts}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  // Build + audit scripts run under Node and may use CommonJS-ish patterns.
  {
    files: ['scripts/**/*.{mts,mjs,ts}', '*.config.{ts,js}'],
    languageOptions: { globals: { ...globals.node } },
  },
  prettier,
)
