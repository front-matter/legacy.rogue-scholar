import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { Blogs } from '@/components/common/Blogs';
import Layout from '@/components/layout/Layout';

import { getAllBlogs } from './api/blogs';

export const getStaticProps: GetStaticProps = async (ctx) => {
  const blogs = await getAllBlogs();

  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ['common', 'home'])),
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
