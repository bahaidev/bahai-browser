/*
Todo:

When implementing, add back the following to files.json' "plugin-field-mapping":

aqdas:

"romanize": {
    "applicable-fields": {
        "Arabic": {}
    }
},

Hidden Words:

"romanize": {
    "applicable-fields": {
        "Persian": {}
    }
},

*/

/** @type {import('../types.js').GetCellData} */
// @ts-expect-error INCOMPLETE
export const getCellData = function ({
  applicableFieldText, tr,
  fieldLang, meta
}) {
  // console.log('plugin');
};
