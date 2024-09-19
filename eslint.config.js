import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'external',
      'resources/user-instrumented.js',
      'coverage'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
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
    rules: {
      'promise/catch-or-return': 'off',
      'promise/always-return': 'off',
      'promise/prefer-await-to-then': 'off',
      'import/unambiguous': 'off'
    }
  },
  ...ashNazg(['sauron', 'node']).map((cfg) => {
    return {
      files: ['test/bahaiwritingsTests.js'],
      languageOptions: {
        globals: {
          assert: 'readonly'
        }
      },
      ...cfg
    };
  }),
  {
    files: ['plugins/**'],
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['extraServers/**'],
    languageOptions: {
      globals: {
        process: 'readonly'
      }
    }
  },
  {
    settings: {
      polyfills: [
        'navigator.serviceWorker'
      ]
    },
    rules: {
      '@stylistic/max-len': 0,
      'no-console': 0,
      'no-shadow': 0
    }
  }
];
