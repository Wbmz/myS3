module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': ['error', require('./.prettierrc')],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/camelcase': 'off',
    'semi': ['error', 'always'],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 2,
    'unused-imports/no-unused-vars': 1,
  }
}
