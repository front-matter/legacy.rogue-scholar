import {
  SimpleGrid,
  Tab,
  TabList,
  Tabs,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react"
import { useTranslation } from "next-i18next"
import { useState } from "react"

import PricingPlanBox from "@/components/common/SubscriptionItem"
import UserSubscriptionAlert from "@/components/common/UserSubscriptionAlert"
import { recommendedPlanId } from "@/config/subscriptions"
import {
  useSubscriptionPlans,
  useUserSubscriptions,
} from "@/lib/blog/subscriptions"

function SubscriptionTable() {
  const { t } = useTranslation("common")
  const [billingInterval, setBillingInterval] = useState<"month" | "year">(
    "month"
  )
  const { plans } = useSubscriptionPlans()
  const { currentlySubscribedPlan } = useUserSubscriptions()
  const bgColor = useColorModeValue("primary.50", "gray.900")

  return (
    <VStack align="stretch" gap={6} mt={-6}>
      <Tabs
        onChange={(index) => setBillingInterval(index === 0 ? "month" : "year")}
        variant="soft-rounded"
        colorScheme="primary"
        bg={bgColor}
        p={1}
        mx="auto"
        rounded="full"
      >
        <TabList justifyContent="center">
          <Tab>{t("pricing.intervals.monthly")}</Tab>
          <Tab>{t("pricing.intervals.yearly")}</Tab>
        </TabList>
      </Tabs>

      {plans && (
        <SimpleGrid
          columns={{ base: 1, md: plans.length }}
          gap={4}
          alignItems="start"
        >
          {plans.map((plan) => (
            <PricingPlanBox
              key={plan.id}
              plan={plan}
              billingInterval={billingInterval}
              isHighlighted={recommendedPlanId === plan.id}
              hideSubscribeButton={currentlySubscribedPlan !== null}
            />
          ))}
        </SimpleGrid>
      )}

      {currentlySubscribedPlan && <UserSubscriptionAlert />}
    </VStack>
  )
}
export default SubscriptionTable
