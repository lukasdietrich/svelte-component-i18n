export interface Locale<Languages extends string, Fallback extends Languages> {
  language: Languages;
  fallback: Fallback;
  pluralRules: Intl.PluralRules;
}
