import { createIntl, createIntlCache } from "@formatjs/intl";
import {I18nManager} from "react-native";
import * as RNLocalize from "react-native-localize";

export const translations = {
  ko: require("./ko.json"),
} as const;

type Translation = keyof typeof translations;

// fallback if no available language fits
const fallback = { languageTag: "en", isRTL: false };

const { languageTag, isRTL } =
  RNLocalize.findBestLanguageTag(Object.keys(translations)) ?? fallback;

// update layout direction
I18nManager.forceRTL(isRTL);

// console.log(languageTag)
const intl = createIntl(
  {
    defaultLocale: "en",
    locale: languageTag,
    messages: translations[languageTag as Translation],
  },
  createIntlCache(),
);

export default intl