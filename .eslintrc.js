module.exports = {
  'env': {
    'browser': false,
    'node': true,
    'commonjs': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 'latest'
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
    'no-unused-vars': [
      'error',
      { 'vars': 'all', 'args': 'after-used', 'ignoreRestSiblings': false, 'destructuredArrayIgnorePattern': '^_' }
    ]
  }
};
