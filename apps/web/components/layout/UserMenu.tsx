import { IconButton, Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useCallback } from 'react';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

import { useUserName } from '@/lib/blog/auth';

export default function UserMenu() {
  const { t } = useTranslation('common');
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const userName = useUserName();

  const signOut = useCallback(async () => {
    await router.push('/');
    supabaseClient.auth.signOut();
  }, [router, supabaseClient.auth]);

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        size="sm"
        aria-label="Options"
        icon={<FaUser />}
        rounded="full"
        colorScheme="primary"
      />
      <MenuList>
        <MenuGroup title={t('userMenu.message', { user: userName })}>
          <MenuItem as={Link} href="/account" icon={<FaUser />}>
            {t('userMenu.account')}
          </MenuItem>

          <MenuItem icon={<FaSignOutAlt />} onClick={() => signOut?.()}>
            {t('userMenu.signOut')}
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}
