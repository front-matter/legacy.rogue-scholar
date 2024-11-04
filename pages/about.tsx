import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import { Comments } from "@/components/common/Comments"
import Faq from "@/components/home/Faq"
import Hero from "@/components/home/Hero"
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
  socialScience: "socialScience",
  psychology: "socialScience",
  economicsAndBusiness: "socialScience",
  educationalSciences: "socialScience",
  sociology: "socialScience",
  law: "socialScience",
  politicalScience: "socialScience",
  socialAndEconomicGeography: "socialScience",
  mediaAndCommunications: "socialScience",
  otherSocialSciences: "socialScience",
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
    .order("title", { ascending: true })

  const { data: posts_by_generator } = await supabase
    .from("posts_by_generator")
    .select("generator,gen_count")
    // .in("status", ["active", "pending"])
    .order("gen_count", { ascending: false })

  const { data: posts_by_language } = await supabase
    .from("posts_by_language")
    .select("language,lang_count")
    // .in("status", ["active", "pending"])
    .order("lang_count", { ascending: false })

  const { data: posts_by_category } = await supabase
    .from("posts_by_category")
    .select("category,cat_count")
    // .in("status", ["active", "pending"])
    .order("cat_count", { ascending: false })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common"])),
      blogs,
      posts_by_generator,
      posts_by_language,
      posts_by_category,
    },
  }
}

export default function Home({
  blogs,
  posts_by_generator,
  posts_by_language,
  posts_by_category,
  locale,
}) {
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

  const categories = posts_by_category.slice(0, 9).map((key) => ({
    title: t("categories." + key.category),
    count: key.cat_count,
  }))

  const languagesList = posts_by_language.slice(0, 6).map((key) => ({
    title: t("languages." + key.language),
    count: key.lang_count,
  }))

  const platforms = posts_by_generator.slice(0, 10).map((key) => ({
    title: key.generator,
    count: key.gen_count,
  }))

  return (
    <Layout>
      <Hero blogs={blogs} />
      <Faq />
      <Stats
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
