# svelte-component-i18n

A lightweight internationalization library for Svelte.
It acts as a thin wrapper around native browser APIs, prioritizing type safety and component-level
translation management.

## Core Philosophy

* **Zero Dependencies:** Only Svelte is required as a peer dependency.
* **Native-First:** Leverages `Intl.PluralRules` for locale-aware pluralization instead of custom logic.
* **Colocation:** Translations are defined within the components that use them, keeping the context close to the UI.
* **Template Literals:** Uses standard JavaScript template literals for interpolation.

---

## Features

* **Type Safety:** Designed to provide type hints for your translation keys and parameters.
* **Reactivity:** Integrates with Svelte stores to update the UI immediately upon language changes.
* **Small Footprint:** Does not bundle large translation files; you only load what your components need.

---

## Technical Overview

The library maps input values to translation strings by using the browser's [`Intl`][^1] API to determine
plural categories (e.g. `one`, `few`, `other`).

---

## Usage Examples

The following examples are simplified. Ideally you construct one `Translator` and reuse it in every
component, only defining translations there.

### Language Detection

Detecting the user's preferred language using `navigator.languages` or a previously selected language
from the `localStorage`.

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

Managing and updating the current active locale store.

```svelte
<script lang="ts">
  import { Translator } from 'svelte-component-i18n';

  const translator = new Translator({
    supportedLanguages: ['en', 'de'],
    fallbackLanguage: 'en',
  });
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
import { translator } from '$lib/my-globally-defined-translator';

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

Using `Intl.PluralRules` logic to handle count-based text variations.

```svelte
<script lang="ts">
import { translator } from '$lib/my-globally-defined-translator';

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
import { translator } from '$lib/my-globally-defined-translator';

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
