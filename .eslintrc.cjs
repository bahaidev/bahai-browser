'use strict';

module.exports = {
  extends: ['ash-nazg/sauron-overrides'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false
  },
  settings: {
    polyfills: [
      'Array.forEach',
      'Array.map',
      'Blob',
      'console',
      'Date.now',
      'document.body',
      'document.dir',
      'document.hasFocus',
      'document.querySelector',
      'document.querySelectorAll',
      'Error',
      'fetch',
      'indexedDB',
      'JSON',
      'location.href',
      'location.host',
      'location.protocol',
      'navigator.clipboard',
      'navigator.serviceWorker',
      'Object.entries',
      'Object.values',
      'Promise',
      'Request',
      'SpeechSynthesisUtterance',
      'URL',
      'window',
      'window.getSelection',
      'XMLSerializer'
    ]
  },
  overrides: [
    {
      files: ['*.html'],
      rules: {
        'import/unambiguous': 0
      }
    },
    {
      files: ['sw.js'],
      rules: {
        'import/unambiguous': 0,
        strict: 0
      }
    },
    {
      files: ['test/**/*.js', 'cypress/**'],
      extends: ['ash-nazg/sauron-overrides', 'plugin:cypress/recommended'],
      rules: {
        'promise/catch-or-return': 'off',
        'promise/always-return': 'off',
        'promise/prefer-await-to-then': 'off',
        'import/unambiguous': 'off'
      }
    },
    {
      files: ['test/bahaiwritingsTests.js'],
      extends: ['ash-nazg/sauron-node-overrides', 'plugin:cypress/recommended']
    },
    {
      files: 'plugins/**',
      rules: {
        'no-unused-vars': 'off'
      }
    }
  ],
  env: {
    node: false,
    browser: true
  },
  rules: {
    '@stylistic/max-len': 0,
    'no-console': 0,
    'no-shadow': 0,
    // Reenable and add descriptions for `eslint-env`
    'eslint-comments/require-description': 0
  }
};
