import { Flex, useColorModeValue } from '@chakra-ui/react';
import { useSessionContext, useUser } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Loader from '@/components/common/Loader';
import { redirectPath } from '@/config/auth';

/*
  This is the page that is shown when the user is redirected from the authentication provider.
  Its necessary because the cookie setting request is sent frontend side and we have to wait before we redirect to the authenticated page.
*/

export default function AuthCallbackPage() {
  const router = useRouter();
  const user = useUser();
  const { isLoading } = useSessionContext();

  const { query } = router;

  const redirectTo = query.redirectAfterSignin ? decodeURIComponent(query.redirectAfterSignin as string) : redirectPath;

  // when the user is loaded, redirect to the authenticated page
  useEffect(() => {
    if (!isLoading && user) router.push(redirectTo);
  }, [user, isLoading, router, redirectTo]);

  // fallback if the user is not loaded after 5s to make sure this page is not shown forever
  useEffect(() => {
    const timeout = setTimeout(() => router.push('/'), 5000);

    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex bg={useColorModeValue('white', 'gray.900')} align="center" justify="center" minH="100vh">
      <Loader />
    </Flex>
  );
}
