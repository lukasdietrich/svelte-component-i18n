import { describe, expect, it } from 'vitest';
import { fromNavigator } from './detect.ts';

describe('detect', () => {
  const languages = ['de', 'en'];

  describe('fromNavigator', () => {
    it('should return undefined when missing navigator', () => {
      const language = fromNavigator(null as unknown as Navigator)(languages);
      expect(language).toBeUndefined();
    });

    it('should return undefined when no language matches', () => {
      const navigator = {
        languages: ['fr'],
      } satisfies Pick<Navigator, 'languages'>;

      const language = fromNavigator(navigator as unknown as Navigator)(languages);
      expect(language).toBeUndefined();
    });

    it('should return the first exact match', () => {
      const navigator = {
        languages: ['fr', 'en', 'de'],
      } satisfies Pick<Navigator, 'languages'>;

      const language = fromNavigator(navigator as unknown as Navigator)(languages);
      expect(language).toEqual('en');
    });

    it('should return the first stripped match', () => {
      const navigator = {
        languages: ['fr', 'de-DE', 'en', 'de'],
      } satisfies Pick<Navigator, 'languages'>;

      const language = fromNavigator(navigator as unknown as Navigator)(languages);
      expect(language).toEqual('de');
    });
  });
});
