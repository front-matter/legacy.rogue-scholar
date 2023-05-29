import { Box, Button } from '@chakra-ui/react';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Provider } from '@supabase/supabase-js';
import { darken } from 'color2k';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo } from 'react';
import {
  FaApple,
  FaBitbucket,
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaGitlab,
  FaGoogle,
  FaLinkedin,
  FaMicrosoft,
  FaSlack,
  FaSpotify,
  FaTwitch,
  FaTwitter,
} from 'react-icons/fa';
import { SiNotion } from 'react-icons/si';

import { redirectPath } from '@/config/auth';
import { useAuthRedirectUrl } from '@/lib/blog/auth';

export default function SocialSignInButton({
  provider,
  redirectAfterSignin,
}: {
  provider: Provider;
  redirectAfterSignin?: string;
}) {
  const supabaseClient = useSupabaseClient();
  const { t } = useTranslation('auth');
  const redirectTo = useAuthRedirectUrl(
    `/auth/callback?redirectAfterSignin=${encodeURIComponent(redirectAfterSignin ?? redirectPath)}`
  );

  const providers = useMemo<
    Partial<
      Record<
        Provider,
        {
          name: string;
          color: string;
          icon?: ReactJSXElement;
        }
      >
    >
  >(
    () => ({
      google: {
        name: t('providers.google'),
        icon: <FaGoogle />,
        color: '#4285F4',
      },
      apple: {
        name: t('providers.apple'),
        icon: <FaApple />,
        color: '#000',
      },
      facebook: {
        name: t('providers.facebook'),
        icon: <FaFacebook />,
        color: '#3b5998',
      },
      twitter: {
        name: t('providers.twitter'),
        icon: <FaTwitter />,
        color: '#1DA1F2',
      },
      github: {
        name: t('providers.github'),
        icon: <FaGithub />,
        color: '#222',
      },
      azure: {
        name: t('providers.azure'),
        icon: <FaMicrosoft />,
        color: '#0078d4',
      },
      bitbucket: {
        name: t('providers.bitbucket'),
        icon: <FaBitbucket />,
        color: '#205081',
      },
      linkedin: {
        name: t('providers.linkedin'),
        icon: <FaLinkedin />,
        color: '#0077b5',
      },
      discord: {
        name: t('providers.discord'),
        icon: <FaDiscord />,
        color: '#7289DA',
      },
      gitlab: {
        name: t('providers.gitlab'),
        icon: <FaGitlab />,
        color: '#f39c12',
      },
      keycloak: {
        name: t('providers.keycloak'),
        color: '#00a0e3',
      },
      notion: {
        name: t('providers.notion'),
        icon: <SiNotion />,
        color: '#000',
      },
      slack: {
        name: t('providers.slack'),
        icon: <FaSlack />,
        color: '#2eb886',
      },
      spotify: {
        name: t('providers.spotify'),
        icon: <FaSpotify />,
        color: '#1db954',
      },
      twitch: {
        name: t('providers.twitch'),
        icon: <FaTwitch />,
        color: '#6441a5',
      },
      workos: {
        name: t('providers.workos'),
        color: '#6363f1',
      },
    }),
    [t]
  );

  const providerData = useMemo(() => providers[provider], [provider, providers]);

  const signIn = useCallback(
    () => supabaseClient.auth.signInWithOAuth({ provider, options: { redirectTo } }),
    [provider, redirectTo, supabaseClient.auth]
  );

  if (!providerData) {
    return null;
  }

  return (
    <Button
      width="full"
      colorScheme="gray"
      bg={providerData.color}
      color="white"
      _hover={{ bg: darken(providerData.color, 0.05) }}
      _focus={{ bg: darken(providerData.color, 0.1) }}
      onClick={signIn}
    >
      {providerData.icon && (
        <Box fontSize="125%" mr={2}>
          {providerData.icon}
        </Box>
      )}
      {providerData.name}
    </Button>
  );
}
