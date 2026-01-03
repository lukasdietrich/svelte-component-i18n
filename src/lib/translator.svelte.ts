import type { Locale } from './locale.ts';
import { Dictionary, type Texts } from './dictionary.ts';
import type { LanguageHook, LanguageStrategy } from './detect.ts';

type MustStringUnion<T extends string> = string extends T ? never : T;

export class Translator<Languages extends string, Fallback extends Languages> {
  readonly supportedLanguages: Languages[];
  readonly fallbackLanguage: Fallback;

  #currentLanguage: Languages;

  private readonly locale: Locale<Languages, Fallback>;
  private readonly languageHooks: LanguageHook<Languages>[];

  constructor({
    supportedLanguages,
    fallbackLanguage,
    languageStrategies = [],
    languageHooks = [],
  }: {
    supportedLanguages: MustStringUnion<Languages>[];
    fallbackLanguage: Fallback;
    languageStrategies?: LanguageStrategy<Languages>[];
    languageHooks?: LanguageHook<Languages>[];
  }) {
    checkSupportedLanguages(supportedLanguages);

    this.supportedLanguages = supportedLanguages;
    this.fallbackLanguage = fallbackLanguage;

    const initialLanguage = determineInitialLanguage(
      languageStrategies,
      supportedLanguages,
      fallbackLanguage
    );
    this.#currentLanguage = $state(initialLanguage);

    this.locale = $derived({
      language: this.#currentLanguage,
      fallback: this.fallbackLanguage,
      pluralRules: new Intl.PluralRules(this.currentLanguage),
    });

    this.languageHooks = languageHooks;
  }

  get currentLanguage() {
    return this.#currentLanguage;
  }

  set currentLanguage(language: Languages) {
    this.#currentLanguage = language;

    for (const hook of this.languageHooks) {
      hook(this.currentLanguage);
    }
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

function determineInitialLanguage<Languages extends string>(
  strategies: LanguageStrategy<Languages>[],
  languages: Languages[],
  fallback: Languages
): Languages {
  for (const strategy of strategies) {
    const language = strategy(languages);
    if (language !== undefined) {
      return language;
    }
  }

  return fallback;
}
