import type { Texts } from './declaration.ts';
import type { Locale } from './locale.ts';

export class Dictionary<Languages extends string, Fallback extends Languages, T> {
  constructor(
    private readonly locale: () => Locale<Languages, Fallback>,
    private readonly texts: Texts<Languages, Fallback, T>
  ) {}

  readonly translate = (key: keyof T, n: number = 1): string => {
    const { language, fallback, pluralRules } = this.locale();

    const localized = this.texts[key];
    const pluralized = language in localized ? localized[language] : localized[fallback];

    const quantifier = pluralRules.select(n);
    if (has(pluralized, quantifier)) {
      return pluralized[quantifier];
    }

    return pluralized.one;
  };

  readonly t = this.translate;
}

function has<T extends {}, K extends keyof T>(
  value: T,
  key: K
): value is T & Record<K, Exclude<T[K], undefined | null>> {
  return value[key] !== undefined && value[key] !== null;
}
