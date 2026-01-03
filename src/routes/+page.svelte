<script lang="ts">
  import { fromLocalStorage, fromNavigator, toLocalStorage, Translator } from '../lib/index.ts';

  const localStorageKey = '__svelte_component_i18n_lang';

  const translator = new Translator({
    supportedLanguages: ['en', 'de'],
    fallbackLanguage: 'en',
    languageStrategies: [fromLocalStorage(localStorageKey), fromNavigator()],
    languageHooks: [toLocalStorage(localStorageKey)],
  });

  const { t, p } = translator.define({
    simple: {
      en: 'Simple',
      de: 'Einfach',
    },

    thing: {
      en: {
        one: 'One thing',
        other: 'Many things',
      },
      de: {
        one: 'Ein Ding',
        other: 'Viele Dinge',
      },
    },

    parameterized: (name: string) => ({
      en: `Hello ${name}`,
      de: `Hallo ${name}`,
    }),
  });
</script>

<select bind:value={translator.currentLanguage}>
  {#each translator.supportedLanguages as language (language)}
    <option value={language}>{language}</option>
  {/each}
</select>

<table>
  <thead>
    <tr>
      <th>Example</th>
      <th>Result</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Simple</td>
      <td>{t('simple')}</td>
    </tr>
    <tr>
      <td>Pluralized - One</td>
      <td>{p('thing', 1)}</td>
    </tr>
    <tr>
      <td>Pluralized - Many</td>
      <td>{p('thing', 42)}</td>
    </tr>
    <tr>
      <td>Parameterized</td>
      <td>{t('parameterized', 'Svelte')}</td>
    </tr>
  </tbody>
</table>

<style>
  table {
    border-collapse: collapse;
  }

  th,
  td {
    border: 1px solid black;
  }
</style>
