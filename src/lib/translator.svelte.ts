import type { Locale } from './locale.ts';
import { Dictionary, type Texts } from './dictionary.ts';

export class Translator<Languages extends string, Fallback extends Languages> {
  currentLanguage: Languages;
  private readonly locale: Locale<Languages, Fallback>;

  constructor(
    public readonly languages: Languages[],
    public readonly fallback: Fallback
  ) {
    checkSupportedLanguages(languages);

    this.currentLanguage = $state(fallback);

    this.locale = $derived({
      language: this.currentLanguage,
      fallback: this.fallback,
      pluralRules: new Intl.PluralRules(this.currentLanguage),
    });
  }

  define<T>(texts: Texts<Languages, Fallback, T>): Dictionary<Languages, Fallback, T> {
    return new Dictionary(() => this.locale, texts);
  }
}

function checkSupportedLanguages(languages: string[]) {
  const supportedLanguages = Intl.PluralRules.supportedLocalesOf(languages);
  const unsupportedLanguages = languages.filter((l) => !supportedLanguages.includes(l));

  if (unsupportedLanguages.length > 0) {
    throw new Error(`Unsupported languages: ${unsupportedLanguages}`);
  }
}
