import { defineStore } from "pinia";
import { ref } from "vue";
import type { I18N } from "@/types/i18n";

export const useI18nStore = defineStore("i18n", () => {
  const strings = ref<I18N>({} as I18N);

  function setStrings(i18n: I18N) {
    strings.value = i18n;
  }

  return { strings, setStrings };
});
