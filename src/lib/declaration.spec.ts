import { describe, expect, it } from 'vitest';
import type { Texts } from './declaration.ts';

type Languages = 'en' | 'de';
type Fallback = 'en';

describe('declaration', () => {
  it('should only allow satisfied declarations', () => {
    const texts = {
      textWithAllLanguages: {
        en: {
          one: 'english',
        },
        de: {
          one: 'deutsch',
        },
      },
      textWithFallbackOnly: {
        en: {
          one: 'english',
        },
      },
      // textMissingFallback: {
      //   de: 'deutsch',
      // },
    };

    expect(texts satisfies Texts<Languages, Fallback, typeof texts>).toBeTruthy();
  });
});
