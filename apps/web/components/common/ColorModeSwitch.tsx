import { IconButton, useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function ColorModeSwitch() {
  const { t } = useTranslation('common');
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      size="sm"
      aria-label={colorMode === 'light' ? t('colorMode.dark') : t('colorMode.light')}
      icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
      onClick={toggleColorMode}
      variant="ghost"
    ></IconButton>
  );
}
