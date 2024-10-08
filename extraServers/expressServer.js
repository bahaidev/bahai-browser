/* eslint-env node -- Environment */

import express from 'express';

// Todo: Should really get textbrowser to accept multiple Express middleware
// @ts-expect-error Needs types
import createBahaiDateApiServer from 'bahai-date-api/createServer.js';
// @ts-expect-error Needs types
import bahaiReflibDataServer from 'bahai-reflib-data-server/server/index.js';

const expressServer = () => {
  const app = /** @type {import('express').Router} */ (createBahaiDateApiServer());

  const reflibAndDateServer = bahaiReflibDataServer({
    app,
    urlRelativePath: 'bahai-reflib-data-server/'
  });

  const statik = express.static('node_modules/bahai-reflib-data-server/public');
  app.get('/bahai-reflib-data-server/*', (req, res, next) => {
    req.url = req.url.replace('/bahai-reflib-data-server', '');
    statik(req, res, next);
  });

  app.use(express.static('.'));

  return reflibAndDateServer;
};

export default expressServer;
