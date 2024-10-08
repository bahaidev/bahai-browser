/* eslint-env node -- Environment */
import {join} from 'path';

// @ts-expect-error Needs types
import getHttpQuery from 'httpquery';

const getServer = function () {
  return getHttpQuery({
    cwd: join(process.cwd(), 'node_modules/bahai-indexes'),
    // path: '',
    directory: 'indexes',
    debug: false
  });
};

export default getServer;
