import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { useCallback, useMemo, useState } from "react"

import { SubscriptionPlanId } from "@/config/subscriptions"
import { getStripe } from "@/lib/blog/stripe-client"
import { SubscriptionPlan } from "@/types/payments"
import { Database } from "@/types/supabase"

export function useSubscriptionPlans() {
  const supabase = useSupabaseClient<Database>()
  const { t } = useTranslation("common")

  const { data: plans, isFetched: loading } = useQuery(
    ["subscription-plans"],
    async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, prices(*)")
        .eq("active", true)
        .eq("prices.active", true)
        .order("metadata->index")
        .order("unit_amount", { foreignTable: "prices" })

      if (error) {
        throw error
      }

      return data.map((plan) => {
        const prices = plan.prices
          ? Array.isArray(plan.prices)
            ? plan.prices
            : [plan.prices]
          : []

        return {
          id: plan.id,
          prices: prices.map((price) => ({
            id: price.id,
            currency: price.currency,
            interval: price.interval,
            interval_count: price.interval_count,
            unit_amount: price.unit_amount,
          })),
        } as SubscriptionPlan
      })
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const localizedPlans = useMemo(() => {
    const translations: Record<
      string,
      { name?: string; description?: string; features?: string[] }
    > = {
      [SubscriptionPlanId.Starter]: {
        name: t("subscriptionPlans.starter.name"),
        description: t("subscriptionPlans.starter.description"),
        features: [
          t("subscriptionPlans.starter.features.0"),
          t("subscriptionPlans.starter.features.1"),
          t("subscriptionPlans.starter.features.2"),
        ],
      },
      [SubscriptionPlanId.Team]: {
        name: t("subscriptionPlans.team.name"),
        description: t("subscriptionPlans.team.description"),
        features: [
          t("subscriptionPlans.team.features.0"),
          t("subscriptionPlans.team.features.1"),
        ],
      },
      [SubscriptionPlanId.Enterprise]: {
        name: t("subscriptionPlans.enterprise.name"),
        description: t("subscriptionPlans.enterprise.description"),
        features: [
          t("subscriptionPlans.enterprise.features.0"),
          t("subscriptionPlans.enterprise.features.1"),
          t("subscriptionPlans.enterprise.features.2"),
          t("subscriptionPlans.enterprise.features.3"),
          t("subscriptionPlans.enterprise.features.4"),
        ],
      },
    }

    return plans?.map((plan) => ({
      ...plan,
      name: translations[plan.id]?.name ?? plan.name,
      description: translations[plan.id]?.description ?? plan.description,
      features: translations[plan.id]?.features ?? [],
    }))
  }, [plans, t])

  return { plans: localizedPlans, loading }
}

export function useUserSubscriptions() {
  const { plans } = useSubscriptionPlans()
  const supabase = useSupabaseClient<Database>()

  const { data: subscriptions, isFetching: loading } = useQuery(
    ["user-subscriptions"],
    async () => {
      const { data } = await supabase.from("subscriptions").select("*")

      return data
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const currentlySubscribedPlan = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) {
      return null
    }

    const activeSubscription = subscriptions.find(
      // we only care about active subscriptions (this can include trial or not yet paid (incomplete))
      (subscription) =>
        subscription.status &&
        ["active", "trialing", "incomplete"].includes(subscription.status)
    )

    if (!activeSubscription) {
      return null
    }

    // get the plan for the active subscription
    const subscribedPlan =
      plans?.find((plan) =>
        plan.prices.some((price) => price.id === activeSubscription.price_id)
      ) ?? null

    if (!subscribedPlan) {
      return null
    }

    // only return the price that the user is subscribed to
    const subscribedPrice = subscribedPlan.prices.filter(
      (price) => price.id === activeSubscription.price_id
    )

    return { ...subscribedPlan, price: subscribedPrice[0] }
  }, [subscriptions, plans])

  return { currentlySubscribedPlan, subscriptions, loading }
}

export function useSubscriptionActions() {
  const router = useRouter()
  const user = useUser()
  const [loading, setLoading] = useState(false)

  const subscribe = useCallback(
    async (priceId: string) => {
      setLoading(true)

      if (!user) {
        router.push(
          `/auth/signin?redirectAfterSignin=${encodeURIComponent("/#pricing")}`
        )
        return
      }

      try {
        const {
          data: { sessionId },
        } = await axios.post("/api/stripe-checkout-session", {
          priceId,
          metadata: {
            userId: user.id,
          },
        })

        if (!sessionId) {
          throw new Error("No session id returned")
        }

        const stripeClient = await getStripe()

        await stripeClient?.redirectToCheckout({ sessionId })
      } catch (error) {
        console.error(error)
      }

      setLoading(false)
    },
    [router, user]
  )

  const manageSubscription = useCallback(async () => {
    setLoading(true)

    try {
      const {
        data: { url },
      } = await axios.post("/api/stripe-portal-link")

      if (!url) {
        throw new Error("No portal url returned")
      }
      window.location.assign(url)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }, [])

  return {
    subscribe,
    manageSubscription,
    loading,
  }
}
