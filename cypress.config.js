import {defineConfig} from 'cypress';
import codeCoverage from '@cypress/code-coverage/task.js';

export default defineConfig({
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents (on, config) {
      // implement node event listeners here

      codeCoverage(on, config);

      return config;
    }
  }
});
