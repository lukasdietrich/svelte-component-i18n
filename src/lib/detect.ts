export type LanguageStrategy<Languages extends string> = (
  supportedLanguages: Languages[]
) => Languages | undefined;

export function fromNavigator<Languages extends string>(
  navigator: typeof globalThis.navigator = globalThis.navigator
): LanguageStrategy<Languages> {
  return (supportedLanguages: Languages[]): Languages | undefined => {
    if (!navigator) {
      return;
    }

    for (const navigatorLanguage of navigator.languages) {
      const language = navigatorLanguage as Languages;

      if (supportedLanguages.includes(language)) {
        return language;
      }
    }
  };
}

export function fromLocalStorage<Languages extends string>(
  key: string,
  localStorage = globalThis.localStorage
): LanguageStrategy<Languages> {
  return (supportedLanguages: Languages[]): Languages | undefined => {
    if (!localStorage) {
      return;
    }

    const localStorageLanguage = localStorage.getItem(key);
    if (typeof localStorageLanguage !== 'string') {
      return;
    }

    const language = localStorageLanguage as Languages;
    if (supportedLanguages.includes(language)) {
      return language;
    }
  };
}

export type LanguageHook<Languages extends string> = (language: Languages) => unknown;

export function toLocalStorage<Languages extends string>(
  key: string,
  localStorage = globalThis.localStorage
): LanguageHook<Languages> {
  return (language: Languages) => {
    if (!localStorage) {
      return;
    }

    localStorage.setItem(key, language);
  };
}
