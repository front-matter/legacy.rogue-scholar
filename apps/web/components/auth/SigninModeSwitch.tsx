import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

export enum SigninMode {
  Password = 'password',
  MagicLink = 'magic-link',
}

export default function SigninModeSwitch({
  activeMode,
  onChange,
}: {
  activeMode: SigninMode;
  onChange: (mode: SigninMode) => void;
}) {
  const { t } = useTranslation('auth');

  const modes = useMemo<Array<{ key: SigninMode; title: string }>>(
    () => [
      {
        key: SigninMode.MagicLink,
        title: t('signin.mode.magicLink'),
      },
      {
        key: SigninMode.Password,
        title: t('signin.mode.password'),
      },
    ],
    [t]
  );

  return (
    <Flex
      justify="center"
      borderBottom="2px"
      borderColor={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      w="full"
    >
      {modes.map((mode) => (
        <Box
          key={mode.key}
          as="button"
          type="button"
          display="block"
          px={6}
          py={2}
          w="50%"
          mb="-2px"
          borderBottom="2px solid"
          borderColor={mode.key === activeMode ? 'primary.500' : 'transparent'}
          fontSize="sm"
          fontWeight={mode.key === activeMode ? 'bold' : 'normal'}
          color={mode.key === activeMode ? 'primary.500' : 'inherit'}
          onClick={() => onChange(mode.key)}
          cursor="pointer"
          _hover={{ textDecoration: 'none', color: mode.key === activeMode ? 'primary.500' : 'primary.600' }}
        >
          {mode.title}
        </Box>
      ))}
    </Flex>
  );
}
