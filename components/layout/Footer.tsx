import { Icon } from "@iconify/react"
import parse from "html-react-parser"
// import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import { Container } from "./Container"
import { NavLink } from "./NavLink"

export default function Footer() {
  const { t } = useTranslation("common")

  return (
    <footer className="bg-slate-100 dark:bg-black dark:text-white">
      <Container className="relative">
        <div className="py-6">
          <nav className="text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="/">{t("menu.posts")}</NavLink>
              <NavLink href="/blogs">{t("menu.blogs")}</NavLink>
              {/* Service link removed */}
              <NavLink href="https://docs.rogue-scholar.org">
                {t("menu.docs")}
              </NavLink>
              <NavLink href="https://status.rogue-scholar.org">
                {"Status"}
              </NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-6 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6 text-gray-500 dark:text-gray-200">
            <Link
              href="mailto:info@rogue-scholar.org"
              className="border-b-0 text-lg hover:text-gray-400 dark:hover:text-gray-100"
            >
              <span className="sr-only">Mail</span>
              <Icon icon="fa6-solid:envelope" className="inline" />
            </Link>
            <Link
              href="https://wisskomm.social/@rogue_scholar"
              rel="me"
              className="border-b-0 text-lg hover:text-gray-400 dark:hover:text-gray-100"
            >
              <span className="sr-only">Mastodon</span>
              <Icon icon="fa6-brands:mastodon" className="inline" />
            </Link>
            <Link
              href="https://github.com/front-matter/legacy.rogue-scholar"
              className="border-b-0 text-lg hover:text-gray-400 dark:hover:text-gray-100"
            >
              <span className="sr-only">GitHub</span>
              <Icon icon="fa6-brands:github" className="inline" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-200 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} The Rogue Scholar{" "}
            {t("footer.authors")}
            {parse(
              t("footer.creativeCommons", {
                url: "https://creativecommons.org/licenses/by/4.0/legalcode",
              })
            )}
          </p>
        </div>
      </Container>
    </footer>
  )
}
