import Head from "next/head"
import { serverSideTranslations } from "next-i18next/serverSideTranslations"
import React from "react"
import { jsonLdScriptProps } from "react-schemaorg"
import { Blog as BlogSchema } from "schema-dts"

import { Blog } from "@/components/common/Blog"
import { Post } from "@/components/common/Post"
import Layout from "@/components/layout/Layout"
import {
  blogWithPostsSelect,
  postsSelect,
  supabase,
} from "@/lib/supabaseClient"
import { BlogType, PostType } from "@/types/blog"

export async function getServerSideProps(ctx) {
  const { data: post } = await supabase
    .from("posts")
    .select(postsSelect)
    .eq("id", ctx.params.slug)
    .single()
  const { data: blog } = await supabase
    .from("blogs")
    .select(blogWithPostsSelect)
    .eq("slug", post?.blog_slug)
    .single()

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common", "app"])),
      blog,
      post,
    },
  }
}

type Props = {
  blog: BlogType
  post: PostType
}

const PostPage: React.FunctionComponent<Props> = ({ blog, post }) => {
  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta property="og:site_name" content="Rogue Scholar" />
        <meta property="og:title" content={"Rogue Scholar: " + blog.title} />
        <meta
          property="og:description"
          content={"Rogue Scholar: " + blog.description}
        />
        <meta
          property="og:url"
          content={"https://rogue-scholar.org/blogs/" + blog.slug}
        />
        {blog.favicon && <meta property="og:image" content={blog.favicon} />}
        <link
          rel="alternate"
          title={blog.title}
          type="application/feed+json"
          href={"https://rogue-scholar.org/blogs/" + blog.slug + ".json"}
        />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps<BlogSchema>({
            "@context": "https://schema.org",
            "@type": "Blog",
            url: `https://rogue-scholar.org/blogs/${blog.slug}`,
            name: `${blog.title}`,
            description: `${blog.description}`,
            inLanguage: `${blog.language}`,
            license: "https://creativecommons.org/licenses/by/4.0/legalcode",
          })}
        />
      </Head>
      <Layout>
        <div className="bg-white dark:bg-slate-800">
          <Blog blog={blog} />
          {post && <Post post={post} />}
        </div>
      </Layout>
    </>
  )
}

export default PostPage
