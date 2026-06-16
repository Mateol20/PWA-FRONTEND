import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

import { API_BASE_URL } from "../config.js";

const baseUrl = API_BASE_URL.replace("/api/peliculas", "");

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "es",
    lng: "es",
    load: "languageOnly",
    backend: {
      loadPath: `${baseUrl}/api/translations/{{lng}}`,
    },
    detection: {
      order: ["navigator"],
      caches: [],
    },
  });

export default i18n;
