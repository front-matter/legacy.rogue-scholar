import Giscus from "@giscus/react"

export function Comments({ locale }) {
  return (
    <Giscus
      repo="front-matter/rogue-scholar"
      repoId="R_kgDOItYbpA"
      category="Q&A"
      categoryId="DIC_kwDOItYbpM4CTyut"
      mapping="url"
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
