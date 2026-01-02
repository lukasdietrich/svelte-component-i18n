<script lang="ts">
  import { Translator } from '../lib/index.ts';

  const translator = new Translator(['en', 'de'], 'en');
  const { currentLanguage } = translator;

  const { t } = translator.define({
    text: {
      en: {
        one: 'Test En',
      },
      de: {
        one: 'Test De',
      },
    },
  });
</script>

<select bind:value={$currentLanguage}>
  {#each translator.languages as language (language)}
    <option value={language}>{language}</option>
  {/each}
</select>

<p>
  {$t('text')}
</p>
