import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import React from 'react';

import { getPagination } from '@/pages/api/posts';
import { Posts } from '@/components/common/Posts';
import Layout from '@/components/layout/Layout';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { PostType, PaginationType } from '@/types/blog';
import Pagination from '@/components/layout/Pagination';

export async function getServerSideProps(ctx) {
  const page = parseInt(ctx.query.page || 1);
  const { from, to } = getPagination(page - 1, 15);
  let { data: posts, count } = await supabase
    .from('posts')
    .select(postsSelect, { count: 'exact' })
    .order('date_published', { ascending: false })
    .range(from, to);
  count ??= 1000; // estimating total number of posts if error fetching count
  const pages = Math.ceil(count / 15);
  const pagination = {
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
        <Posts posts={posts} />
        {pagination.pages > 1 && <Pagination base_url='/posts' pagination={pagination} />}
      </Layout>
    </>
  );
};

export default PostsPage;
