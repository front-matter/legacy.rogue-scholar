import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { Blogs } from '@/components/common/Blogs';
import Layout from '@/components/layout/Layout';

import { getAllBlogs } from './api/blogs';

export async function getServerSideProps(ctx) {
  const blogs = await getAllBlogs();

  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'home'])),
      blogs,
    },
  };
};

type Props = {
  blogs: any;
};

const BlogsPage: React.FunctionComponent<Props> = ({ blogs }) => {
  return (
    <>
      <Layout>
        <Blogs blogs={blogs} />
      </Layout>
    </>
  );
};

export default BlogsPage;