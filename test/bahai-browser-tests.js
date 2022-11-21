/* eslint-disable import/unambiguous -- Imports are boostrapped */
/* globals path, appBase, JsonRefs, Ajv,
    getJSON, __dirname -- Polyglot */

/**
 *
 * @param {external:JSON} obj
 * @returns {external:JSON}
 */
function cloneJSON (obj) {
  return JSON.parse(JSON.stringify(obj));
}

const textbrowserDataSchemasBase = appBase +
  'node_modules/textbrowser-data-schemas/schemas/';
const textbrowserBase = appBase + 'node_modules/textbrowser/';
const bahaiwritingsBase = appBase + 'node_modules/bahaiwritings/';
const schemaBase = textbrowserBase + 'general-schemas/';
// const localesBase = textbrowserBase + 'locales/';
// const appdataBase = textbrowserBase + 'appdata/';
const jsonSchemaSpec = 'node_modules/json-metaschema/draft-07-schema.json';

/**
* @param {PlainObject} schema The schema object
* @param {PlainObject} data The instance document to validate
* @param {string[][]} extraSchemas
* @param {PlainObject} additionalOptions
* @returns {boolean} Whether valid or not
*/
function validate (schema, data, extraSchemas = [], additionalOptions = {}) {
  const ajv = new Ajv({
    allowMatchingProperties: true,
    addUsedSchema: false,
    ...additionalOptions
  });
  let valid;
  try {
    ajv.addFormat('html', () => true);
    ajv.addFormat('language-code', () => true);
    extraSchemas.forEach(([key, val]) => {
      ajv.addSchema(val, key);
    });
    valid = ajv.validate(schema, data);
  } catch (e) {
    // eslint-disable-next-line no-console -- CLI
    console.log(e);
  } finally {
    if (!valid && ajv.errors?.length) {
      // eslint-disable-next-line no-console -- CLI
      console.log(JSON.stringify(ajv.errors, null, 2));
    }
  }
  return valid;
}

describe('bahaiwritings Tests', function () {
  it('files.json test', async function () {
    this.timeout(20000);
    const extraSchemaFiles = [
      'array-of-arrays.jsonschema',
      'locale.jsonschema',
      'metadata.jsonschema',
      'table.jsonschema',
      'table-container.jsonschema'
    ];
    const results = await Promise.all([
      JsonRefs.resolveRefsAt(path.join(__dirname, appBase, 'files.json')),
      // getJSON(path.join(
      //   __dirname,
      //   appBase + jsonSchemaSpec
      // )),
      ...[
        'files.jsonschema',
        ...extraSchemaFiles
      ].map((f) => getJSON(path.join(__dirname, schemaBase, f)))
    ]);
    const [
      {resolved: filesData},
      // jsonSchema,
      filesSchema,
      ...extraSchemaObjects
    ] = results;
    const extraSchemas = extraSchemaObjects.map((eso, i) => [
      extraSchemaFiles[i], eso
    ]);
    const valid = validate(filesSchema, filesData, extraSchemas);
    assert.strictEqual(valid, true);

    // This doesn't remove all as hoped as don't have
    //   `additionalProperties: false` set; see
    //   https://github.com/ajv-validator/ajv/issues/2170
    // const data2 = cloneJSON(filesData);
    // const valid2 = validate(filesSchema, data2, extraSchemas, {
    //   removeAdditional: 'all',
    //   validateSchema: false
    // });
    // assert.strictEqual(valid2, true);
    // const diff = jsonpatch.compare(data, data2).filter((dff) => {
    //   // Apparently need to filter due to limitations per
    //   //   https://github.com/epoberezkin/ajv#filtering-data
    //   return !dff.path || (dff.op === 'remove' &&
    //     !(/\/additionalItems$/u).test(dff.path));
    // });
    // assert.strictEqual(diff.length, 0);
    //
    // const schemas = results.slice(2);
    // schemas.forEach((schma, i) => {
    //   validate(jsonSchema, schma, undefined, {
    //     validateSchema: false
    //   });
    //
    //   const schema2 = cloneJSON(schma);
    //   validate(jsonSchema, schema2, extraSchemas, {
    //     removeAdditional: 'all',
    //     validateSchema: false
    //   });
    //   const dff = jsonpatch.compare(schma, schema2);
    //   assert.strictEqual(dff.length, 0);
    // });
  });
  it('Specific data files', async function () {
    this.timeout(50000);
    const specificFiles = [
      'aqdas.json',
      'Bible.json',
      'Epistle to the Son of the Wolf.json',
      'Gems of Divine Mysteries.json',
      'gleanings.json',
      'Hidden Words.json',
      'peace.json',
      'pm.json',
      'quran.json',
      'wwtf.json'
    ];
    const otherSpecificFiles = [
      'lights.json',
      'Collins.json'
    ];
    const tableFiles = [
      'table.jsonschema'
    ];

    // Todo: We could also check that the `table` and `fields`-pointed
    //   metadata exists and is valid
    const results = await Promise.all([
      ...specificFiles.map((f) => {
        return JsonRefs.resolveRefsAt(
          path.join(__dirname, bahaiwritingsBase, 'data/writings/' + f)
        );
      }),
      ...specificFiles.map((f) => {
        return getJSON(
          path.join(
            __dirname,
            bahaiwritingsBase,
            'data/writings/schemas/' + f + 'schema'
          )
        );
      }),
      ...otherSpecificFiles.map((f) => {
        return JsonRefs.resolveRefsAt(
          path.join(__dirname, bahaiwritingsBase, 'data/other-works/' + f)
        );
      }),
      ...otherSpecificFiles.map((f) => {
        return getJSON(path.join(
          __dirname,
          bahaiwritingsBase,
          'data/other-works/schemas/' + f + 'schema'
        ));
      }),
      ...tableFiles.map((f) => getJSON(path.join(
        __dirname,
        textbrowserDataSchemasBase,
        f
      )))
    ]);

    let cursor = 0;
    const [
      dataFiles, schemaFiles, otherDataFiles, otherSchemaFiles, [table]
    ] = [
      specificFiles, specificFiles, otherSpecificFiles,
      otherSpecificFiles, tableFiles
    ].map((files) => {
      // eslint-disable-next-line no-return-assign -- Convenient
      return results.slice(cursor, cursor += files.length);
    });

    const extraSchemas = [
      [
        '../../../node_modules/textbrowser-data-schemas/' +
          'schemas/table.jsonschema',
        table
      ]
    ];
    const testSchemaFiles = (dtaFiles, schmaFiles) => {
      dtaFiles.forEach(({resolved: {data}}, i) => {
        const schema = schmaFiles[i];
        const vald = validate(schema, data, extraSchemas);
        assert.strictEqual(vald, true);

        // This doesn't remove all as hoped as don't have
        //   `additionalProperties: false` set; see
        //   https://github.com/ajv-validator/ajv/issues/2170
        // const data2 = cloneJSON(data);
        // const vald2 = validate(schema, data2, extraSchemas, {
        //   removeAdditional: 'all',
        //   validateSchema: false
        // });
        // assert.strictEqual(vald2, true);
        // const diff = jsonpatch.compare(data, data2);
        // assert.strictEqual(diff.length, 0);
      });
    };
    testSchemaFiles(dataFiles, schemaFiles);
    testSchemaFiles(otherDataFiles, otherSchemaFiles);
  });
  it('site.json test', async function () {
    this.timeout(20000);
    const results = await Promise.all([
      JsonRefs.resolveRefsAt(path.join(__dirname, appBase, 'site.json')),
      getJSON(path.join(
        __dirname,
        appBase + jsonSchemaSpec
      )),
      JsonRefs.resolveRefsAt(
        path.join(__dirname, schemaBase, 'site.jsonschema')
      ),
      getJSON(path.join(__dirname, schemaBase, 'locale.jsonschema'))
    ]);
    const [
      {resolved: data}, jsonSchema, {resolved: schema}, localeSchema
    ] = results;
    const extraSchemas = [['locale.jsonschema', localeSchema]];
    const valid = validate(schema, data, extraSchemas);
    assert.strictEqual(valid, true);

    // This doesn't remove all as hoped as don't have
    //   `additionalProperties: false` set; see
    //   https://github.com/ajv-validator/ajv/issues/2170
    // const data2 = cloneJSON(data);
    // const valid2 = validate(schema, data2, extraSchemas, {
    //   removeAdditional: 'all',
    //   validateSchema: false
    // });
    // assert.strictEqual(valid2, true);
    // const diff = jsonpatch.compare(data, data2);
    // assert.strictEqual(diff.length, 0);

    const schemas = results.slice(2);
    schemas.forEach((schma, i) => {
      const vlid = validate(jsonSchema, schma, extraSchemas);
      assert.strictEqual(vlid, true);

      // This doesn't remove all as hoped as don't have
      //   `additionalProperties: false` set; see
      //   https://github.com/ajv-validator/ajv/issues/2170
      // const schema2 = cloneJSON(schma);
      // const vlid2 = validate(jsonSchema, schema2, extraSchemas, {
      //   removeAdditional: 'all',
      //   validateSchema: false
      // });
      // assert.strictEqual(vlid2, true);
      // const dff = jsonpatch.compare(schma, schema2);
      // assert.strictEqual(dff.length, 0);
    });
  });

  it('userJSON tests', async () => {
    const [jsonSchema, userJSONSchema, userJSON] = await getJSON([
      path.join(
        __dirname,
        appBase + jsonSchemaSpec
      ),
      path.join(
        __dirname,
        schemaBase,
        'user-json.jsonschema'
      ),
      path.join(
        __dirname,
        appBase + 'resources/user.json'
      )
    ]);
    console.log('userJSONSchema', userJSONSchema);
    const validSchema = validate(jsonSchema, userJSONSchema);
    assert.strictEqual(validSchema, true);

    const valid = validate(userJSONSchema, userJSON);
    assert.strictEqual(valid, true);

    // const userJSONSchema2 = cloneJSON(userJSONSchema);
    // validate('Schema test', jsonSchema, userJSONSchema, undefined, {
    //   validateSchema: false
    // });
    // const diff = jsonpatch.compare(userJSONSchema, userJSONSchema2);
    // if (diff.length) {
    //   console.log(`diff for data file`, diff);
    // }
    // assert.strictEqual(diff.length, 0);
    //
    // const userJSON2 = cloneJSON(userJSON);
    // validate('Schema test', userJSONSchema, userJSON, undefined, {
    //   validateSchema: false
    // });
    // const diff2 = jsonpatch.compare(userJSON, userJSON2);
    // if (diff2.length) {
    //   console.log(`diff for data file`, diff2);
    // }
    // assert.strictEqual(diff2.length, 0);
  });
});
