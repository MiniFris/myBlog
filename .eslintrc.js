module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [
    'unused-imports',
    'import',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'indent': ['error', 4, { 'ignoredNodes': ['PropertyDefinition'] }],
    'quotes': [2, 'single', { 'avoidEscape': true }],
    'semi': ['error', 'always', { 'omitLastInOneLineBlock': true }],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { 'vars': 'all', 'varsIgnorePattern': '^_', 'args': 'after-used', 'argsIgnorePattern': '^_' }
    ],
    'import/order': [
      'error',
      {
        'groups': [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
      }
    ],
    'no-trailing-spaces': 'error'
  },
};
