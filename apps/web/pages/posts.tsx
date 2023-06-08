import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { Posts } from '@/components/common/Posts';
import Layout from '@/components/layout/Layout';
import { supabase, postsSelect } from '@/lib/supabaseClient';
import { PostType } from '@/types/blog';

export async function getServerSideProps() {
  let { data: posts, error } = await supabase.from('posts').select(postsSelect).range(0, 24).order('date_published', { ascending: false })

  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'home'])),
      posts,
    },
  };
};

type Props = {
  posts: PostType[];
};

const PostsPage: React.FunctionComponent<Props> = ({ posts }) => {
  return (
    <>
      <Layout>
        <Posts posts={posts} />
      </Layout>
    </>
  );
};

export default PostsPage;