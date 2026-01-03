export { Translator } from './translator.svelte.ts';
export { type Dictionary, type Texts } from './dictionary.ts';
export {
  type LanguageStrategy,
  type LanguageHook,
  fromNavigator,
  fromLocalStorage,
  toLocalStorage,
} from './detect.ts';
