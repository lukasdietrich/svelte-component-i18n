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
  [K in keyof T]: Localized<Languages, Fallback, Pluralized<string>>;
};
