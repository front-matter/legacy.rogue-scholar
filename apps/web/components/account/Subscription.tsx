import { Button, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMemo } from 'react';

import AccountSection from '@/components/account/AccountSection';
import Loader from '@/components/common/Loader';
import { useSubscriptionActions, useUserSubscriptions } from '@/lib/blog/subscriptions';
import { formatPrice } from '@/lib/helpers';

function Subscription() {
  const router = useRouter();
  const { t } = useTranslation(['account', 'common']);
  const { locale } = useRouter();
  const { currentlySubscribedPlan, loading: loadingSubscriptions } = useUserSubscriptions();
  const { manageSubscription, loading } = useSubscriptionActions();
  const highlightColor = useColorModeValue('primary.500', 'primary.400');

  const price = useMemo(() => currentlySubscribedPlan?.prices[0], [currentlySubscribedPlan]);

  const formattedPrice = useMemo(
    () =>
      price
        ? formatPrice({
            locale,
            currency: price.currency,
            amount: price.unit_amount ?? 0,
          })
        : '',
    [price, locale]
  );

  return (
    <AccountSection title={t('subscription.title')}>
      {loadingSubscriptions ? (
        <Loader />
      ) : currentlySubscribedPlan ? (
        <VStack align="start">
          <Text>{t('subscription.currentlySubscribed')}</Text>
          <Text fontWeight="bold" fontSize="2xl" color={highlightColor}>
            {currentlySubscribedPlan.name} – {formattedPrice}
            {price && (
              <Text as="small" fontSize="sm" opacity={0.75}>
                {' '}
                / {price.interval_count && price.interval_count > 1 ? price.interval_count : ''}{' '}
                {t(`pricing.intervals.${price.interval}`, { ns: 'common' })}
              </Text>
            )}
          </Text>
          <Button variant="outline" colorScheme="primary" isLoading={loading} onClick={manageSubscription}>
            {t('manageSubscription')}
          </Button>
        </VStack>
      ) : (
        <VStack align="start">
          <Text>{t('subscription.notSubscribed')}</Text>
          <Button variant="outline" colorScheme="primary" isLoading={loading} onClick={() => router.push('/#pricing')}>
            {t('upgradeAccount')}
          </Button>
        </VStack>
      )}
    </AccountSection>
  );
}
export default Subscription;
