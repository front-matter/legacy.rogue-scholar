import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';

import { supabase, blogsSelect } from '@/lib/supabaseClient';
import { Blogs } from '@/components/common/Blogs';
import Layout from '@/components/layout/Layout';

export async function getServerSideProps() {
  let { data, error } = await supabase.from('blogs').select(blogsSelect).order('title', { ascending: true })

  if (error) {
    console.log(error)
  }

  return {
    props: {
      ...(await serverSideTranslations('en', ['common', 'home'])),
      blogs: data,
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