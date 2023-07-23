module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es", "pt", "fr"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
  react: { useSuspense: false },
}
