const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    // .venv is an unrelated Python virtualenv that happens to live in this
    // repo; it's not part of the site's source and shouldn't be linted.
    ignores: ['_site/**', 'node_modules/**', '.venv/**'],
  },
  {
    // Browser-side scripts (src/scripts/*.js)
    files: ['src/scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Node-side files: the 11ty build config and the JS data files under
    // src/_data (Eleventy's data cascade loads these with require()).
    files: ['.eleventy.js', 'eslint.config.js', 'src/_data/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
  },
];
