import { Icon } from "@iconify/react"
// import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "next-i18next"

import { Container } from "./Container"
import { NavLink } from "./NavLink"

export default function Footer() {
  const { t } = useTranslation("common")

  return (
    <footer className="bg-slate-100">
      <Container className="relative">
        <div className="py-6">
          <nav className="text-sm" aria-label="quick links">
            <div className="-my-1 flex justify-center gap-x-6">
              <NavLink href="/blogs">{t("menu.blogs")}</NavLink>
              <NavLink href="/blogs">{t("menu.posts")}</NavLink>
              <NavLink href="/#pricing">{t("menu.pricing")}</NavLink>
              <NavLink href="/#faq">{t("menu.faq")}</NavLink>
              <NavLink href="/#stats">{t("menu.stats")}</NavLink>
              <NavLink href="https://docs.rogue-scholar.org">
                {t("menu.docs")}
              </NavLink>
              <NavLink href="https://plausible.io/rogue-scholar.org">
                {t("menu.usage_stats")}
              </NavLink>
            </div>
          </nav>
        </div>
        <div className="flex flex-col items-center border-t border-slate-400/10 py-6 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6">
            <Link
              href="mailto:info..front-matter.io"
              className="border-b-0 text-lg text-gray-500 hover:text-gray-400"
            >
              <span className="sr-only">Mail</span>
              <Icon icon="fa6-solid:envelope" className="inline" />
            </Link>
            <Link
              href="https://discord.gg/HvbD4dNPFh"
              className="border-b-0 text-lg text-gray-500 hover:text-gray-400"
            >
              <span className="sr-only">Discord</span>
              <Icon icon="fa6-brands:discord" className="inline" />
            </Link>
            <Link
              href="https://hachyderm.io/@mfenner"
              className="border-b-0 text-lg text-gray-500 hover:text-gray-400"
            >
              <span className="sr-only">Mastodon</span>
              <Icon icon="fa6-brands:mastodon" className="inline" />
            </Link>
            <Link
              href="https://github.com/front-matter/rogue-scholar"
              className="border-b-0 text-lg text-gray-500 hover:text-gray-400"
            >
              <span className="sr-only">GitHub</span>
              <Icon icon="fa6-brands:github" className="inline" />
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright &copy; {new Date().getFullYear()} The Rogue Scholar.{" "}
            {t("footer.allRightsReserved")}
          </p>
        </div>
      </Container>
    </footer>
  )
}
