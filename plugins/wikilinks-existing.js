/**
 * @param {string} sel
 */
const $ = (sel) => document.querySelector(sel);
/**
 * @param {string} sel
 */
const $$ = (sel) => [...document.querySelectorAll(sel)];

export const escapeColumn = false;

/** @type {import('../types.js').GetCellData} */
export const getCellData = function ({
  applicableFieldText, tr,
  fieldLang, meta, metaApplicableField: mf
}) {
  const metaApplicableField = /** @type {{[key: string]: string}} */ (mf);
  return `<a class="wikilinks-existing-user" style="color: gray;"
    data-user-url="${metaApplicableField.userURL}"
    data-user-edit-url="${metaApplicableField.userEditURL}"
    href="${metaApplicableField.baseURL.replaceAll(
      '%s', /** @type {string} */ (applicableFieldText)
    )}">${
      applicableFieldText
    }</a>
  <span id="wikilinks-existing-message${applicableFieldText}" hidden style="color: red;">
    Add a username in "Preferences"
  </span>
  <span id="wikilinks-existing-userLinkHolder${applicableFieldText}"></span>`;
};

/** @type {import('../types.js').Done} */
export const done = ({$p, thisObj}) => {
  /** @type {HTMLAnchorElement[]} */
  ($$('.wikilinks-existing-user')).forEach((userInfo) => {
    const user = localStorage.getItem(
      'bahai-browser-wikilinks-existing-username'
    );

    const parNumber = /** @type {string} */ (userInfo.textContent?.trim());
    /** @type {HTMLSpanElement} */
    ($(`#wikilinks-existing-message${parNumber}`)).hidden = Boolean(user);

    const userLinkHolder = /** @type {HTMLSpanElement} */ (
      $(`#wikilinks-existing-userLinkHolder${parNumber}`)
    );
    if (user) {
      userLinkHolder.textContent = '';
      const editOwnUrl = /** @type {string} */ (
        userInfo.dataset.userEditUrl
      ).replaceAll(
        '%USER', user
      ).replaceAll('%s', parNumber);
      const a = document.createElement('a');
      a.href = editOwnUrl;
      a.textContent = 'my own user page';
      userLinkHolder.append('(or visit ', a, ')');
    }
    userLinkHolder.hidden = !user;

    userInfo.addEventListener('mouseover', async (e) => {
      // We don't do this automatically as it would be demanding on the server
      const resp = await fetch(
        // 'http://127.0.0.1:8000',
        'https://bahai9.com/api.php?action=query' +
          // '&origin=' + encodeURIComponent('https://bahai9.com') + // Should work but isn't
          '&origin=*' + // Our server is supposedly bahai9.com
          '&format=json&formatversion=2' +
          '&list=categorymembers&cmtitle=Category:User/Kit%C3%A1b-i-Aqdas/par' + parNumber,
        {
          // credentials: 'include' // Do not use with origin=*
          // mode: 'no-cors'
        }
      );
      // console.log('resp', resp);

      // const pageIsExisting = resp.ok;
      // resp.headers['last-modified'];
      const json = await resp.json();
      // console.log('json', json);
      const pageIsExisting = json.query.categorymembers[0];
      // console.log('pageIsExisting', pageIsExisting);

      /** @type {HTMLAnchorElement} */
      (e.target).style.color = pageIsExisting ? 'blue' : 'orange';
    });
  });
};
