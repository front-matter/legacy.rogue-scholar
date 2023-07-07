module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["de", "en"],
  },
  localePath:
    typeof window === "undefined"
      ? require("path").resolve("./public/locales")
      : "/public/locales",
  react: { useSuspense: false },
}
