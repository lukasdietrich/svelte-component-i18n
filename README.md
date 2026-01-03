# svelte-component-i18n

A lightweight internationalization library for Svelte.

It acts as a thin wrapper around native browser APIs, prioritizing type safety and component-level
translation management.

## Installation

```bash
npm i -S svelte-component-i18n
```

## Usage

This library consists of two parts:

1. `Translator` keeps track of the current locale and propagates changes to all components.
2. `Dictionary` is a component level record of translations.

First should create just one global `Translator` instance and reuse it in every component.

```typescript
// src/lib/i18n.ts

import { Translator } from 'svelte-component-i18n';

export const translator = new Translator({
  // All languages you want to support.
  supportedLanguages: ['en', 'de'],
  // The fallback language is the only one, where translations are required to be defined.
  // If a translation for a given language is missing, the fallback language is used instead.
  fallbackLanguage: 'en',
});
```

Next you should define a `Dictionary` in your components.

```svelte
<!-- You can define translations in a `module`-Block, as it is shared across instances of the same component -->
<script lang="ts" module>
  import { translator } from '$lib/i18n';

  // You can destruct the dictionary into the required translation functions.
  //   - `translate` and `t`: Translate a key
  //   - `pluralize` and `p`: Translate a key taking pluralization into account
  const { t } = translator.define({
    myFirstTranslation: {
      en: 'My first translation',
      de: 'Meine erste Übersetzung',
    },
  });
</script>

<!-- The keys and parameters are type-checked. If the key is not defined, the component will not compile. -->
<p>{t('myFirstTranslation')}</p>
```

### Language Detection

Detecting the user's preferred language using `navigator.languages` or a previously selected language
from the `localStorage`.

Browser globals are not defined when using server-side rendering in SvelteKit.
The provided strategies and hooks skip execution, when `navigator` or `localStorage` are missing.

```typescript
import { fromLocalStorage, fromNavigator, toLocalStorage, Translator } from 'svelte-component-i18n';

const localStorageKey = 'my-app-language';

const translator = new Translator({
  supportedLanguages: ['en', 'de'],
  fallbackLanguage: 'en',
  languageStrategies: [fromLocalStorage(localStorageKey), fromNavigator()],
  languageHooks: [toLocalStorage(localStorageKey)],
});
```

### Language Selection

The `Translator` exposes both the `currentLanguage` and the initially provided `supportedLanguages`.
You can use both to create a language selector.
The `currentLanguage` is a rune and will automatically propagate changes to all components.

```svelte
<script lang="ts">
  import { translator } from '$lib/i18n';
</script>

<select bind:value={translator.currentLanguage}>
  {#each translator.supportedLanguages as language (language)}
    <option value={language}>{language}</option>
  {/each}
</select>
```

### Simple Translations

Basic key-value mapping for static text.

```svelte
<script lang="ts">
  import { translator } from '$lib/i18n';

  const { t } = translator.define({
    simple: {
      en: 'Simple',
      de: 'Einfach',
    },
  });
</script>

{t('simple')}
```

### Pluralization

Using `Intl.PluralRules`[^1] logic to handle count-based text variations.

```svelte
<script lang="ts">
  import { translator } from '$lib/i18n';

  const { p } = translator.define({
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
  });
</script>

{p('pluralized', 1)}
{p('pluralized', 42)}
```

### Interpolation

Instead of defining static structures you can also define functions, which return the same structures.
Template literals can be used to interpolate text.

```svelte
<script lang="ts">
  import { translator } from '$lib/i18n';

  const { t } = translator.define({
    parameterized: (name: string) => ({
      en: `Hello ${name}`,
      de: `Hallo ${name}`,
    }),
  });
</script>

{t('parameterized', 'Svelte')}
```

[^1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
