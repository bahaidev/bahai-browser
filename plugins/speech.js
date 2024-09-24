/* eslint-disable no-alert -- Simple errors */

// Todo: When Google may support Persian voice (filed
//  https://issuetracker.google.com/issues/171724064 ),
//  add `"targetLanguage": "fa"`
//  to Hidden Words' `applicable-fields: {Persian: {}}` in `files.json`

export const escapeColumn = false;
const locales = /** @type {{[key: string]: {[key: string]: string}}} */ ({
  'en-US': {
    listenToAll: '(Listen to all)'
  },
  ar: {
    listenToAll: '(Listen to all)'
  }
});

/** @type {import('../types.js').GetCellData} */
export const getCellData = function ({
  applicableFieldText, $p,
  applicableFieldIdx, fieldInfo, getLangDir
}) {
  const lang = /** @type {string} */ ($p.get('lang', true));

  /**
   * @param {string} key
   */
  const l = (key) => {
    const locale = locales[lang] || locales['en-US'];
    return locale[key];
  };
  return /** @type {string} */ (
    applicableFieldText
  ).split(/\s+/u).reduce((s, text) => {
    return s +
            `<a data-speech="_" href="javascript:void(0);">${text}</a> `;
  }, `<div dir="${getLangDir(fieldInfo[applicableFieldIdx].fieldLang)}">`) +
        '<br /><br />' +
        ` <a data-speech="${applicableFieldText}" href="javascript:void(0);">
            ${l('listenToAll')}
        </a></div>`;
};

let run = false;

/** @type {import('../types.js').Done} */
export const done = function (cfg) {
  // eslint-disable-next-line prefer-destructuring -- TS
  const language = /** @type {{[key: string]: string}} */ (cfg.meta).language;
  if (run) {
    return;
  }
  run = true;

  /** @type {SpeechSynthesisVoice} */
  let voice;
  let notify = false;
  speechSynthesis.addEventListener('voiceschanged', () => {
    console.log('voices changed');
    // Todo: Save voice in map so `applicableFields-><field>->targetLanguage`
    //  can override plugin default language and `click` listener below will
    //  check this map
    const voices = speechSynthesis.getVoices().filter(({lang, name}) => {
      return lang === language || lang.startsWith(language + '-');
    });
    console.log('voices', voices);
    // Todo: Make `voice` as preference instead
    [voice] = voices;
    if (notify) {
      alert('Voices are now available');
    }
  });
  window.addEventListener('click', (e) => {
    // eslint-disable-next-line prefer-destructuring -- TS
    const target = /** @type {EventTarget & HTMLElement} */ (e.target);
    // eslint-disable-next-line prefer-destructuring -- TS
    let textContent = /** @type {string} */ (target.textContent);
    const {dataset: {speech}} = target;
    if (!speech) {
      return;
    }
    if (!voice) {
      notify = true;
      alert('Please wait while voices load');
      return;
    }
    if (speech !== '_') {
      textContent = speech;
    }
    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.voice = voice;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
};
