import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import React from 'react';

import { getPagination } from '@/pages/api/posts';
import { Posts } from '@/components/common/Posts';
import Layout from '@/components/layout/Layout';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { PostType, PaginationType } from '@/types/blog';
import Pagination from '@/components/layout/Pagination';
import Search from '@/components/layout/Search';

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1);
  const { from, to } = getPagination(page - 1, 15);
  let { data: posts, count } = await supabase
    .from('posts')
    .select(postsSelect, { count: 'exact' })
    .textSearch('fts', ctx.query.query || 'doi.org', {
      type: 'plain',
      config: 'english',
    })
    .order('date_published', { ascending: false })
    .range(from, to);
  count ??= 1000; // estimating total number of posts if error fetching count
  const pages = Math.ceil(count / 15);
  const pagination = {
    base_url: '/posts',
    query: ctx.query.query || '',
    page: page,
    pages: pages,
    total: count,
    prev: page > 1 ? page - 1 : null,
    next: page < pages ? page + 1 : null,
  };
  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'home'])),
      posts,
      pagination,
    },
  };
}

type Props = {
  posts: PostType[];
  pagination: PaginationType;
};

const PostsPage: React.FunctionComponent<Props> = ({ posts, pagination }) => {
  return (
    <>
      <Layout>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Rogue Scholar Posts</h2>
        </div>
        <Search />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
        <Posts posts={posts} />
        {pagination.total > 0 && <Pagination pagination={pagination} />}
      </Layout>
    </>
  );
};

export default PostsPage;
