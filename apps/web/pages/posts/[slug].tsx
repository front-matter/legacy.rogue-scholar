import Head from 'next/head';
import React from 'react';
import { jsonLdScriptProps } from 'react-schemaorg';
import { Blog as BlogSchema } from 'schema-dts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { BlogType, PostType } from '@/types/blog';
import Layout from '@/components/layout/Layout';
import { Blog } from '@/components/common/Blog';
import { Post } from '@/components/common/Post';
import { supabase, blogWithPostsSelect, postsSelect } from '@/lib/supabaseClient';

export async function getServerSideProps(ctx) {
  let { data: post } = await supabase.from('posts').select(postsSelect).eq('uuid', ctx.params.slug).single()  
  let { data: blog } = await supabase.from('blogs').select(blogWithPostsSelect).eq('id', post?.blog_id).single();

  return { props: { ...(await serverSideTranslations('en', ['common', 'app'])), blog, post } };
}

type Props = {
  blog: BlogType;
  post: PostType;
};

const PostPage: React.FunctionComponent<Props> = ({ blog, post }) => {
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
          {post && <Post post={post} />}
        </div>
      </Layout>
    </>
  );
};

export default PostPage;
