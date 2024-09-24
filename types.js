/**
 * @typedef {{
 *   namespace: string
 * }} TextBrowser
 */

/**
 * @typedef {{
 *    get: (param: string, skip?: boolean) => string|null
 * }} IntlURLSearchParams
 */

/**
 * @typedef {{
*   code: string,
*   direction: "ltr"|"rtl",
*   locale: {
*     $ref: string
*   }
* }} LanguageInfo
*/

/**
 * @typedef {{
*   userJSON: string,
*   languages: string,
*   serviceWorkerPath: string,
*   files: string,
*   namespace: string,
*   stylesheets?: string[]
* }} ServiceWorkerConfig
*/
/**
 * @typedef {{
*   nodeActivate: boolean,
*   port: number,
*   domain: string,
*   basePath: string,
*   interlinearSeparator: string,
*   localizeParamNames: boolean,
*   trustFormatHTML: boolean,
*   allowPlugins: boolean,
*   showEmptyInterlinear: boolean,
*   showTitleOnSingleInterlinear: boolean,
*   serviceWorkerPath: string,
*   userJSON: string,
*   languages: string,
*   files: string,
*   namespace: string,
*   httpServer: string,
*   expressServer: string
* }} UserOptions
*/
/**
 * @typedef {ServiceWorkerConfig &
*   UserOptions & {
*     lang: string[],
*     langs: LanguageInfo[],
*     fallbackLanguages: string[],
*     log: (...args: any[]) => void,
*     nodeActivate?: boolean,
*     port?: number,
*     skipIndexedDB: false,
*     noDynamic: false,
*   }
* } ResultsDisplayServerContext
*/

/**
 * @typedef {{
*   field?: string,
*   fieldAliasOrName: string|string[]|LocalizationStrings,
*   escapeColumn: boolean,
*   fieldLang: string,
*   plugin?: Plugin,
*   applicableField?: string,
*   meta?: {[key: string]: string},
*   j?: number,
*   placement?: number
*   metaApplicableField?: {
*     [key: string]: string
*   },
*   onByDefault?: boolean
* }[]} FieldInfo
*/

/**
 * @todo Complete
 * @typedef {{
*   path: string,
*   onByDefault?: boolean,
*   lang?: string,
*   meta?: {[key: string]: string}
*   done: Done,
*   getTargetLanguage: (info: {
*     applicableField: string,
*     targetLanguage?: string,
*     pluginLang: string,
*     applicableFieldLang?: string
*   }) => string,
*   escapeColumn?: boolean,
*   getFieldAliasOrName: (info: {
*     locales: string[],
*     workI18n: import('intl-dom').I18NCallback,
*     targetLanguage: string,
*     applicableField: string,
*     applicableFieldI18N: string|string[]|LocalizationStrings,
*     meta: any,
*     metaApplicableField: {
*       [key: string]: string
*     },
*     targetLanguageI18N: string
*   }) => string
* }} PluginObject
*/

/**
 * @typedef {(info: {
 *   $p: IntlURLSearchParams,
 *   applicableField: string|undefined,
 *   meta?: {[key: string]: string}
 *   thisObj: TextBrowser
 *   j?: number
 * }) => void} Done
 */

/**
 * @typedef {number} Integer
 */

/**
 * @typedef {(info: {
*     tr: (string|Integer)[],
*     tableData: (string|Integer)[][],
*     i: number,
*     j: number,
*     applicableField?: string,
*     fieldInfo: FieldInfo,
*     applicableFieldIdx: number,
*     applicableFieldText: string|Integer,
*     fieldLang: string,
*     getLangDir: (locale: string) => string,
*     meta: {
*       [key: string]: string
*     }|undefined,
*     metaApplicableField?: {
*       [key: string]: string
*     },
*     $p: IntlURLSearchParams,
*     thisObj: TextBrowser|ResultsDisplayServerContext
*   }) => string|Integer} GetCellData
 */

/**
 * @typedef {(info: {
*   form: HTMLFormElement,
*   random: {
*     checked: boolean,
*   },
*   checkboxes: HTMLInputElement[],
*   type: string,
*   fieldAliasOrNames?: string[],
*   workName: string
* }) => URLSearchParams} ParamsSetter
*/

/**
 * @typedef {() => {
 *     form: HTMLFormElement,
*     random: HTMLInputElement,
*     checkboxes: HTMLInputElement[]
*   }} GetDataForSerializingParamsAsURL
 */

/**
 * @typedef {{
*   [key: string]: string|string[]|LocalizationStrings
* }} LocalizationStrings
*/
/**
 * @typedef {() => Promise<{
*   groupName: string | Text | DocumentFragment,
*   worksToFields: {
*     workName: string | Text | DocumentFragment,
*     shortcut: string,
*     fieldAliasOrNames: (
*       string|string[]|LocalizationStrings
*     )[]|undefined
*   }[]
* }[]>} GetFieldAliasOrNames
*/

export default {};
