import { Alert, Button, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function NoSubscriptionAlert() {
  const { t } = useTranslation('app');

  return (
    <Alert p={6} variant="left-accent" colorScheme="primary" rounded="md" mb={8}>
      <VStack align="start" gap={3}>
        <Text>{t('noSubscriptionAlert.message')}</Text>

        <Button as={Link} href="/#pricing" colorScheme="primary">
          {t('noSubscriptionAlert.upgradeButton')}
        </Button>
      </VStack>
    </Alert>
  );
}
