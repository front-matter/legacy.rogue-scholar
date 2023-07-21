module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "de", "es"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
  react: { useSuspense: false },
}
