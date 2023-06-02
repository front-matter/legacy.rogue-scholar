import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { Posts } from '@/components/common/Posts';
import Layout from '@/components/layout/Layout';

import { getAllPosts } from '@/pages/api/posts';
import { PostType } from '@/types/blog';

export async function getServerSideProps() {
  const posts = await getAllPosts();

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