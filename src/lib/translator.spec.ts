import { describe, expect, it } from 'vitest';
import { Translator } from './translator.svelte.ts';

describe('Translator', () => {
  it('should only allow valid languages', () => {
    expect(
      () =>
        new Translator({
          supportedLanguages: ['en', '42'],
          fallbackLanguage: 'en',
        })
    ).toThrowError('Incorrect locale information provided');
  });
});
