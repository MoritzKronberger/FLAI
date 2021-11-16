module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  globals: { module: false },
  env: { 'vue/setup-compiler-macros': true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    indent: ['error', 2],
    'no-multiple-empty-lines': 'warn',
    camelcase: 'error', // Checks for lowerCamelCase
    quotes: ['error', 'single'],
    'no-var': 'error',
    'prefer-const': [
      'error',
      {
        destructuring: 'all', //Checks for destructured variables, where all should be const. Can be changed to "any"
        ignoreReadBeforeAssign: false,
      },
    ],
    'no-use-before-define': 'error',
    eqeqeq: [
      'error',
      'always',
      {
        null: 'ignore',
      },
    ],
  },
}
