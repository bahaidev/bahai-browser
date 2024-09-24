import tippy from 'tippy.js';

export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
export const getCellData = function ({
  applicableFieldText, tr,
  metaApplicableField, fieldInfo /* , fieldLang */
}) {
  const {targetField} = /** @type {{[key: string]: string}} */ (
    metaApplicableField
  );
  const targetFieldIdx = fieldInfo.findIndex(({field}) => {
    return field === targetField;
  });
    // Namespace this tippy plugin from other tippy plugins
  return `<span data-tooltip=""
        data-tippy-content="${tr[targetFieldIdx]}">${applicableFieldText}</span>`;
};

export const done = function () {
  // @ts-expect-error ???
  tippy('[data-tooltip][data-tippy-content]', {
    followCursor: true,
    distance: 50,
    placement: 'right'
  });
};
