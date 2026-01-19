import { useTranslation } from "next-i18next"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"

import Faq from "@/components/home/Faq"
import Hero from "@/components/home/Hero"
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

export async function getServerSideProps(ctx) {
  const { data: blogs, error } = await supabase
    .from("blogs")
    .select(blogsSelect)
    .order("title", { ascending: true })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common"])),
      blogs,
    },
  }
}

export default function Home({
  blogs,
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

  return (
    <Layout>
      <Hero blogs={blogs} />
      <Faq />
    </Layout>
  )
}
