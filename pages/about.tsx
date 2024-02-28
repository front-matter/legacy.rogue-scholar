import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import { Comments } from "@/components/common/Comments"
import Faq from "@/components/home/Faq"
import Hero from "@/components/home/Hero"
import { Pricing } from "@/components/home/Pricing"
import { Stats } from "@/components/home/Stats"
import { Container } from "@/components/layout/Container"
import Layout from "@/components/layout/Layout"
import { blogsSelect, supabase } from "@/lib/supabaseClient"

const oecdCategories = {
  naturalSciences: "naturalSciences",
  mathematics: "naturalSciences",
  computerAndInformationSciences: "naturalSciences",
  physicalSciences: "naturalSciences",
  chemicalSciences: "naturalSciences",
  earthAndRelatedEnvironmentalSciences: "naturalSciences",
  biologicalSciences: "naturalSciences",
  otherNaturalSciences: "naturalSciences",
  engineeringAndTechnology: "engineeringAndTechnology",
  civilEngineering: "engineeringAndTechnology",
  eletricalEngineering: "engineeringAndTechnology",
  mechanicalEngineering: "engineeringAndTechnology",
  chemicalEngineering: "engineeringAndTechnology",
  materialsEngineering: "engineeringAndTechnology",
  medicalEngineering: "engineeringAndTechnology",
  environmentalEngineering: "engineeringAndTechnology",
  environmentalBiotechnology: "engineeringAndTechnology",
  industrialBiotechnology: "engineeringAndTechnology",
  nanoTechnology: "engineeringAndTechnology",
  otherEngineeringAndTechnologies: "engineeringAndTechnology",
  medicalAndHealthSciences: "medicalAndHealthSciences",
  basicMedicine: "medicalAndHealthSciences",
  clinicalMedicine: "medicalAndHealthSciences",
  healthSciences: "medicalAndHealthSciences",
  medicalBiotechnology: "medicalAndHealthSciences",
  otherMedicalSciences: "medicalAndHealthSciences",
  agriculturalSciences: "agriculturalSciences",
  agricultureForestryAndFisheries: "agriculturalSciences",
  animalAndDairyScience: "agriculturalSciences",
  veterinaryScience: "agriculturalSciences",
  agriculturalBiotechnology: "agriculturalSciences",
  otherAgriculturalSciences: "agriculturalSciences",
  socialSciences: "socialSciences",
  psychology: "socialSciences",
  economicsAndBusiness: "socialSciences",
  educationalSciences: "socialSciences",
  sociology: "socialSciences",
  law: "socialSciences",
  politicalScience: "socialSciences",
  socialAndEconomicGeography: "socialSciences",
  mediaAndCommunications: "socialSciences",
  otherSocialSciences: "socialSciences",
  humanities: "humanities",
  philosophyEthicsAndReligion: "humanities",
  historyAndArchaeology: "humanities",
  languagesAndLiterature: "humanities",
  arts: "humanities",
  otherHumanities: "humanities",
}

const countBy = (arr, prop) =>
  arr.reduce(function (obj, v) {
    obj[v[prop]] = (obj[v[prop]] || 0) + 1
    return obj
  }, {})

export async function getServerSideProps(ctx) {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(blogsSelect)
    .in("status", ["approved", "active", "archived"])
    .order("title", { ascending: true })

  const { data: posts_by_language } = await supabase
    .from("posts_by_language")
    .select("language,lang_count")
    .order("lang_count", { ascending: false })

  const { data: posts_by_category } = await supabase
    .from("posts_by_category")
    .select("category,cat_count")
    .order("cat_count", { ascending: false })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common"])),
      blogs,
      posts_by_language, posts_by_category
    },
  }
}

export default function Home({ blogs, posts_by_language, posts_by_category, locale }) {
  const { t } = useTranslation(["common"])

  blogs = blogs.map((blog) => {
    if (blog.generator === "WordPress.com") {
      blog.generator = "WordPress"
    } else if (["Drupal", "Squarespace"].includes(blog.generator)) {
      blog.generator = "Other"
    }
    if (blog.category) {
      blog.category = oecdCategories[blog.category]
    }
    return blog
  })
  const blogsCount = blogs.length

  const categories = posts_by_category.slice(0, 9).map((key) => ({
    title: t("categories." + key.category, { ns: "common" }),
    count: key.cat_count,
  }))

  const languagesList = posts_by_language.slice(0, 6).map((key) => ({
    title: t("languages." + key.language, { ns: "common" }),
    count: key.lang_count,
  }))

  const platformsObject = countBy(blogs, "generator")
  const platforms = Object.keys(platformsObject).map((key) => ({
    title: key,
    count: platformsObject[key],
  }))

  return (
    <Layout>
      <Hero blogs={blogs} />
      <Faq />
      <Pricing />
      <Stats
        blogsCount={blogsCount}
        postsCount={posts_by_language.reduce((a, b) => a + b.lang_count, 0)}
        categories={categories}
        languages={languagesList}
        platforms={platforms}
      />
      <Container className="pb-5 pt-2 text-center lg:pt-5">
        <Comments locale={locale} />
      </Container>
    </Layout>
  )
}
