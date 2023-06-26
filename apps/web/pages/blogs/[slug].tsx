import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { jsonLdScriptProps } from 'react-schemaorg';
import { Blog as BlogSchema } from 'schema-dts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BlogType, PostType, PaginationType } from '@/types/blog';
import Layout from '@/components/layout/Layout';
import { supabase, blogWithPostsSelect, postsSelect } from '@/lib/supabaseClient';
import { Blog } from '@/components/common/Blog';
import { Posts } from '@/components/common/Posts';
import { getPagination } from '@/pages/api/posts';
import Pagination from '@/components/layout/Pagination';

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1);
  const { from, to } = getPagination(page - 1, 15);
  let { data: blog } = await supabase.from('blogs').select(blogWithPostsSelect).eq('id', ctx.params.slug).single();
  let { data: posts, count } = await supabase
    .from('posts')
    .select(postsSelect, { count: 'exact' })
    .eq('blog_id', ctx.params.slug)
    .order('date_published', { ascending: false })
    .range(from, to);
  count ??= 50; // estimating total number of posts if error fetching count
  const pages = Math.ceil(count / 15);
  const pagination = {
    page: page,
    pages: pages,
    total: count,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  };

  return { props: { ...(await serverSideTranslations('en', ['common', 'app'])), blog, posts, pagination } };
}

type Props = {
  blog: BlogType;
  posts: PostType[];
  pagination: PaginationType;
};

const BlogPage: React.FunctionComponent<Props> = ({ blog, posts, pagination }) => {
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
          {pagination.pages > 1 && <Pagination base_url={'/blogs/' + blog.id} pagination={pagination} />}
          {posts && <Posts posts={posts} parent={true} />}
          {pagination.pages > 1 && <Pagination base_url={'/blogs/' + blog.id} pagination={pagination} />}
          {blog.home_page_url && blog.backlog && (
            <div className="mx-auto max-w-2xl bg-inherit pb-2 lg:max-w-4xl">
              <div className="mb-2 lg:mb-5">
                <Link
                  href={blog.home_page_url}
                  target="_blank"
                  className="text-base font-semibold text-gray-700 hover:text-gray-400 sm:text-xl"
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
