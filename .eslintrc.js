module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  globals: {
    __dirname: 'readonly',
    process: 'readonly',
  },
  rules: {
    'object-curly-newline': 'off',
    'max-len': [
      2,
      120,
    ],
    'no-param-reassign': ['error', { props: false }],
  },
};
