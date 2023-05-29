import { Box } from '@chakra-ui/react';
import Head from 'next/head';
import { PropsWithChildren, useMemo } from 'react';

import Footer from '@/components/layout/Footer';
import NavBar from '@/components/layout/NavBar';

export default function Layout({
  pageTitle,
  children,
}: PropsWithChildren<{
  pageTitle?: string;
}>) {
  const title = useMemo(() => `${pageTitle ? `${String(pageTitle)} - ` : ''}Rogue Scholar`, [pageTitle]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <NavBar />
      <Box minH="80vh" pt={20}>
        {children}
      </Box>
      <Footer />
    </>
  );
}
