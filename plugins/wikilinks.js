
export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
export const getCellData = function ({
  applicableFieldText, tr,
  fieldLang, meta, metaApplicableField
}) {
  return `<a href="${/** @type {{[key: string]: string}} */ (
    metaApplicableField
  ).baseURL}${applicableFieldText}">${
    applicableFieldText
  }</a>`;
  // console.log('plugin');
};
