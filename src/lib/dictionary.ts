import { derived, type Readable } from 'svelte/store';
import type { Texts } from './declaration.ts';

export class Dictionary<Languages extends string, Fallback extends Languages, T> {
  readonly t: Readable<ReturnType<typeof this.makeTranslateFn>>;

  constructor(
    language: Readable<Languages>,
    private readonly fallback: Fallback,
    private readonly texts: Texts<Languages, Fallback, T>
  ) {
    this.t = derived(language, this.makeTranslateFn);
  }

  private readonly makeTranslateFn = (language: Languages) => {
    return (key: keyof T, n: number = 1): string => {
      const localized = this.texts[key];
      const pluralized = language in localized ? localized[language] : localized[this.fallback];

      const rules = new Intl.PluralRules(language);
      const quantifier = rules.select(n);

      if (has(pluralized, quantifier)) {
        return pluralized[quantifier];
      }

      return pluralized.one;
    };
  };
}

function has<T extends {}, K extends keyof T>(
  value: T,
  key: K
): value is T & Record<K, Exclude<T[K], undefined | null>> {
  return value[key] !== undefined && value[key] !== null;
}
