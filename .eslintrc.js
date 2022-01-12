module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  globals: {
    React: true,
    App: true,
    JSX: true,
  },
  plugins: ['@babel/eslint-plugin', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-var-requires': 0,
    'prettier/prettier': 'error',
    'no-console': ['warn'],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    'import/no-unresolved': [2, { commonjs: true, amd: true }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
  },
  ignorePatterns: ['/**/node_modules/**', '**/build/**'],
  settings: {
    'import/resolver': {
      node: {
        paths: 'src/',
      },
      'babel-module': {
        root: 'src/',
        alias: {},
      },
    },
  },
}
