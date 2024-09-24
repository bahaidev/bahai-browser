
// @ts-expect-error Needs types
import indexJSON from '../node_modules/bahai-indexes/indexes/json-flattened/aqdas.js';
// @ts-expect-error Needs types
import {escapeHTML} from '../node_modules/textbrowser/resources/utils/sanitize.js';

export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
export const getCellData = ({
  applicableFieldText, fieldLang,
  getLangDir, fieldInfo, metaApplicableField
}) => {
  const {targetField} = /** @type {{[key: string]: string}} */ (metaApplicableField);
  const targetFieldIdx = fieldInfo.findIndex(({field}) => {
    return field === targetField;
  });
  let output = '';
  if (indexJSON[applicableFieldText] && indexJSON[applicableFieldText].length) {
    output += `<ul dir="${getLangDir(fieldInfo[targetFieldIdx].fieldLang)}">`;
    /** @type {{[key: string]: [string][]}} */
    (indexJSON)[applicableFieldText].forEach(([text]) => {
      output += `<li>${escapeHTML(text)}</li>`;
    });
    output += '</ul>';
  }
  return output || '<span></span>';
};
