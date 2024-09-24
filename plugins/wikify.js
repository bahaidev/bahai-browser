
export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
export const getCellData = function ({
  applicableFieldText, tr,
  fieldLang, meta, metaApplicableField: maf
}) {
  const metaApplicableField = /** @type {{[key: string]: string}} */ (maf);
  let style = metaApplicableField.width ? `width: ${metaApplicableField.width};` : '';
  if (metaApplicableField.height) {
    style += `height: ${metaApplicableField.height};`;
  }
  return `<iframe ${style ? ` style="${style}"` : ''}src="${metaApplicableField.baseURL}${applicableFieldText}?useskin=chameleon">${
    applicableFieldText
  }</iframe>`;
};
