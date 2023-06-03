import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { jsonLdScriptProps } from 'react-schemaorg';
import { Blog as BlogSchema } from 'schema-dts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { getSingleBlog,  } from '@/pages/api/blogs/[slug]';
import { getPosts } from '@/pages/api/posts';
import { BlogType, PostType } from '@/types/blog';
import Layout from '@/components/layout/Layout';
import { Blog } from '@/components/common/Blog';
import { Posts } from '@/components/common/Posts';

export async function getServerSideProps(ctx) {
  const blog = await getSingleBlog(ctx.params.slug);
  // const posts = await generatePosts(blog.feed_url, ctx.params.slug);
  const posts = await getPosts(ctx.params.slug);
  return { props: { ...(await serverSideTranslations('en', ['common', 'app'])), blog, posts } };
}

type Props = {
  blog: BlogType;
  posts: PostType[];
};

const BlogPage: React.FunctionComponent<Props> = ({ blog, posts }) => {
  return (
    <>
      <Head>
        <title>{blog.title}</title>
        <meta property="og:site_name" content="Rogue Scholar" />
        <meta property="og:title" content={'Rogue Scholar: ' + blog.title} />
        <meta property="og:description" content={'Rogue Scholar: ' + blog.description} />
        <meta property="og:url" content={'https://rogue-scholar.org/' + blog.id} />
        {blog.favicon && <meta property="og:image" content={blog.favicon} />}
        <link
          rel="alternate"
          title={blog.title}
          type="application/feed+json"
          href={'https://rogue-scholar.org/' + blog.id + '.json'}
        />
        <script
          type="application/ld+json"
          {...jsonLdScriptProps<BlogSchema>({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            url: `https://rogue-scholar.org/${blog.id}`,
            name: `${blog.title}`,
            description: `${blog.description}`,
            inLanguage: `${blog.language}`,
            license: 'https://creativecommons.org/licenses/by/4.0/legalcode',
          })}
        />
      </Head>
      <Layout>
        <div className={blog.indexed_at ? 'bg-white' : 'bg-blue-50'}>
          <Blog blog={blog} />
          {posts && <Posts posts={posts} parent={true} />}
          {blog.home_page_url && (
            <div className="mx-auto max-w-2xl bg-inherit pb-2 lg:max-w-4xl">
              <div className="my-5 lg:my-8">
                <Link
                  href={blog.home_page_url}
                  target="_blank"
                  className="text-xl font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
                >
                  More posts via the {blog.title} Home Page …
                </Link>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default BlogPage;
