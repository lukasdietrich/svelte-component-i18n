import { writable, type Writable } from 'svelte/store';
import type { Texts } from './declaration.ts';
import { Dictionary } from './dictionary.ts';

export class Translator<Languages extends string, Fallback extends Languages> {
  readonly currentLanguage: Writable<Languages>;

  constructor(
    public readonly languages: Languages[],
    public readonly fallback: Fallback
  ) {
    checkSupportedLanguages(languages);

    this.currentLanguage = writable(fallback);
  }

  define<T>(texts: Texts<Languages, Fallback, T>): Dictionary<Languages, Fallback, T> {
    return new Dictionary(this.currentLanguage, this.fallback, texts);
  }
}

function checkSupportedLanguages(languages: string[]) {
  const supportedLanguages = Intl.PluralRules.supportedLocalesOf(languages);
  const unsupportedLanguages = languages.filter((l) => !supportedLanguages.includes(l));

  if (unsupportedLanguages.length > 0) {
    throw new Error(`Unsupported languages: ${unsupportedLanguages}`);
  }
}
