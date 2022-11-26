import istanbul from 'rollup-plugin-istanbul';
import sourcemaps from 'rollup-plugin-sourcemaps';

const rollupConfig = [
  {
    // By building from distribution file, we can avoid
    //   some fragility, since the only based-in dep. now
    //   is popper.js
    // This is the file pointed to by tippy.js' `module`
    //   in `package.json`, so we could check for that
    //   and import that instead, but if that ever ends
    //   up needing more build steps than this dist
    //   file, it could require more work than this.
    input: 'resources/user.js',
    external: [
      'path', 'node-fetch', 'local-xmlhttprequest'
    ],
    output: {
      format: 'esm',
      sourcemap: true,
      file: 'resources/user-instrumented.js'
    },
    plugins: [
      sourcemaps(),
      istanbul()
    ]
  }
];

export default rollupConfig;
