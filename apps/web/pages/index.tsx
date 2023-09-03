import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import Faq from "@/components/home/Faq"
import Hero from "@/components/home/Hero"
import { Pricing } from "@/components/home/Pricing"
import { Stats } from "@/components/home/Stats"
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
    .in("status", ["approved", "active"])
    .order("title", { ascending: true })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "home"])),
      blogs,
    },
  }
}

export default function Home({ blogs }) {
  const { t } = useTranslation(["home", "common"])

  blogs = blogs.map((blog) => {
    if (blog.generator) {
      blog.generator = blog.generator.split(" ")[0]
    } else {
      blog.generator = "Unknown"
    }
    if (blog.category) {
      blog.category = oecdCategories[blog.category]
    }
    return blog
  })
  const count = blogs.length
  const categoriesObject = countBy(blogs, "category")
  const categories = Object.keys(categoriesObject).map((key) => ({
    title: t("categories." + key, { ns: "common" }),
    count: categoriesObject[key],
  }))

  const languagesObject = countBy(blogs, "language")
  const languagesList = Object.keys(languagesObject).map((key) => ({
    title: t("languages." + key),
    count: languagesObject[key],
  }))

  const platformsObject = countBy(blogs, "generator")
  const platforms = Object.keys(platformsObject).map((key) => ({
    title: key,
    count: platformsObject[key],
  }))

  return (
    <Layout>
      <Hero blogs={blogs} />
      <Pricing />
      <Faq />
      <Stats
        count={count}
        categories={categories}
        languages={languagesList}
        platforms={platforms}
      />
    </Layout>
  )
}
