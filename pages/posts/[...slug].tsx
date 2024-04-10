import Head from "next/head"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"
// import { jsonLdScriptProps } from "react-schemaorg"
import { version as uuidVersion } from "uuid"
import { validate as uuidValidate } from "uuid"
import { doi } from "doi-utils"

import { Post } from "@/components/common/Post"
import { References } from "@/components/common/References"
import Layout from "@/components/layout/Layout"
import {
  postsSelect,
  blogWithPostsSelect,
  supabase,
} from "@/lib/supabaseClient"
import { pocketbaseURL } from "@/lib/pocketbaseClient"
import { PostType, BlogType } from "@/types/blog"

export async function getServerSideProps(ctx) {
  const slug = ctx.params.slug
  let post: any = { data: null }
  if (uuidValidate(slug) && uuidVersion(slug) === 4) {
    post = await supabase
      .from("posts")
      .select(postsSelect)
      .eq("id", ctx.params.slug)
      .maybeSingle()
  } else if (doi.validate(slug.join("/"))) {
    const doi = `https://doi.org/${slug.join("/")}`
    post = await supabase
      .from("posts")
      .select(postsSelect)
      .eq("doi", doi)
      .maybeSingle()
  } else {
    return {
      notFound: true,
    }
  }
  const blog_slug = post?.data.blog_slug
  const { data: blog } = await supabase
    .from("blogs")
    .select(blogWithPostsSelect)
    .eq("slug", blog_slug)
    .single()
  let references: any = []
  if (doi.validate(slug.join("/"))) {
    const url = pocketbaseURL(slug.join("/"))
    try {
      const response = await fetch(url)
      const record = await response.json()
      references = record?.references || []
    } catch (error) {
      console.error(error)
    }
  }
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "app"])),
      post: post.data,
      blog,
      references,
    },
  }
}

type Props = {
  post: PostType
  blog: BlogType
  references: any
}

const PostPage: React.FunctionComponent<Props> = ({ post, blog, references }) => {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        {post.doi && (
          <>
            <meta name="citation_doi" content={post.doi} />
            <meta name="DC.identifier" content={post.doi} />
          </>
        )}
        <meta property="og:site_name" content="Rogue Scholar" />
        <meta property="og:title" content={"Rogue Scholar: " + post.title} />
        <meta
          property="og:description"
          content={"Rogue Scholar: " + post.summary}
        />
        <meta
          property="og:url"
          content={"https://rogue-scholar.org/posts/" + post.id}
        />
      </Head>
      <Layout>
        <div className="bg-white dark:bg-slate-800">
          {post && <Post post={post} blog={blog} />}
          {post && references && references.length > 0 && <References references={references} />}
        </div>
      </Layout>
    </>
  )
}

export default PostPage
