import { describe, expect, it } from 'vitest';
import { Translator } from './translator.svelte.ts';

describe('Translator', () => {
  it('should only allow valid languages', () => {
    expect(() => new Translator(['en', '42'], 'en')).toThrowError(
      'Incorrect locale information provided'
    );
  });
});
