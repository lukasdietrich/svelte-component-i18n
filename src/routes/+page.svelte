<script lang="ts">
  import { Translator } from '../lib/index.ts';

  const translator = new Translator(['en', 'de'], 'en');

  const { t } = translator.define({
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
  });
</script>

<select bind:value={translator.currentLanguage}>
  {#each translator.languages as language (language)}
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
      <td>{t('thing')}</td>
    </tr>
    <tr>
      <td>Pluralized - Many</td>
      <td>{t('thing', 42)}</td>
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
