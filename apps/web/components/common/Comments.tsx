import Giscus from "@giscus/react"

export function Comments({ locale, slug }) {
  return (
    <Giscus
      repo="front-matter/rogue-scholar"
      repoId="R_kgDOItYbpA"
      category="General"
      categoryId="DIC_kwDOItYbpM4CTyus"
      mapping={slug}
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang={locale}
      loading="lazy"
    />
  )
}
