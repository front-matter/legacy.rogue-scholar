import { Box, Container } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ClientsList from '@/components/app/clients/List';
import Loader from '@/components/common/Loader';
import PageHeader from '@/components/common/PageHeader';
import Layout from '@/components/layout/Layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return { props: { ...(await serverSideTranslations(locale!, ['common', 'app'])) } };
};

function DashboardPage() {
  const { t } = useTranslation('app');
  const user = useUser();

  return (
    <Layout pageTitle={t('dashboard.pageTitle')}>
      <PageHeader title={t('dashboard.pageTitle')} description={t('dashboard.pageDescription')} align="start" />
      <Box px={4} py={12}>
        <Container maxW="5xl">{!user ? <Loader /> : <ClientsList />}</Container>
      </Box>
    </Layout>
  );
}

export default DashboardPage;
