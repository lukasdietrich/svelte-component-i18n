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

export type Texts<Languages extends string, Fallback extends Languages, T> = {
  [K in keyof T]: Localized<Languages, Fallback, Pluralized<string> | string>;
};

export function has<T extends {}, K extends keyof T>(
  value: T,
  key: K
): value is T & Record<K, Exclude<T[K], undefined | null>> {
  return value[key] !== undefined && value[key] !== null;
}

export function isPluralized<T extends string | number>(
  maybePluralized: Pluralized<T> | T
): maybePluralized is Pluralized<T> {
  return typeof maybePluralized === 'object' && 'one' in maybePluralized;
}
