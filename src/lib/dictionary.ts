import { has, isPluralized, type Texts } from './declaration.ts';
import type { Locale } from './locale.ts';

export class Dictionary<Languages extends string, Fallback extends Languages, T> {
  constructor(
    private readonly locale: () => Locale<Languages, Fallback>,
    private readonly texts: Texts<Languages, Fallback, T>
  ) {}

  readonly translate = (key: keyof T, n: number = 1): string => {
    const { language, fallback, pluralRules } = this.locale();

    const localized = this.texts[key];
    const pluralized = has(localized, language) ? localized[language] : localized[fallback];

    if (isPluralized(pluralized)) {
      const quantifier = pluralRules.select(n);
      return has(pluralized, quantifier) ? pluralized[quantifier] : pluralized.one;
    }

    return pluralized;
  };

  readonly t = this.translate;
}
