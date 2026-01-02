import { describe, expect, it } from 'vitest';
import { Dictionary } from './dictionary.ts';

describe('Dictionary', () => {
  type Languages = 'en' | 'de';
  type Fallback = 'en';

  const newTestDictionary = (language: Languages) =>
    new Dictionary(
      () => ({
        language,
        fallback: 'en' satisfies Fallback,
        pluralRules: new Intl.PluralRules(language),
      }),
      {
        simple: {
          en: 'Simple',
          de: 'Einfach',
        },

        simpleMissingLanguage: {
          en: 'Simple',
        },

        pluralized: {
          en: {
            one: 'One thing',
            other: 'Many things',
          },
          de: {
            one: 'Ein Ding',
            other: 'Viele Dinge',
          },
        },

        pluralizedMissing: {
          en: 'Fallback to one',
          de: {
            one: 'Standard eins',
          },
        },

        parameterized: (name: string) => ({
          en: `Hello ${name}`,
          de: `Hallo ${name}`,
        }),
      }
    );

  it.each<{
    language: Languages;
    result: string;
  }>([
    {
      language: 'en',
      result: 'Simple',
    },
    {
      language: 'de',
      result: 'Einfach',
    },
  ])('should translate simple texts', ({ language, result }) => {
    const { t } = newTestDictionary(language);
    expect(t('simple')).toEqual(result);
  });

  it.each<{
    language: Languages;
    result: string;
  }>([
    {
      language: 'en',
      result: 'Simple',
    },
    {
      language: 'de',
      result: 'Simple',
    },
  ])('should use the fallback if a translation is missing', ({ language, result }) => {
    const { t } = newTestDictionary(language);
    expect(t('simpleMissingLanguage')).toEqual(result);
  });

  it.each<{
    language: Languages;
    n: number;
    result: string;
  }>([
    {
      language: 'en',
      n: 1,
      result: 'One thing',
    },
    {
      language: 'de',
      n: 1,
      result: 'Ein Ding',
    },
    {
      language: 'en',
      n: 42,
      result: 'Many things',
    },
    {
      language: 'de',
      n: 42,
      result: 'Viele Dinge',
    },
  ])('should use the pluralized form if provided', ({ language, n, result }) => {
    const { p } = newTestDictionary(language);
    expect(p('pluralized', n)).toEqual(result);
  });

  it.each<{
    language: Languages;
    n: number;
    result: string;
  }>([
    {
      language: 'en',
      n: 42,
      result: 'Fallback to one',
    },
    {
      language: 'de',
      n: 42,
      result: 'Standard eins',
    },
  ])('should use the singular form if the pluralization is missing', ({ language, n, result }) => {
    const { p } = newTestDictionary(language);
    expect(p('pluralizedMissing', n)).toEqual(result);
  });

  it.each<{
    language: Languages;
    parameters: [string];
    result: string;
  }>([
    {
      language: 'en',
      parameters: ['Svelte'],
      result: 'Hello Svelte',
    },
    {
      language: 'de',
      parameters: ['Svelte'],
      result: 'Hallo Svelte',
    },
  ])('should take parameters', ({ language, parameters, result }) => {
    const { t } = newTestDictionary(language);
    expect(t('parameterized', ...parameters)).toEqual(result);
  });
});
