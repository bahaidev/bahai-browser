/*
Todo:

When implementing, add back the following to files.json' "plugin-field-mapping":

Hidden Words:
"wordbyword-tooltips": {
    "applicable-fields": {
        "Persian": {
            "targetLanguage": "en-US"
        }
    }
},

*/

export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
// @ts-expect-error INCOMPLETE
export const getCellData = function ({
  applicableFieldText, tr,
  fieldLang, meta
}) {
  // console.log('plugin');
};
