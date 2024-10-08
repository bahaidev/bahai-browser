import TextBrowser from 'textbrowser';

// Todo: Add a favicon file (and remove empty one in HTML?)
// import loadStylesheets from '../node_modules/load-stylesheets/dist/index-es.js';
// loadStylesheets('favicon.ico'); // No need for `await`

// Todo: Reenable the following in `files.json`?
// {"name": "collins", "file": {"$ref": "data/other-works/Collins.json"}, "schemaFile": "Collins.jsonschema", "metadataFile": "Collins.metadata"},

/*
// This will only work from subdomains; would need postMessage()
//    routine to allow introspection
const params = new URLSearchParams(location.hash.slice(1));
document.domain = params.get('domain') || document.domain; // Let this be iframe-embeddable
*/

const tb = new TextBrowser({
  // languages: 'node_modules/textbrowser/appdata/languages.json', // Default
  // serviceWorkerPath: 'sw.js', // Default
  // site: 'site.json', // Default
  // localizeParamNames: true, // Not well-tested
  // hideFormattingSection: true,
  // requestPersistentStorage: false,
  // showEmptyInterlinear: false,
  // showTitleOnSingleInterlinear: false,
  namespace: 'bahaiwritings',
  version: '0.44.0',
  files: 'files.json',
  stylesheets: [
    '@builtin', 'resources/user.css', 'node_modules/tippy.js/dist/tippy.css'
  ],
  allowPlugins: true,
  // dynamicBasePath: '',
  trustFormatHTML: true,
  skipIndexedDB: false,
  interlinearSeparator: '<hr />', // Defaults to `<br /><br />`,
  /**
   * @param {{
   *   $: (sel: string) => HTMLElement,
   *   l: import('intl-dom').I18NCallback
   *   jml: import('jamilih').jml,
   *   paramsSetter: import('../types.js').ParamsSetter,
   *   getDataForSerializingParamsAsURL: import('../types.js').GetDataForSerializingParamsAsURL,
   *   work: string,
   *   replaceHash: (paramsCopy: URLSearchParams) => string,
   *   getFieldAliasOrNames: import('../types.js').GetFieldAliasOrNames
   * }} cfg
   * @returns {import('jamilih').JamilihArray}
   */
  preferencesPlugin: ({
    $, l, jml, paramsSetter, getDataForSerializingParamsAsURL, work,
    replaceHash, getFieldAliasOrNames
  }) => ['div', [
    // Todo: Move this into plugin and have textbrowser call
    ['label', [
      'Your wiki user name: ',
      ['input', {
        $on: {
          change (e) {
            localStorage.setItem(
              'bahai-browser-wikilinks-existing-username',
              /** @type {HTMLInputElement} */
              (e.target).value
            );
          }
        },
        id: 'wikilinks-existing-username',
        value: localStorage.getItem('bahai-browser-wikilinks-existing-username') || '',
        placeholder: 'e.g., Brettz9'
      }],
      ['br', 'br']
    ]],
    // Todo: i18nize (ideally with intl-dom)
    (/** @type {Window & typeof globalThis & {chrome: any}} */ (window).chrome
      ? ['div', {id: 'generate-results', hidden: 'true'}, [
        ['div', {class: 'msg-error', hidden: 'true'}, [
          'Failed to copy to clipboard'
        ]],
        ['div', {class: 'msg-success', hidden: 'true'}, [
          'Sucessfully copied to clipboard!'
        ]],
        ['div', {id: 'loading'}, [
          'Loading...'
        ]],
        ['ol', {id: 'steps', hidden: 'true'}, [
          ['li', [
            'Copy the following code (or ',
            ['button', {id: 'copy', $on: {
              async click () {
                const closeMessages = () => {
                  setTimeout(() => {
                    $('.msg-success').hidden = true;
                    $('.msg-error').hidden = true;
                  }, 2000);
                };
                try {
                  await navigator.clipboard.writeText(
                    /** @type {HTMLInputElement} */
                    ($('#code')).value
                  );
                  $('.msg-success').hidden = false;
                // eslint-disable-next-line no-unused-vars -- Ok
                } /* istanbul ignore next -- How to trigger? */ catch (err) {
                  /* istanbul ignore next -- How to trigger? */
                  $('.msg-error').hidden = false;
                } finally {
                  closeMessages();
                }
              }
            }}, [
              'click me'
            ]],
            ' to copy automatically):',
            ['textarea', {id: 'code'}]
          ]],
          ['li', [
            'The following steps should be done together (without coming back to this page)',
            ['ol', {type: 'a'}, [
              ['li', [
                'Visit ',
                ['i', [
                  'chrome://settings/searchEngines'
                ]],
                ' (but don\'t copy-paste this URL or you may overwrite the copying just done)'
              ]],
              ['li', [
                'Open the Console (cmd-option-j)'
              ]],
              ['li', [
                'Paste the code copied in the previous step into the console and hit enter'
              ]]
            ]]
          ]]
        ]]
      ]]
      /* istanbul ignore next -- How to trigger? */
      : ['div', {id: 'generate-results', hidden: 'true'}, [
        ['div', {id: 'loading'}, [
          'Loading...'
        ]]
      ]]
    ),
    ['button', {
      title: l('bookmark_generation_tooltip'),
      $on: {
        async click () { // Todo: Give option to edit (keywords and work URLs)
          if ($('#generate-results').hidden) {
            $('#generate-results').hidden = false;
          } else {
            $('#generate-results').hidden = true;
            return;
          }

          /**
           * @param {{
           *   fieldAliasOrNames: (
           *     string|string[]|import('../types.js').LocalizationStrings
           *   )[]|undefined,
           *   workName: string
           * }} cfg
           */
          const getUrlForFieldAliasOrNames = ({
            fieldAliasOrNames, workName
          }) => {
            const paramsCopy = paramsSetter({
              ...getDataForSerializingParamsAsURL(),
              // eslint-disable-next-line object-shorthand -- TS
              fieldAliasOrNames: /** @type {string[]} */ (fieldAliasOrNames),
              workName: work, // Delete work of current page
              type: 'shortcutResult'
            });
            return replaceHash(paramsCopy) + `&work=${workName}&${workName}-startEnd1=%s`; // %s will be escaped if set as param; also add changeable workName here
          };

          const fieldAliasOrNames = await getFieldAliasOrNames();

          /* istanbul ignore if */
          if (!(/** @type {Window & typeof globalThis & {chrome: any}} */ (
            window
          ).chrome)) {
            const date = Date.now();
            const ADD_DATE = date;
            const LAST_MODIFIED = date;
            const blob = new Blob([
              new XMLSerializer().serializeToString(
                jml({$document: {
                  $DOCTYPE: {name: 'NETSCAPE-Bookmark-file-1'},
                  title: /** @type {string} */ (l('Bookmarks')),
                  body: [
                    ['h1', [l('Bookmarks_Menu')]],
                    ...fieldAliasOrNames.flatMap(({groupName, worksToFields}) => {
                      return /** @type {import('jamilih').JamilihChildren} */ ([
                        ['dt', [
                          ['h3', {
                            ADD_DATE,
                            LAST_MODIFIED
                          }, [
                            groupName
                          ]]
                        ]],
                        ['dl', [
                          ['p'],
                          ...worksToFields.map(({fieldAliasOrNames, workName, shortcut: SHORTCUTURL}) => {
                            // Todo (low): Add anchor, etc. (until handled by `work-startEnd`); &aqdas-anchor1-1=2&anchorfield1=Paragraph
                            // Todo: option for additional browse field groups (startEnd2, etc.)
                            // Todo: For link text, use `heading` or `alias` from metadata files in place of workName (requires loading all metadata files though)
                            // Todo: Make Chrome NativeExt add-on to manipulate its search engines (to read a bookmarks file from Firefox properly, i.e., including keywords) https://www.makeuseof.com/answers/export-google-chrome-search-engines-address-bar/

                            const url = getUrlForFieldAliasOrNames({
                              // eslint-disable-next-line object-shorthand -- TS
                              workName: /** @type {string} */ (workName),
                              fieldAliasOrNames
                            });

                            return ['dt', [
                              ['a', {
                                href: url,
                                ADD_DATE,
                                LAST_MODIFIED,
                                SHORTCUTURL
                              }, [
                                workName
                              ]]
                            ]];
                          })
                        ]]
                      ]);
                    })
                  ]
                }})
              ).replaceAll(
                // Chrome has a quirk that requires this (and not
                //   just any whitespace)
                // We're not getting the keywords with Chrome,
                //   but at least usable for bookmarks (though
                //   not the groups apparently); update: actually, now we're
                //   not using this in Chrome at all, but keeping in case expose
                '<dt>',
                '\n<dt>'
              )
            ], {type: 'text/html'});
            const url = window.URL.createObjectURL(blob);
            const a = jml('a', {
              hidden: true,
              download: 'bookmarks.html',
              href: url
            }, $('#main'));
            a.click();
            URL.revokeObjectURL(url);
            $('#loading').hidden = true;
            return;
          }

          const urls = fieldAliasOrNames.flatMap(({worksToFields}) => {
            return worksToFields.map(({fieldAliasOrNames, workName, shortcut: SHORTCUTURL}) => {
              const url = getUrlForFieldAliasOrNames({
                // eslint-disable-next-line object-shorthand -- TS
                workName: /** @type {string} */ (workName),
                fieldAliasOrNames
              });
              return {
                // eslint-disable-next-line camelcase --- Using for i18n
                short_name: workName,
                keyword: SHORTCUTURL,
                url
              };
            });
          });
          // Keep `var` instead of `let`/`const` so can be re-pasted if needed
          /** @type {HTMLInputElement} */
          ($('#code')).value = `  var searchEngines = ${JSON.stringify(urls)};

searchEngines.forEach(({ short_name, keyword, url }) => {
// Actual search engine import magic
chrome.send('searchEngineEditStarted', [-1]);
chrome.send('searchEngineEditCompleted', [short_name, keyword, url]);
});`;
          $('#loading').hidden = true;
          $('#steps').hidden = false;
        }
      }
    }, [l('Generate_bookmarks')]]
  ]]
});
await tb.init();
// Stylesheets have loaded and init process begun/completing
