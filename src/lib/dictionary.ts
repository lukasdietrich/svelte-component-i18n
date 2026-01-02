import type { Locale } from './locale.ts';

type Localized<Languages extends string, Fallback extends Languages, T> = {
  [K in Languages]?: T;
} & {
  [K in Fallback]-?: T;
};

type Quantifier = Intl.LDMLPluralRule;

type Pluralized<T> = {
  [K in Quantifier]?: T;
} & {
  [K in 'one']-?: T;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any --
 *
 * We need to use _any_ here to verify the type T[K] is a function.
 * The mapped type _MaybeParameterized_ stores the actual parameter types.
 **/
type FunctionLike = (...args: any[]) => unknown;

type MaybeParameterized<T, V> = {
  [K in keyof T as T[K] extends FunctionLike ? K : never]: (...args: MaybeParameters<T, K>) => V;
} & {
  [K in keyof T as T[K] extends FunctionLike ? never : K]: V;
};

type MaybeParameters<T, K extends keyof T> = T[K] extends FunctionLike ? Parameters<T[K]> : [];

export type Texts<Languages extends string, Fallback extends Languages, T> = T &
  MaybeParameterized<T, Localized<Languages, Fallback, Pluralized<string> | string>>;

export class Dictionary<Languages extends string, Fallback extends Languages, T> {
  constructor(
    private readonly locale: () => Locale<Languages, Fallback>,
    private readonly texts: Texts<Languages, Fallback, T>
  ) {}

  #translate<K extends keyof T>(key: K, ...params: MaybeParameters<T, K>): string {
    return this.pluralize(key, 1, ...params);
  }

  #pluralize<K extends keyof T>(key: K, n: number, ...params: MaybeParameters<T, K>): string {
    const { language, fallback, pluralRules } = this.locale();

    const maybeParameterized = this.texts[key];
    const localized =
      typeof maybeParameterized === 'function' ? maybeParameterized(...params) : maybeParameterized;

    const maybePluralized = has(localized, language) ? localized[language] : localized[fallback];

    if (isPluralized(maybePluralized)) {
      const quantifier = pluralRules.select(n);
      return has(maybePluralized, quantifier) ? maybePluralized[quantifier] : maybePluralized.one;
    }

    return maybePluralized;
  }

  readonly translate = this.#translate.bind(this);
  readonly t = this.translate;

  readonly pluralize = this.#pluralize.bind(this);
  readonly p = this.pluralize;
}

function has<T extends object, K extends keyof T>(
  value: T,
  key: K
): value is T & Record<K, Exclude<T[K], undefined | null>> {
  return value[key] !== undefined && value[key] !== null;
}

function isPluralized<T extends string | number>(
  maybePluralized: Pluralized<T> | T
): maybePluralized is Pluralized<T> {
  return typeof maybePluralized === 'object' && 'one' in maybePluralized;
}
